const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.locals.audit = { action: 'LOGIN', entityType: 'auth', entityId: result.user.id, newValues: { email: result.user.email, role: result.user.role } };
  return success(res, result, 'Giris basarili');
});
const refresh = catchAsync(async (req, res) => { const result = await authService.refresh(req.body.refreshToken); return success(res, result, 'Token yenilendi'); });
const logout = catchAsync(async (req, res) => { await authService.logout(req.body.refreshToken); return success(res, null, 'Cikis basarili'); });
const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.locals.audit = { action: 'CHANGE_PASSWORD', entityType: 'users', entityId: req.user.id };
  return success(res, null, 'Parola basariyla degistirildi');
});

module.exports = { login, refresh, logout, changePassword };
