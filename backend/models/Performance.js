const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  reviewPeriod: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['quarterly', 'semi-annual', 'annual', 'probation'],
    required: true
  },
  goals: [{
    title: String,
    description: String,
    weight: Number,
    achieved: Number,
    score: Number,
    comments: String
  }],
  competencies: [{
    name: String,
    description: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }],
  overallScore: {
    type: Number,
    min: 1,
    max: 5
  },
  strengths: [String],
  areasForImprovement: [String],
  employeeComments: String,
  reviewerComments: String,
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'approved'],
    default: 'draft'
  },
  nextReviewDate: Date,
  recommendations: [{
    type: String,
    enum: ['promotion', 'bonus', 'training', 'warning', 'no_action']
  }],
  actionPlan: {
    created: Boolean,
    goals: [String],
    timeline: String,
    followUpDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);
