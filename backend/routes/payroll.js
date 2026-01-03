const express = require('express');
const { body, validationResult } = require('express-validator');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { employeeId, payPeriodStart, payPeriodEnd } = req.body;
    
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const startDate = new Date(payPeriodStart);
    const endDate = new Date(payPeriodEnd);

    const attendance = await Attendance.find({
      employee: employeeId,
      date: { $gte: startDate, $lte: endDate }
    });

    const workingDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;
    const leaveDays = attendance.filter(a => a.status === 'on_leave').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;

    const basicSalary = employee.salary.base;
    const dailyRate = basicSalary / 30;
    const earnedSalary = dailyRate * presentDays;

    const payroll = new Payroll({
      employee: employeeId,
      payPeriod: {
        start: startDate,
        end: endDate
      },
      basicSalary,
      attendance: {
        workingDays,
        presentDays,
        absentDays,
        leaveDays,
        lateDays
      },
      grossSalary: earnedSalary,
      netSalary: earnedSalary,
      status: 'draft'
    });

    await payroll.save();
    await payroll.populate('employee', 'employeeId');

    res.status(201).json({
      message: 'Payroll calculated successfully',
      payroll
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, employeeId, status } = req.query;
    
    let query = {};
    
    if (req.userRole === 'employee') {
      const employee = await Employee.findOne({ user: req.userId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      query.employee = employee._id;
    } else if (employeeId) {
      query.employee = employeeId;
    }

    if (status) {
      query.status = status;
    }

    const payrolls = await Payroll.find(query)
      .sort({ 'payPeriod.end': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('employee', 'employeeId')
      .populate('employee.user', 'username profile');

    const total = await Payroll.countDocuments(query);

    res.json({
      payrolls,
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

    const payroll = await Payroll.findById(req.params.id).populate('employee');
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    if (payroll.status !== 'draft') {
      return res.status(400).json({ message: 'Payroll already processed' });
    }

    payroll.status = 'approved';
    payroll.approvedBy = req.userId;

    await payroll.save();

    res.json({
      message: 'Payroll approved successfully',
      payroll
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/payslip/:id', auth, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee', 'employeeId department position')
      .populate('employee.user', 'username profile')
      .populate('approvedBy', 'username');

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    if (req.userRole === 'employee') {
      const employee = await Employee.findOne({ user: req.userId });
      if (!employee || employee._id.toString() !== payroll.employee._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({
      payroll,
      payslipData: {
        employee: payroll.employee,
        payPeriod: payroll.payPeriod,
        basicSalary: payroll.basicSalary,
        allowances: payroll.allowances,
        deductions: payroll.deductions,
        grossSalary: payroll.grossSalary,
        netSalary: payroll.netSalary,
        attendance: payroll.attendance,
        generatedDate: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
