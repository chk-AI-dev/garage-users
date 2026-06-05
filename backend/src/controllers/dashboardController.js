const User = require('../models/User');

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    // Group users by status (active/inactive)
    const usersByStatus = await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        usersByStatus: usersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user dashboard stats (current user)
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      stats: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
        joinDate: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
