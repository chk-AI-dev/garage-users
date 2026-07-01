const express = require('express');
// Import necessary modules and middleware
const router = express.Router();
const { body, param, query } = require('express-validator');
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');
// Validation rules
const createAttendanceValidation = [
	body('date').optional().isISO8601().toDate().withMessage('Invalid date'),
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('role').trim().notEmpty().withMessage('Role is required'),
	body('location').trim().notEmpty().withMessage('Location is required')
];
// For updates, all fields are optional but if provided must be valid
const updateAttendanceValidation = [
	body('date').optional().isISO8601().toDate().withMessage('Invalid date'),
	body('name').optional().trim().notEmpty().withMessage('Name is required when provided'),
	body('role').optional().trim().notEmpty().withMessage('Role is required when provided'),
	body('location').optional().trim().notEmpty().withMessage('Location is required when provided')
];

// List and stats (admin/supervisor)
router.get('/', authenticate, authorize('admin', 'supervisor'), attendanceController.getAllAttendance);
router.get('/stats', authenticate, authorize('admin', 'supervisor'), attendanceController.getAttendanceStats);

// Single record (admin/supervisor)
router.get('/:id', authenticate, authorize('admin', 'supervisor'), [param('id').isMongoId().withMessage('Invalid id')], attendanceController.getAttendance);

// Create (any authenticated user)
router.post('/', authenticate, createAttendanceValidation, attendanceController.createAttendance);

// Update / Delete (admin only)
router.put('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id'), ...updateAttendanceValidation], attendanceController.updateAttendance);
router.delete('/:id', authenticate, authorize('admin'), [param('id').isMongoId().withMessage('Invalid id')], attendanceController.deleteAttendance);

module.exports = router;
