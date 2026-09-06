const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, default: '' },
    alt: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    state: { type: String, trim: true, default: '' },
    country: { type: String, required: true, trim: true, minlength: 2, maxlength: 256 },
    city: { type: String, required: true, trim: true, minlength: 2, maxlength: 256 },
    street: { type: String, required: true, trim: true, minlength: 2, maxlength: 256 },
    houseNumber: { type: Number, required: true, min: 1 },
    zip: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      first: { type: String, required: true, trim: true, minlength: 2, maxlength: 256 },
      middle: { type: String, trim: true, maxlength: 256, default: '' },
      last: { type: String, required: true, trim: true, minlength: 2, maxlength: 256 },
    },
    phone: { type: String, required: true, trim: true, minlength: 9, maxlength: 11 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    image: { type: imageSchema, default: () => ({}) },
    address: { type: addressSchema, required: true },
    isRecruiter: { type: Boolean, required: true, default: false, index: true },
    isAdmin: { type: Boolean, required: true, default: false, index: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.loginAttempts;
    delete ret.lockUntil;
    delete ret.__v;
    return ret;
  },
});

userSchema.set('toObject', {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.loginAttempts;
    delete ret.lockUntil;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
