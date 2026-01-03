const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/checkin', auth, async (req, res) => {
  try {
    const { location, method } = req.body;
    
    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const existingAttendance = await Attendance.findOne({
      employee: employee._id,
      date: { $gte: today }
    });

    if (existingAttendance && existingAttendance.checkIn.time) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = existingAttendance || new Attendance({
      employee: employee._id,
      date: new Date()
    });

    attendance.checkIn = {
      time: new Date(),
      location: location || 'Office',
      method: method || 'manual'
    };

    await attendance.save();

    res.json({
      message: 'Check-in successful',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/checkout', auth, async (req, res) => {
  try {
    const { location, method } = req.body;
    
    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: { $gte: today }
    });

    if (!attendance || !attendance.checkIn.time) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOut.time) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOut = {
      time: new Date(),
      location: location || 'Office',
      method: method || 'manual'
    };

    const checkInTime = new Date(attendance.checkIn.time);
    const checkOutTime = new Date(attendance.checkOut.time);
    const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    
    attendance.totalHours = totalHours;
    attendance.status = totalHours >= 8 ? 'present' : 'half_day';

    await attendance.save();

    res.json({
      message: 'Check-out successful',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let query = { employee: employee._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('employee', 'employeeId');

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
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
    const { page = 1, limit = 10, date } = req.query;
    
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = {};
    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = {
        $gte: targetDate,
        $lt: nextDate
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('employee', 'employeeId')
      .populate('employee.user', 'username profile');

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
