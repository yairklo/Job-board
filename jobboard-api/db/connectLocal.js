const mongoose = require('mongoose');

async function connectLocal(uri) {
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectLocal;
