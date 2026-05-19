const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');

const routes = require('./routes');
const logger = require('./utils/logger');
const rateLimiter = require('./middlewares/rateLimiter.middleware');
const auditMiddleware = require('./middlewares/audit.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true
  })
);

app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));
app.use(rateLimiter);
app.use(auditMiddleware);

app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'ERP HR Backend ayakta',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
