const express = require('express');
const { body, validationResult } = require('express-validator');
const Performance = require('../models/Performance');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, [
  body('employee').isMongoId().withMessage('Valid employee ID required'),
  body('type').isIn(['quarterly', 'semi-annual', 'annual', 'probation']),
  body('reviewPeriod.start').isISO8601().toDate(),
  body('reviewPeriod.end').isISO8601().toDate(),
  body('goals').isArray().withMessage('Goals must be an array'),
  body('competencies').isArray().withMessage('Competencies must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { employee: employeeId, type, reviewPeriod, goals, competencies, strengths, areasForImprovement, employeeComments, reviewerComments } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let overallScore = 0;
    let totalWeight = 0;

    goals.forEach(goal => {
      if (goal.weight && goal.achieved !== undefined) {
        const goalScore = (goal.achieved / 100) * goal.weight;
        overallScore += goalScore;
        totalWeight += goal.weight;
      }
    });

    competencies.forEach(competency => {
      if (competency.rating) {
        overallScore += competency.rating;
        totalWeight += 5;
      }
    });

    const finalScore = totalWeight > 0 ? (overallScore / totalWeight) * 5 : 0;

    const performance = new Performance({
      employee: employeeId,
      reviewPeriod,
      reviewer: req.userId,
      type,
      goals,
      competencies,
      overallScore: Math.round(finalScore * 10) / 10,
      strengths: strengths || [],
      areasForImprovement: areasForImprovement || [],
      employeeComments,
      reviewerComments,
      status: 'draft'
    });

    await performance.save();
    await performance.populate('employee', 'employeeId');
    await performance.populate('reviewer', 'username');

    res.status(201).json({
      message: 'Performance review created successfully',
      performance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, employeeId, status, type } = req.query;
    
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

    if (type) {
      query.type = type;
    }

    const performances = await Performance.find(query)
      .sort({ 'reviewPeriod.end': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('employee', 'employeeId')
      .populate('employee.user', 'username profile')
      .populate('reviewer', 'username');

    const total = await Performance.countDocuments(query);

    res.json({
      performances,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance review not found' });
    }

    if (req.userRole === 'employee' && performance.employee.toString() !== (await Employee.findOne({ user: req.userId }))._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.userRole !== 'admin' && req.userRole !== 'hr' && performance.reviewer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      performance[key] = updates[key];
    });

    await performance.save();
    await performance.populate('employee', 'employeeId');
    await performance.populate('reviewer', 'username');

    res.json({
      message: 'Performance review updated successfully',
      performance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    
    if (!['draft', 'submitted', 'reviewed', 'approved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const performance = await Performance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance review not found' });
    }

    performance.status = status;
    await performance.save();

    res.json({
      message: 'Performance review status updated successfully',
      performance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/summary/:employeeId', auth, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const performances = await Performance.find({ employee: employeeId })
      .sort({ 'reviewPeriod.end': -1 })
      .populate('employee', 'employeeId')
      .populate('reviewer', 'username');

    const summary = {
      totalReviews: performances.length,
      averageScore: performances.reduce((sum, p) => sum + p.overallScore, 0) / performances.length || 0,
      latestReview: performances[0] || null,
      reviewsByType: {},
      recentTrend: performances.slice(0, 5).map(p => ({
        period: p.reviewPeriod,
        score: p.overallScore,
        type: p.type
      }))
    };

    performances.forEach(p => {
      summary.reviewsByType[p.type] = (summary.reviewsByType[p.type] || 0) + 1;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
