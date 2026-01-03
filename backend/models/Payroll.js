const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  payPeriod: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  basicSalary: {
    type: Number,
    required: true
  },
  allowances: [{
    name: String,
    amount: Number,
    type: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed'
    }
  }],
  deductions: [{
    name: String,
    amount: Number,
    type: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed'
    }
  }],
  overtime: {
    hours: Number,
    rate: Number,
    amount: Number
  },
  attendance: {
    workingDays: Number,
    presentDays: Number,
    absentDays: Number,
    leaveDays: Number,
    lateDays: Number
  },
  grossSalary: Number,
  netSalary: Number,
  status: {
    type: String,
    enum: ['draft', 'calculated', 'approved', 'paid'],
    default: 'draft'
  },
  paymentDate: Date,
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'check'],
    default: 'bank_transfer'
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  payslip: {
    generated: {
      type: Boolean,
      default: false
    },
    url: String,
    generatedDate: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payroll', payrollSchema);
