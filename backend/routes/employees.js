const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 10, department, status } = req.query;
    
    let query = {};
    
    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username email profile isActive lastLogin');

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('user', 'username email profile isActive lastLogin');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.userRole === 'employee') {
      const currentEmployee = await Employee.findOne({ user: req.userId });
      if (!currentEmployee || currentEmployee._id.toString() !== employee._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({ employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth, [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('salary.base').isNumeric().withMessage('Base salary must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { username, email, password, department, position, salary, profile } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      role: 'employee',
      profile: profile || {}
    });

    await user.save();

    const employeeId = `EMP${Date.now().toString().slice(-6)}`;
    const employee = new Employee({
      user: user._id,
      employeeId,
      department,
      position,
      hireDate: new Date(),
      salary: salary || { base: 0 }
    });

    await employee.save();
    await employee.populate('user', 'username email profile');

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.userRole === 'employee') {
      const currentEmployee = await Employee.findOne({ user: req.userId });
      if (!currentEmployee || currentEmployee._id.toString() !== employee._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const updates = req.body;
    
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      const allowedFields = ['emergencyContact'];
      Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete updates[key];
        }
      });
    }

    Object.keys(updates).forEach(key => {
      employee[key] = updates[key];
    });

    await employee.save();
    await employee.populate('user', 'username email profile');

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await User.findByIdAndDelete(employee.user);
    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/departments/list', auth, async (req, res) => {
  try {
    const departments = await Employee.distinct('department');
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/positions/list', auth, async (req, res) => {
  try {
    const positions = await Employee.distinct('position');
    res.json({ positions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
