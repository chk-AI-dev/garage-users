const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const operatorController = require('../controllers/operatorLogController');
const { authenticate, authorize } = require('../middleware/auth');
// Validation rules for operator logs
const validateOperatorLog = [
	body('machineId').notEmpty().withMessage('Machine ID is required').isMongoId().withMessage('Invalid machineId'),
	body('operatorName').trim().notEmpty().withMessage('Operator name is required'),
	body('hours').isNumeric().withMessage('Hours must be numeric'),
	body('efficiency').isNumeric().withMessage('Efficiency must be numeric')
];

router.get('/', authenticate, authorize('admin', 'supervisor'), operatorController.getAllOperatorLogs);
router.get('/stats', authenticate, authorize('admin', 'supervisor'), operatorController.getOperatorStats);
router.get('/:id', authenticate, authorize('admin', 'supervisor'), [param('id').isMongoId().withMessage('Invalid id')], operatorController.getOperatorLog);
router.post('/', authenticate, authorize('admin', 'supervisor'), validateOperatorLog, operatorController.createOperatorLog);
router.put('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id'), ...validateOperatorLog], operatorController.updateOperatorLog);
router.delete('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id')], operatorController.deleteOperatorLog);

module.exports = router;
