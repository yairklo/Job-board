const jwt = require('jsonwebtoken');

function signToken(user) {
  const payload = {
    _id: String(user._id),
    isRecruiter: Boolean(user.isRecruiter),
    isAdmin: Boolean(user.isAdmin),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
