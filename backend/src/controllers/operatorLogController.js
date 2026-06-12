const OperatorLog = require('../models/operator_log');
const Equipment = require('../models/equipments');
const { validationResult } = require('express-validator');
// Controller for operator logs -   CRUD operations and stats
exports.getAllOperatorLogs = async (req, res) => {
  try {
    const { date, operatorName, status, page = 1, limit = 25, search } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      query.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }
    if (operatorName) query.operatorName = { $regex: operatorName, $options: 'i' };
    if (status) query.status = status;
    if (search) query.$or = [{ operatorName: { $regex: search, $options: 'i' } }, { shift: { $regex: search, $options: 'i' } }];
    //  Pagination and sorting
    const skip = (page - 1) * limit;
    const found = await OperatorLog.find(query);
    let logs;
    if (Array.isArray(found)) {
      const sorted = found.sort((a, b) => new Date(b.date) - new Date(a.date));
      logs = sorted.slice(skip, skip + parseInt(limit));
    } else {
      logs = await OperatorLog.find(query).populate('machineId', 'equipmentId type').skip(skip).limit(parseInt(limit)).sort({ date: -1 });
    }
    const total = await OperatorLog.countDocuments(query);
    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOperatorLog = async (req, res) => {
  try {
    const log = await OperatorLog.findById(req.params.id).populate('machineId', 'equipmentId type');
    if (!log) return res.status(404).json({ success: false, message: 'Operator log not found' });
    res.json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOperatorLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const { date, machineId, operatorName, shift, hours, efficiency, status } = req.body;
    if (machineId) {
      const eq = await Equipment.findById(machineId);
      if (!eq) return res.status(404).json({ success: false, message: 'Machine (equipment) not found' });
    }

    const log = await OperatorLog.create({ date: date ? new Date(date) : new Date(), machineId, operatorName, shift, hours, efficiency, status });
    res.status(201).json({ success: true, message: 'Operator log created', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOperatorLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const log = await OperatorLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Operator log not found' });

    const { date, machineId, operatorName, shift, hours, efficiency, status } = req.body;
    if (date) log.date = new Date(date);
    if (machineId) log.machineId = machineId;
    if (operatorName) log.operatorName = operatorName;
    if (shift) log.shift = shift;
    if (hours !== undefined) log.hours = hours;
    if (efficiency !== undefined) log.efficiency = efficiency;
    if (status) log.status = status;

    await log.save();
    res.json({ success: true, message: 'Operator log updated', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOperatorLog = async (req, res) => {
  try {
    const log = await OperatorLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Operator log not found' });
    res.json({ success: true, message: 'Operator log deleted', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOperatorStats = async (req, res) => {
  try {
    const { date } = req.query;
    const match = {};
    if (date) {
      const d = new Date(date);
      match.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }

    const total = await OperatorLog.countDocuments(match);
    const byOperator = await OperatorLog.aggregate([{ $match: match }, { $group: { _id: '$operatorName', totalHours: { $sum: '$hours' }, avgEfficiency: { $avg: '$efficiency' } } }]);

    res.json({ success: true, stats: { total, byOperator } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
