const Joi = require('joi');
const { isValidObjectId } = require('../helpers/mongoValidators');

const israeliPhone = /^0\d{8,10}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-]).{7,}$/;

const objectId = Joi.string().custom((value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation').messages({
  'any.invalid': 'Invalid id',
});

const imageSchema = Joi.object({
  url: Joi.string().uri().allow('').optional(),
  alt: Joi.string().allow('').optional(),
}).custom((image, helpers) => {
  if (image?.url && !image.alt) {
    return helpers.error('any.custom', { message: 'Image alt is required when URL is provided' });
  }
  return image;
}).default({ url: '', alt: '' });

const addressSchema = Joi.object({
  state: Joi.string().allow('').optional(),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.number().min(1).required(),
  zip: Joi.number().optional(),
});

const registerSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(256).required(),
    middle: Joi.string().max(256).allow('').optional(),
    last: Joi.string().min(2).max(256).required(),
  }).required(),
  phone: Joi.string().pattern(israeliPhone).required().messages({
    'string.pattern.base': 'Phone must be a valid Israeli format',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base':
      'Password must be at least 7 characters and include uppercase, lowercase, a digit, and a special character (!@#$%^&*-)',
  }),
  image: imageSchema,
  address: addressSchema.required(),
  isRecruiter: Joi.boolean().default(false),
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
}).unknown(false);

const updateProfileSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(256).required(),
    middle: Joi.string().max(256).allow('').optional(),
    last: Joi.string().min(2).max(256).required(),
  }).required(),
  phone: Joi.string().pattern(israeliPhone).required().messages({
    'string.pattern.base': 'Phone must be a valid Israeli format',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).optional(),
  password: Joi.string().optional(),
  image: imageSchema,
  address: addressSchema.required(),
  isRecruiter: Joi.boolean().optional(),
}).unknown(true);

const toggleRecruiterSchema = Joi.object({
  isRecruiter: Joi.boolean().optional(),
}).unknown(true);

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const usersQuerySchema = Joi.object({
  search: Joi.string().allow('').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
}).unknown(true);

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  toggleRecruiterSchema,
  idParamSchema,
  usersQuerySchema,
};
