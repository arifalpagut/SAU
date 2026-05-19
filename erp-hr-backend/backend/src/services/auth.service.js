const bcrypt = require('bcryptjs');
const { User, RefreshToken, Employee } = require('../models');
const AppError = require('../utils/AppError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../config/jwt');

function parseRefreshTokenExpiry() {
  const raw = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const value = Number(raw.slice(0, -1));
  const unit = raw.slice(-1);
  const now = new Date();
  if (unit === 'd') now.setDate(now.getDate() + value);
  else if (unit === 'h') now.setHours(now.getHours() + value);
  else if (unit === 'm') now.setMinutes(now.getMinutes() + value);
  else now.setDate(now.getDate() + 7);
  return now;
}

async function login(email, password) {
  const user = await User.findOne({ where: { email }, include: [{ model: Employee, as: 'employee' }] });
  if (!user) throw new AppError('E-posta veya parola hatali', 401);
  if (!user.isActive) throw new AppError('Kullanici hesabi pasif', 403);
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) throw new AppError('Hesap gecici olarak kitlenmistir', 423);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const attempts = user.failedLoginAttempts + 1;
    const updatePayload = { failedLoginAttempts: attempts };
    if (attempts >= 5) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 15);
      updatePayload.lockedUntil = lockUntil;
      updatePayload.failedLoginAttempts = 0;
    }
    await user.update(updatePayload);
    throw new AppError('E-posta veya parola hatali', 401);
  }

  await user.update({ failedLoginAttempts: 0, lockedUntil: null });
  const payload = { userId: user.id, role: user.role, employeeId: user.employeeId };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await RefreshToken.create({ userId: user.id, token: refreshToken, expiresAt: parseRefreshTokenExpiry() });

  return {
    accessToken, refreshToken,
    user: { id: user.id, email: user.email, role: user.role, employeeId: user.employeeId, employee: user.employee }
  };
}

async function refresh(refreshToken) {
  const stored = await RefreshToken.findOne({ where: { token: refreshToken, revoked: false } });
  if (!stored) throw new AppError('Gecersiz refresh token', 401);
  if (new Date(stored.expiresAt) < new Date()) throw new AppError('Refresh token suresi dolmus', 401);
  const decoded = verifyRefreshToken(refreshToken);
  const accessToken = signAccessToken({ userId: decoded.userId, role: decoded.role, employeeId: decoded.employeeId });
  return { accessToken };
}

async function logout(refreshToken) {
  const stored = await RefreshToken.findOne({ where: { token: refreshToken, revoked: false } });
  if (stored) await stored.update({ revoked: true });
  return true;
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('Kullanici bulunamadi', 404);
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new AppError('Mevcut parola yanlis', 400);
  const newHash = await bcrypt.hash(newPassword, 10);
  await user.update({ passwordHash: newHash });
  return true;
}

module.exports = { login, refresh, logout, changePassword };
