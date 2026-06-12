const Equipment = require('../models/equipments');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all equipment (Admin/Supervisor only)
exports.getAllEquipment = async (req, res) => {
  try {
    const { type, status, assignedArea, page = 1, limit = 10, search } = req.query;
    const query = {};
    // Filter by type, status, and assigned area if provided
    if (type) query.type = type;
    if (status) query.status = status;
    if (assignedArea) query.assignedArea = { $regex: assignedArea, $options: 'i' };
    
    // Search by equipment ID
    if (search) {
      query.$or = [
        { equipmentId: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }
    // For in-memory sorting and pagination if the dataset is small, otherwise use MongoDB's skip and limit
    const skip = (page - 1) * limit;
    const equipment = await Equipment.find(query)
      .populate('operator', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Equipment.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single equipment
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('operator', 'firstName lastName email phone')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get equipment by ID (Equipment ID like EX-01)
exports.getEquipmentByEquipmentId = async (req, res) => {
  try {
    const equipment = await Equipment.findOne({ 
      equipmentId: req.params.equipmentId.toUpperCase() 
    })
      .populate('operator', 'firstName lastName email phone')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create equipment (Admin only)
exports.createEquipment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { equipmentId, type, status, capacity, assignedArea, operator, purchaseDate, registrationNumber, notes } = req.body;

    // Check if equipment already exists
    let equipment = await Equipment.findOne({ equipmentId: equipmentId.toUpperCase() });
    if (equipment) {
      return res.status(400).json({
        success: false,
        message: `Equipment with ID ${equipmentId} already exists`
      });
    }

    // Validate operator if provided
    if (operator) {
      const operatorExists = await User.findById(operator);
      if (!operatorExists) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }
    }

    equipment = await Equipment.create({
      equipmentId: equipmentId.toUpperCase(),
      type,
      status,
      capacity,
      assignedArea,
      operator: operator || null,
      purchaseDate,
      registrationNumber,
      notes,
      createdBy: req.user.id
    });

    // Populate references
    await equipment.populate('operator', 'firstName lastName email');
    await equipment.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update equipment (Admin only)
exports.updateEquipment = async (req, res) => {
  try {
    let equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    const { equipmentId, type, status, capacity, assignedArea, operator, purchaseDate, registrationNumber, notes, lastMaintenanceDate, nextMaintenanceDate } = req.body;

    // Check if new equipment ID is unique (if being changed)
    if (equipmentId && equipmentId.toUpperCase() !== equipment.equipmentId) {
      const existingEquipment = await Equipment.findOne({ 
        equipmentId: equipmentId.toUpperCase() 
      });
      if (existingEquipment) {
        return res.status(400).json({
          success: false,
          message: `Equipment with ID ${equipmentId} already exists`
        });
      }
    }

    // Validate operator if provided
    if (operator) {
      const operatorExists = await User.findById(operator);
      if (!operatorExists) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }
    }

    // Update fields
    if (equipmentId) equipment.equipmentId = equipmentId.toUpperCase();
    if (type) equipment.type = type;
    if (status) equipment.status = status;
    if (capacity) equipment.capacity = capacity;
    if (assignedArea) equipment.assignedArea = assignedArea;
    if (operator !== undefined) equipment.operator = operator || null;
    if (purchaseDate) equipment.purchaseDate = purchaseDate;
    if (registrationNumber) equipment.registrationNumber = registrationNumber;
    if (notes) equipment.notes = notes;
    if (lastMaintenanceDate) equipment.lastMaintenanceDate = lastMaintenanceDate;
    if (nextMaintenanceDate) equipment.nextMaintenanceDate = nextMaintenanceDate;
    
    equipment.updatedBy = req.user.id;

    await equipment.save();

    // Populate references
    await equipment.populate('operator', 'firstName lastName email');
    await equipment.populate('createdBy', 'firstName lastName');
    await equipment.populate('updatedBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete equipment (Admin only)
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      message: 'Equipment deleted successfully',
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update equipment status (Admin only)
exports.updateEquipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['Working', 'In Maintenance', 'Out of Service', 'Inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    equipment.status = status;
    equipment.updatedBy = req.user.id;
    await equipment.save();

    await equipment.populate('operator', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Equipment status updated successfully',
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Assign operator to equipment (Admin only)
exports.assignOperator = async (req, res) => {
  try {
    const { operatorId } = req.body;

    if (!operatorId) {
      return res.status(400).json({
        success: false,
        message: 'Operator ID is required'
      });
    }

    // Verify operator exists and is either operator or driver
    const operator = await User.findById(operatorId);
    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found'
      });
    }

    if (!['operator', 'driver'].includes(operator.role)) {
      return res.status(400).json({
        success: false,
        message: 'User must be an operator or driver'
      });
    }

    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    equipment.operator = operatorId;
    equipment.updatedBy = req.user.id;
    await equipment.save();

    await equipment.populate('operator', 'firstName lastName email phone role');

    res.json({
      success: true,
      message: 'Operator assigned successfully',
      equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get equipment stats (Admin/Supervisor only)
exports.getEquipmentStats = async (req, res) => {
  try {
    const totalEquipment = await Equipment.countDocuments();
    const workingEquipment = await Equipment.countDocuments({ status: 'Working' });
    const maintenanceEquipment = await Equipment.countDocuments({ status: 'In Maintenance' });
    const outOfServiceEquipment = await Equipment.countDocuments({ status: 'Out of Service' });
    const inactiveEquipment = await Equipment.countDocuments({ status: 'Inactive' });

    // Get equipment by type
    const equipmentByType = await Equipment.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get equipment by assigned area
    const equipmentByArea = await Equipment.aggregate([
      {
        $match: { assignedArea: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$assignedArea',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalEquipment,
        workingEquipment,
        maintenanceEquipment,
        outOfServiceEquipment,
        inactiveEquipment,
        equipmentByType,
        equipmentByArea
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
