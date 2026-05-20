const { verifyAccessToken } = require('../config/jwt');
const AppError = require('../utils/AppError');
const { User, Employee } = require('../models');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Yetkisiz erisim', 401));
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.userId, {
      include: [{ model: Employee, as: 'employee' }]
    });
    if (!user || !user.isActive) {
      return next(new AppError('Gecersiz kullanici veya pasif hesap', 401));
    }
    req.user = { id: user.id, email: user.email, role: user.role, employeeId: user.employeeId };
    next();
  } catch (error) {
    return next(new AppError('Gecersiz veya suresi dolmus token', 401));
  }
};
