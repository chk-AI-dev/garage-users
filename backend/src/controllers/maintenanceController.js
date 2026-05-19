const Maintenance = require('../models/maintenance');
const Equipment = require('../models/equipments');
const { validationResult } = require('express-validator');

exports.getAllMaintenance = async (req, res) => {
  try {
    const { machineId, status, page = 1, limit = 25, search } = req.query;
    const query = {};

    if (machineId) query.machineId = machineId;
    if (status) query.status = status;
    if (search) query.$or = [{ status: { $regex: search, $options: 'i' } }];

    const skip = (page - 1) * limit;
    const found = await Maintenance.find(query);
    let items;
    if (Array.isArray(found)) {
      const sorted = found.sort((a, b) => new Date(a.next_due) - new Date(b.next_due));
      items = sorted.slice(skip, skip + parseInt(limit));
    } else {
      items = await Maintenance.find(query).populate('machineId', 'equipmentId type').skip(skip).limit(parseInt(limit)).sort({ next_due: 1 });
    }
    const total = await Maintenance.countDocuments(query);
    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaintenance = async (req, res) => {
  try {
    const item = await Maintenance.findById(req.params.id).populate('machineId', 'equipmentId type');
    if (!item) return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMaintenance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const { machineId, last_service, service_hours, current_hours, next_due, status } = req.body;
    if (machineId) {
      const eq = await Equipment.findById(machineId);
      if (!eq) return res.status(404).json({ success: false, message: 'Machine (equipment) not found' });
    }

    const item = await Maintenance.create({ machineId, last_service: last_service ? new Date(last_service) : new Date(), service_hours, current_hours, next_due: next_due ? new Date(next_due) : null, status });
    res.status(201).json({ success: true, message: 'Maintenance record created', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const item = await Maintenance.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Maintenance record not found' });

    const { machineId, last_service, service_hours, current_hours, next_due, status } = req.body;
    if (machineId) item.machineId = machineId;
    if (last_service) item.last_service = new Date(last_service);
    if (service_hours !== undefined) item.service_hours = service_hours;
    if (current_hours !== undefined) item.current_hours = current_hours;
    if (next_due) item.next_due = new Date(next_due);
    if (status) item.status = status;

    await item.save();
    res.json({ success: true, message: 'Maintenance record updated', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const item = await Maintenance.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    res.json({ success: true, message: 'Maintenance record deleted', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaintenanceStats = async (req, res) => {
  try {
    const { dueBefore } = req.query;
    const match = {};
    if (dueBefore) match.next_due = { $lte: new Date(dueBefore) };

    const total = await Maintenance.countDocuments(match);
    const byStatus = await Maintenance.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]);

    res.json({ success: true, stats: { total, byStatus } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
