const express = require('express');
const { body } = require('express-validator');
const equipmentController = require('../controllers/equipmentController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Equipment validation middleware
const validateEquipment = [
  body('equipmentId').trim().notEmpty().withMessage('Equipment ID is required'),
  body('type').trim().notEmpty().withMessage('Equipment type is required')
    .isIn(['Excavator', 'Tipper', 'Dozer', 'Grader', 'Diesel Bowser', 'Crane', 'Loader', 'Other'])
    .withMessage('Invalid equipment type'),
  body('status').trim().notEmpty().withMessage('Status is required')
    .isIn(['Working', 'In Maintenance', 'Out of Service', 'Inactive'])
    .withMessage('Invalid status'),
  body('capacity').trim().notEmpty().withMessage('Capacity is required'),
  body('assignedArea').trim().notEmpty().withMessage('Assigned area is required')
];

// Routes

// Get all equipment (Admin/Supervisor)
router.get('/', authenticate, authorize('admin', 'supervisor'), equipmentController.getAllEquipment);

// Get equipment stats (Admin/Supervisor)
router.get('/stats/overview', authenticate, authorize('admin', 'supervisor'), equipmentController.getEquipmentStats);

// Get single equipment by MongoDB ID
router.get('/:id', authenticate, authorize('admin', 'supervisor'), equipmentController.getEquipment);

// Get equipment by Equipment ID (format: EX-01)
router.get('/equipment-id/:equipmentId', authenticate, authorize('admin', 'supervisor'), equipmentController.getEquipmentByEquipmentId);

// Create equipment (Admin only)
router.post('/', authenticate, authorize('admin'), validateEquipment, equipmentController.createEquipment);

// Update equipment (Admin only)
router.put('/:id', authenticate, authorize('admin'), equipmentController.updateEquipment);

// Update equipment status (Admin only)
router.put('/:id/status', authenticate, authorize('admin'), 
  body('status').isIn(['Working', 'In Maintenance', 'Out of Service', 'Inactive'])
    .withMessage('Invalid status'),
  equipmentController.updateEquipmentStatus
);

// Assign operator (Admin only)
router.put('/:id/assign-operator', authenticate, authorize('admin'),
  body('operatorId').notEmpty().withMessage('Operator ID is required'),
  equipmentController.assignOperator
);

// Delete equipment (Admin only)
router.delete('/:id', authenticate, authorize('admin'), equipmentController.deleteEquipment);

module.exports = router;
