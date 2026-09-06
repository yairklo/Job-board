require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./db/service');

const PORT = process.env.PORT || 8181;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`JobBoard API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
