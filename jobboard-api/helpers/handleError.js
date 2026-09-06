const createError = require('./createError');

function handleError(err, fallbackMessage = 'Internal server error') {
  if (err.status && err.diagnosis) {
    return err;
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return createError('Mongoose', message, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return createError('Duplicate', `${field} already exists`, 409);
  }

  if (err.name === 'CastError') {
    return createError('CastError', 'Invalid id', 400);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return createError('Auth', 'Invalid or expired token', 401);
  }

  const wrapped = createError('Server', fallbackMessage, err.status || 500);
  wrapped.original = err;
  return wrapped;
}

module.exports = handleError;
