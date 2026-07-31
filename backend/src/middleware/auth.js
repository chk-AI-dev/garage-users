const jwt = require('jsonwebtoken');
// Middleware for authentication and authorization
const authenticate = (req, res, next) => {
  // Check for token in the authorization header
  try {
    const token = req.headers.authorization?.split(' ')[1];
    // Check if token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
