const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get current user profile
router.get('/', authenticate, profileController.getProfile);

// Update profile
router.put('/', authenticate, profileController.updateProfile);

// Upload profile image
router.post('/upload-image', authenticate, upload.single('profileImage'), profileController.uploadProfileImage);

// Change password
router.put('/change-password', authenticate, profileController.changePassword);

module.exports = router;
