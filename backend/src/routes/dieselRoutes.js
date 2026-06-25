const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const dieselController = require('../controllers/dieselLogController');
const { authenticate, authorize } = require('../middleware/auth');
// Validation middleware for diesel log entries
const validateDiesel = [
	body('opening').isNumeric().withMessage('Opening must be a number'),
	body('received').isNumeric().withMessage('Received must be a number'),
	body('issued').isNumeric().withMessage('Issued must be a number'),
	body('closing').isNumeric().withMessage('Closing must be a number')
];
// List and stats (admin/supervisor)
router.get('/', authenticate, authorize('admin', 'supervisor'), dieselController.getAllDieselLogs);
router.get('/stats', authenticate, authorize('admin', 'supervisor'), dieselController.getDieselStats);
router.get('/:id', authenticate, authorize('admin', 'supervisor'), [param('id').isMongoId().withMessage('Invalid id')], dieselController.getDieselLog);
router.post('/', authenticate, authorize('admin', 'supervisor'), validateDiesel, dieselController.createDieselLog);
router.put('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id'), ...validateDiesel], dieselController.updateDieselLog);
router.delete('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id')], dieselController.deleteDieselLog);

module.exports = router;
