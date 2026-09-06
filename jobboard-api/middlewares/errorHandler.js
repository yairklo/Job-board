const handleError = require('../helpers/handleError');

function errorHandler(err, req, res, _next) {
  const normalized = handleError(err);
  const status = normalized.status || 500;

  if (status >= 500) {
    console.error(normalized.original || err);
  }

  res.status(status).json({
    status,
    message: normalized.message || 'Internal server error',
    diagnosis: normalized.diagnosis || 'Server',
    timestamp: new Date().toISOString(),
  });
}

module.exports = errorHandler;
