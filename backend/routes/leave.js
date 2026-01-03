const express = require('express');
const { body, validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, [
  body('type').isIn(['annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid']),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  body('reason').trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, startDate, endDate, reason } = req.body;
    
    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const leave = new Leave({
      employee: employee._id,
      type,
      startDate: start,
      endDate: end,
      days,
      reason
    });

    await leave.save();
    await leave.populate('employee', 'employeeId');

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let query = { employee: employee._id };
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('employee', 'employeeId');

    const total = await Leave.countDocuments(query);

    res.json({
      leaves,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = {};
    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('employee', 'employeeId')
      .populate('employee.user', 'username profile');

    const total = await Leave.countDocuments(query);

    res.json({
      leaves,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/approve', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { action, rejectionReason } = req.body;
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const leave = await Leave.findById(req.params.id).populate('employee');
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave request already processed' });
    }

    leave.status = action === 'approve' ? 'approved' : 'rejected';
    leave.approvedBy = req.userId;
    leave.approvedDate = new Date();

    if (action === 'reject' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    res.json({
      message: `Leave request ${action}d successfully`,
      leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const leave = await Leave.findOne({
      _id: req.params.id,
      employee: employee._id
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status === 'approved') {
      return res.status(400).json({ message: 'Cannot cancel approved leave request' });
    }

    leave.status = 'cancelled';
    await leave.save();

    res.json({
      message: 'Leave request cancelled successfully',
      leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
