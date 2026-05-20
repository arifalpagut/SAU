const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  logger.error({ message: err.message, statusCode, stack: err.stack, details: err.details || null });
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Beklenmeyen bir hata olustu',
    details: err.details || null
  });
};
