const AppError = require('../utils/AppError');

module.exports = function allowRoles(...roles) {
  return function rbacMiddleware(req, res, next) {
    if (!req.user) return next(new AppError('Kimlik dogrulama gerekli', 401));
    if (!roles.includes(req.user.role)) return next(new AppError('Bu islem icin yetkiniz bulunmamaktadir', 403));
    next();
  };
};
