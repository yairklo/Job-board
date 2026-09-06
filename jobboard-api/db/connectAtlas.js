const mongoose = require('mongoose');

async function connectAtlas(uri) {
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectAtlas;
