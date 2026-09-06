const createError = require('../helpers/createError');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: false,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(createError('Joi', message, 400));
    }

    req[property] = value;
    next();
  };
}

module.exports = validate;
