const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const jobsRouter = require('./routes/jobs');
const errorHandler = require('./middlewares/errorHandler');
const createError = require('./helpers/createError');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, allowedOrigins.includes(origin));
    },
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'JobBoard API' });
});

app.use('/users', usersRouter);
app.use('/jobs', jobsRouter);

app.use((req, res, next) => {
  next(createError('NotFound', 'Route not found', 404));
});

app.use(errorHandler);

module.exports = app;
