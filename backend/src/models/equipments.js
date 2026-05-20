const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  equipmentId: {
    type: String,
    required: [true, 'Equipment ID is required'],
    unique: true,
    uppercase: true,
    trim: true,
    example: 'EX-01, TP-01, DZ-01'
  },
  type: {
    type: String,
    required: [true, 'Equipment type is required'],
    enum: ['Excavator', 'Tipper', 'Dozer', 'Grader', 'Diesel Bowser', 'Crane', 'Loader', 'Other'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Working', 'In Maintenance', 'Out of Service', 'Inactive'],
    default: 'Working'
  },
  capacity: {
    type: String,
    trim: true,
    example: '2.5 Cum, 20 Ton'
  },
  assignedArea: {
    type: String,
    trim: true,
    example: 'Pit A, Route, Site B'
  },
  lastMaintenanceDate: {
    type: Date
  },
  nextMaintenanceDate: {
    type: Date
  },
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  purchaseDate: {
    type: Date
  },
  registrationNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
equipmentSchema.index({ equipmentId: 1 });
equipmentSchema.index({ type: 1 });
equipmentSchema.index({ status: 1 });

// Pre-save middleware to update updatedAt
equipmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Equipment', equipmentSchema);