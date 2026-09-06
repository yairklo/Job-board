const Joi = require('joi');
const { JOB_TYPES, EXPERIENCE_LEVELS } = require('../models/Job');
const { isValidObjectId } = require('../helpers/mongoValidators');

const israeliPhone = /^0\d{8,10}$/;

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

const jobBodySchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  company: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  category: Joi.string().min(2).max(256).required(),
  location: Joi.string().min(2).max(256).required(),
  jobType: Joi.string()
    .valid(...JOB_TYPES)
    .required(),
  experienceLevel: Joi.string()
    .valid(...EXPERIENCE_LEVELS)
    .required(),
  experience: Joi.string()
    .valid(...EXPERIENCE_LEVELS)
    .optional(),
  salary: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(0).required(),
  })
    .custom((salary, helpers) => {
      if (salary.max < salary.min) {
        return helpers.error('any.custom', { message: 'salary.max must be greater than or equal to salary.min' });
      }
      return salary;
    })
    .required(),
  phone: Joi.string().pattern(israeliPhone).required().messages({
    'string.pattern.base': 'Phone must be a valid Israeli format',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  applyLink: Joi.string().uri().allow('').optional(),
  applicationUrl: Joi.string().uri().allow('').optional(),
  image: imageSchema,
  jobNumber: Joi.any().optional(),
  contact: Joi.object({
    phone: Joi.string().optional(),
    email: Joi.string().email({ tlds: { allow: false } }).optional(),
  }).optional(),
}).unknown(true);

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const jobsQuerySchema = Joi.object({
  search: Joi.string().allow('').optional(),
  q: Joi.string().allow('').optional(),
  jobType: Joi.string().allow('').optional(),
  experience: Joi.string().allow('').optional(),
  experienceLevel: Joi.string().allow('').optional(),
  salaryMin: Joi.number().optional(),
  salaryMax: Joi.number().optional(),
  sort: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(200).optional(),
}).unknown(true);

module.exports = {
  jobBodySchema,
  idParamSchema,
  jobsQuerySchema,
};
