const DieselLog = require('../models/diesel_log');
const { validationResult } = require('express-validator');
// Controller for diesel logs - CRUD operations and stats
exports.getAllDieselLogs = async (req, res) => {
  try {
    const { date, page = 1, limit = 25, search } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }

    if (search) {
      query.$or = [
        { alert: { $regex: search, $options: 'i' } }
      ];
    }
    // Pagination and sorting
    const skip = (page - 1) * limit;
    const found = await DieselLog.find(query);
    let logs;
    if (Array.isArray(found)) {
      const sorted = found.sort((a, b) => new Date(b.date) - new Date(a.date));
      logs = sorted.slice(skip, skip + parseInt(limit));
    } else {
      logs = await DieselLog.find(query).skip(skip).limit(parseInt(limit)).sort({ date: -1 });
    }

    const total = await DieselLog.countDocuments(query);
    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get a single diesel log entry by ID
exports.getDieselLog = async (req, res) => {
  try {
    const log = await DieselLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Diesel log not found' });
    res.json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Create a new diesel log entry
exports.createDieselLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const { date, opening, received, issued, closing, alert } = req.body;
    const log = await DieselLog.create({ date: date ? new Date(date) : new Date(), opening, received, issued, closing, alert: !!alert });
    res.status(201).json({ success: true, message: 'Diesel log created', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDieselLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const log = await DieselLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Diesel log not found' });

    const { date, opening, received, issued, closing, alert } = req.body;
    if (date) log.date = new Date(date);
    if (opening !== undefined) log.opening = opening;
    if (received !== undefined) log.received = received;
    if (issued !== undefined) log.issued = issued;
    if (closing !== undefined) log.closing = closing;
    if (alert !== undefined) log.alert = !!alert;

    await log.save();
    res.json({ success: true, message: 'Diesel log updated', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDieselLog = async (req, res) => {
  try {
    const log = await DieselLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Diesel log not found' });
    res.json({ success: true, message: 'Diesel log deleted', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDieselStats = async (req, res) => {
  try {
    const { date } = req.query;
    const match = {};
    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      match.date = { $gte: start, $lte: end };
    }

    const total = await DieselLog.countDocuments(match);
    const summary = await DieselLog.aggregate([
      { $match: match },
      { $group: { _id: null, totalOpening: { $sum: '$opening' }, totalReceived: { $sum: '$received' }, totalIssued: { $sum: '$issued' }, totalClosing: { $sum: '$closing' } } }
    ]);

    res.json({ success: true, stats: { total, summary: summary[0] || {} } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
