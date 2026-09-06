function createError(diagnosis, message, status = 400) {
  const error = new Error(message);
  error.diagnosis = diagnosis;
  error.status = status;
  return error;
}

module.exports = createError;
