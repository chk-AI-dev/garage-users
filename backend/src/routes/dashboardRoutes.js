const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');
// Create a router instance
const router = express.Router();

// Get dashboard stats (Admin only)
router.get('/stats', authenticate, authorize('admin', 'supervisor'), dashboardController.getStats);

// Get user dashboard stats (All authenticated users)
router.get('/user-stats', authenticate, dashboardController.getUserStats);
// Additional dashboard routes can be added here
module.exports = router;
