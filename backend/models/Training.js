const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'soft_skills', 'compliance', 'leadership', 'onboarding'],
    required: true
  },
  category: String,
  instructor: {
    name: String,
    email: String,
    bio: String
  },
  duration: {
    hours: Number,
    days: Number
  },
  format: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online'
  },
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    sessions: [{
      date: Date,
      startTime: String,
      endTime: String,
      location: String,
      meetingLink: String
    }]
  },
  participants: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['enrolled', 'in_progress', 'completed', 'dropped'],
      default: 'enrolled'
    },
    completionDate: Date,
    score: Number,
    certificate: {
      issued: Boolean,
      url: String,
      issuedDate: Date
    }
  }],
  materials: [{
    name: String,
    type: String,
    url: String,
    uploadDate: Date
  }],
  assessments: [{
    title: String,
    type: {
      type: String,
      enum: ['quiz', 'assignment', 'project', 'exam']
    },
    totalMarks: Number,
    passingMarks: Number,
    dueDate: Date
  }],
  budget: {
    total: Number,
    perEmployee: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned'
  },
  maxParticipants: Number,
  prerequisites: [String],
  objectives: [String],
  outcomes: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Training', trainingSchema);
