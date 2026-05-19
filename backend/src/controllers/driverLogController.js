const DriverLog = require('../models/driver_log');
const Equipment = require('../models/equipments');
const { validationResult } = require('express-validator');

exports.getAllDriverLogs = async (req, res) => {
  try {
    const { date, driverName, status, page = 1, limit = 25, search } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }
    if (driverName) query.driverName = { $regex: driverName, $options: 'i' };
    if (status) query.status = status;
    if (search) query.$or = [{ driverName: { $regex: search, $options: 'i' } }];

    const skip = (page - 1) * limit;
    const found = await DriverLog.find(query);
    let logs;
    if (Array.isArray(found)) {
      const sorted = found.sort((a, b) => new Date(b.date) - new Date(a.date));
      logs = sorted.slice(skip, skip + parseInt(limit));
    } else {
      logs = await DriverLog.find(query).populate('tipperId', 'equipmentId type').skip(skip).limit(parseInt(limit)).sort({ date: -1 });
    }
    const total = await DriverLog.countDocuments(query);
    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDriverLog = async (req, res) => {
  try {
    const log = await DriverLog.findById(req.params.id).populate('tipperId', 'equipmentId type');
    if (!log) return res.status(404).json({ success: false, message: 'Driver log not found' });
    res.json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDriverLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const { date, tipperId, driverName, trips, fuelUsed, tripsPerLiter, status } = req.body;
    // validate tipper exists
    if (tipperId) {
      const eq = await Equipment.findById(tipperId);
      if (!eq) return res.status(404).json({ success: false, message: 'Tipper (equipment) not found' });
    }

    const log = await DriverLog.create({ date: date ? new Date(date) : new Date(), tipperId, driverName, trips, fuelUsed, tripsPerLiter, status });
    res.status(201).json({ success: true, message: 'Driver log created', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDriverLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  try {
    const log = await DriverLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Driver log not found' });

    const { date, tipperId, driverName, trips, fuelUsed, tripsPerLiter, status } = req.body;
    if (date) log.date = new Date(date);
    if (tipperId) log.tipperId = tipperId;
    if (driverName) log.driverName = driverName;
    if (trips !== undefined) log.trips = trips;
    if (fuelUsed !== undefined) log.fuelUsed = fuelUsed;
    if (tripsPerLiter !== undefined) log.tripsPerLiter = tripsPerLiter;
    if (status) log.status = status;

    await log.save();
    res.json({ success: true, message: 'Driver log updated', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDriverLog = async (req, res) => {
  try {
    const log = await DriverLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Driver log not found' });
    res.json({ success: true, message: 'Driver log deleted', log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDriverStats = async (req, res) => {
  try {
    const { date } = req.query;
    const match = {};
    if (date) {
      const d = new Date(date);
      match.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }

    const total = await DriverLog.countDocuments(match);
    const byDriver = await DriverLog.aggregate([{ $match: match }, { $group: { _id: '$driverName', count: { $sum: 1 }, totalTrips: { $sum: '$trips' }, totalFuel: { $sum: '$fuelUsed' } } }]);

    res.json({ success: true, stats: { total, byDriver } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
