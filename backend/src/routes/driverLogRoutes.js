const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const driverController = require('../controllers/driverLogController');
const { authenticate, authorize } = require('../middleware/auth');
// Validation middleware for driver log entries
const validateDriverLog = [
	body('tipperId').notEmpty().withMessage('Tipper ID is required').isMongoId().withMessage('Invalid tipperId'),
	body('driverName').trim().notEmpty().withMessage('Driver name is required'),
	body('trips').isNumeric().withMessage('Trips must be a number'),
	body('fuelUsed').isNumeric().withMessage('Fuel used must be a number')
];
// update driver log validation.
router.get('/', authenticate, authorize('admin', 'supervisor'), driverController.getAllDriverLogs);
router.get('/stats', authenticate, authorize('admin', 'supervisor'), driverController.getDriverStats);
router.get('/:id', authenticate, authorize('admin', 'supervisor'), [param('id').isMongoId().withMessage('Invalid id')], driverController.getDriverLog);
router.post('/', authenticate, authorize('admin', 'supervisor'), validateDriverLog, driverController.createDriverLog);
router.put('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id'), ...validateDriverLog], driverController.updateDriverLog);
router.delete('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id')], driverController.deleteDriverLog);

module.exports = router;
