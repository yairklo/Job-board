const createError = require('../helpers/createError');

function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(createError('Auth', 'Access denied. No token provided.', 401));
  }

  if (!req.user.isAdmin) {
    return next(createError('AuthZ', 'Access denied. Admin role required.', 403));
  }

  next();
}

module.exports = requireAdmin;
