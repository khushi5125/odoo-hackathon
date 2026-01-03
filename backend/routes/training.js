const express = require('express');
const { body, validationResult } = require('express-validator');
const Training = require('../models/Training');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('type').isIn(['technical', 'soft_skills', 'compliance', 'leadership', 'onboarding']),
  body('format').isIn(['online', 'offline', 'hybrid']),
  body('schedule.startDate').isISO8601().toDate(),
  body('schedule.endDate').isISO8601().toDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const trainingData = req.body;
    
    const training = new Training(trainingData);
    await training.save();

    res.status(201).json({
      message: 'Training program created successfully',
      training
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, format } = req.query;
    
    let query = {};
    
    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (format) {
      query.format = format;
    }

    const trainings = await Training.find(query)
      .sort({ 'schedule.startDate': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('participants.employee', 'employeeId')
      .populate('participants.employee.user', 'username profile');

    const total = await Training.countDocuments(query);

    res.json({
      trainings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (training.status !== 'planned' && training.status !== 'active') {
      return res.status(400).json({ message: 'Training is not available for enrollment' });
    }

    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const existingEnrollment = training.participants.find(
      p => p.employee.toString() === employee._id.toString()
    );

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this training' });
    }

    if (training.maxParticipants && training.participants.length >= training.maxParticipants) {
      return res.status(400).json({ message: 'Training is full' });
    }

    training.participants.push({
      employee: employee._id,
      enrollmentDate: new Date(),
      status: 'enrolled'
    });

    await training.save();

    res.json({
      message: 'Enrolled successfully',
      training
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my-enrollments', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const trainings = await Training.find({
      'participants.employee': employee._id
    })
    .sort({ 'schedule.startDate': -1 })
    .populate('participants.employee', 'employeeId');

    const enrollments = trainings.map(training => {
      const participant = training.participants.find(
        p => p.employee.toString() === employee._id.toString()
      );
      
      return {
        training,
        enrollment: participant
      };
    });

    res.json({
      enrollments
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
    
    if (!['planned', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    training.status = status;
    
    if (status === 'completed') {
      training.participants.forEach(participant => {
        if (participant.status === 'in_progress') {
          participant.status = 'completed';
          participant.completionDate = new Date();
        }
      });
    }

    await training.save();

    res.json({
      message: 'Training status updated successfully',
      training
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/participant/:participantId/progress', auth, async (req, res) => {
  try {
    const { status, score } = req.body;
    
    if (!['enrolled', 'in_progress', 'completed', 'dropped'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    const participant = training.participants.id(req.params.participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    participant.status = status;
    
    if (status === 'completed') {
      participant.completionDate = new Date();
      if (score !== undefined) {
        participant.score = score;
      }
    }

    await training.save();

    res.json({
      message: 'Participant progress updated successfully',
      training
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/analytics', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'hr') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const trainings = await Training.find({});
    
    const analytics = {
      totalTrainings: trainings.length,
      activeTrainings: trainings.filter(t => t.status === 'active').length,
      completedTrainings: trainings.filter(t => t.status === 'completed').length,
      totalParticipants: trainings.reduce((sum, t) => sum + t.participants.length, 0),
      trainingsByType: {},
      averageCompletionRate: 0,
      upcomingTrainings: trainings
        .filter(t => t.status === 'planned' && new Date(t.schedule.startDate) > new Date())
        .sort((a, b) => new Date(a.schedule.startDate) - new Date(b.schedule.startDate))
        .slice(0, 5)
    };

    trainings.forEach(training => {
      analytics.trainingsByType[training.type] = (analytics.trainingsByType[training.type] || 0) + 1;
    });

    const completedParticipants = trainings.reduce((sum, t) => 
      sum + t.participants.filter(p => p.status === 'completed').length, 0
    );
    
    analytics.averageCompletionRate = analytics.totalParticipants > 0 
      ? (completedParticipants / analytics.totalParticipants) * 100 
      : 0;

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
