const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticate, authorize } = require('../middleware/auth');

const validateMaintenance = [
	body('machineId').notEmpty().withMessage('Machine ID is required').isMongoId().withMessage('Invalid machineId'),
	body('last_service').optional().isISO8601().toDate().withMessage('Invalid date for last_service'),
	body('next_due').optional().isISO8601().toDate().withMessage('Invalid date for next_due'),
	body('service_hours').isNumeric().withMessage('service_hours must be numeric'),
	body('current_hours').isNumeric().withMessage('current_hours must be numeric')
];

router.get('/', authenticate, authorize('admin', 'supervisor'), maintenanceController.getAllMaintenance);
router.get('/stats', authenticate, authorize('admin', 'supervisor'), maintenanceController.getMaintenanceStats);
router.get('/:id', authenticate, authorize('admin', 'supervisor'), [param('id').isMongoId().withMessage('Invalid id')], maintenanceController.getMaintenance);
router.post('/', authenticate, authorize('admin', 'supervisor'), validateMaintenance, maintenanceController.createMaintenance);
router.put('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id'), ...validateMaintenance], maintenanceController.updateMaintenance);
router.delete('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id')], maintenanceController.deleteMaintenance);

module.exports = router;
