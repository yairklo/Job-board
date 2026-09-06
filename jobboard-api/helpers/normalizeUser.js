const _ = require('lodash');

function normalizeUser(input = {}) {
  const address = input.address || {};
  const image = input.image || {};

  return {
    name: {
      first: String(input.name?.first || '').trim(),
      middle: String(input.name?.middle || '').trim(),
      last: String(input.name?.last || '').trim(),
    },
    phone: String(input.phone || '').trim(),
    email: String(input.email || '').trim().toLowerCase(),
    password: input.password,
    image: {
      url: String(image.url || '').trim(),
      alt: String(image.alt || '').trim(),
    },
    address: {
      state: String(address.state || '').trim(),
      country: String(address.country || '').trim(),
      city: String(address.city || '').trim(),
      street: String(address.street || '').trim(),
      houseNumber: Number(address.houseNumber),
      zip: address.zip === undefined || address.zip === '' ? 0 : Number(address.zip),
    },
    isRecruiter: Boolean(input.isRecruiter),
  };
}

function sanitizeUser(user) {
  const plain = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  return _.omit(plain, ['password', 'loginAttempts', 'lockUntil', '__v']);
}

module.exports = { normalizeUser, sanitizeUser };
