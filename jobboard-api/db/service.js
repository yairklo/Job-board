const mongoose = require('mongoose');
const connectLocal = require('./connectLocal');
const connectAtlas = require('./connectAtlas');

function resolveMongoUri() {
  if (process.env.MONGO_URI) {
    return { uri: process.env.MONGO_URI, kind: 'MONGO_URI' };
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.ATLAS_MONGO_URI) {
      throw new Error('ATLAS_MONGO_URI is required in production');
    }
    return { uri: process.env.ATLAS_MONGO_URI, kind: 'Atlas' };
  }

  return {
    uri: process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/JobBoard',
    kind: 'Local',
  };
}

async function connectDB() {
  const { uri, kind } = resolveMongoUri();
  const connector = kind === 'Atlas' ? connectAtlas : connectLocal;
  await connector(uri);
  console.log(`MongoDB connected (${kind}) — db: ${mongoose.connection.name}`);
  return mongoose.connection;
}

module.exports = { connectDB, resolveMongoUri };
