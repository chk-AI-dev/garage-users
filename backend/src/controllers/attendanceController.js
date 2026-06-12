const Attendance = require('../models/attendance');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all attendance records (Admin/Supervisor only)
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, name, role, location, page = 1, limit = 25, search } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }

    if (name) query.name = { $regex: name, $options: 'i' };
    if (role) query.role = role;
    if (location) query.location = { $regex: location, $options: 'i' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const records = await Attendance.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single attendance record
exports.getAttendance = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create attendance (any authenticated user)
exports.createAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
  try {
    const { date, name, role, location, timestamp } = req.body;

    // If user info available, prefer it for name/role
    const creator = req.user || {};
    const record = await Attendance.create({
      date: date ? new Date(date) : new Date(),
      name: name || creator.firstName || creator.name || 'Unknown',
      role: role || creator.role || 'driver',
      location: location || 'Unknown',
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    res.status(201).json({ success: true, message: 'Attendance recorded', record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update attendance (Admin only)
exports.updateAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
  try {
    let record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });

    const { date, name, role, location, timestamp } = req.body;
    if (date) record.date = new Date(date);
    if (name) record.name = name;
    if (role) record.role = role;
    if (location) record.location = location;
    if (timestamp) record.timestamp = new Date(timestamp);

    await record.save();
    res.json({ success: true, message: 'Attendance updated', record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete attendance (Admin only)
exports.deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
    res.json({ success: true, message: 'Attendance deleted', record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance stats (Admin/Supervisor only)
exports.getAttendanceStats = async (req, res) => {
  try {
    const { date } = req.query;
    const match = {};
    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      match.date = { $gte: start, $lte: end };
    }
    // Total count
    const total = await Attendance.countDocuments(match);

    const byRole = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    // Group by location
    const byLocation = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: '$location', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, stats: { total, byRole, byLocation } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
