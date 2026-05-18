const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const userValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required')
];

// Get all users (Admin only)
router.get('/', authenticate, authorize('admin', 'supervisor'), userController.getAllUsers);

// Get single user
router.get('/:id', authenticate, userController.getUser);

// Create user (Admin only)
router.post('/', authenticate, authorize('admin'), userValidation, userController.createUser);

// Update user (Admin only)
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

// Update user status (Admin only)
router.put('/:id/status', authenticate, authorize('admin'), userController.updateUserStatus);

module.exports = router;
