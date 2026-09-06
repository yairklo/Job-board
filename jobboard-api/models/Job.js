const mongoose = require('mongoose');

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Freelance', 'Temporary', 'Internship'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Team Lead', 'Management'];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, default: '' },
    alt: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const salarySchema = new mongoose.Schema(
  {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 256, index: true },
    company: { type: String, required: true, trim: true, minlength: 2, maxlength: 256, index: true },
    description: { type: String, required: true, trim: true, minlength: 2, maxlength: 1024 },
    category: { type: String, required: true, trim: true, minlength: 2, maxlength: 256, index: true },
    location: { type: String, required: true, trim: true, minlength: 2, maxlength: 256, index: true },
    jobType: { type: String, required: true, enum: JOB_TYPES, index: true },
    experienceLevel: { type: String, required: true, enum: EXPERIENCE_LEVELS, index: true },
    salary: { type: salarySchema, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    applyLink: { type: String, trim: true, default: '' },
    image: { type: imageSchema, default: () => ({}) },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    savedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    jobNumber: { type: Number, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

function attachAliases(ret) {
  const recruiterId = ret.recruiterId ? String(ret.recruiterId) : undefined;
  ret.recruiterId = recruiterId;
  ret.recruiter_id = recruiterId;
  ret.savedBy = Array.isArray(ret.savedBy) ? ret.savedBy.map((id) => String(id)) : [];
  ret.applicationUrl = ret.applyLink || '';
  ret.contact = { phone: ret.phone, email: ret.email };
  delete ret.__v;
  return ret;
}

jobSchema.set('toJSON', {
  transform(_doc, ret) {
    return attachAliases(ret);
  },
});

jobSchema.set('toObject', {
  transform(_doc, ret) {
    return attachAliases(ret);
  },
});

module.exports = mongoose.model('Job', jobSchema);
module.exports.JOB_TYPES = JOB_TYPES;
module.exports.EXPERIENCE_LEVELS = EXPERIENCE_LEVELS;
