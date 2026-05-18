const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  return token;
};

module.exports = {
  generateToken
};
