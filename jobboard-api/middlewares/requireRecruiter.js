const createError = require('../helpers/createError');

function requireRecruiter(req, res, next) {
  if (!req.user) {
    return next(createError('Auth', 'Access denied. No token provided.', 401));
  }

  if (!req.user.isRecruiter) {
    return next(createError('AuthZ', 'Access denied. Recruiter role required.', 403));
  }

  next();
}

module.exports = requireRecruiter;
