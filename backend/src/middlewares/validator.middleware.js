const AppError = require('../utils/AppError');

module.exports = function validate(schema, property = 'body') {
  return function validator(req, res, next) {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new AppError('Dogrulama hatasi', 400, error.details.map((d) => d.message)));
    }
    req[property] = value;
    next();
  };
};
