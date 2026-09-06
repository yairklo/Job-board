const mongoose = require('mongoose');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
}

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

module.exports = { isValidObjectId, toObjectId };
