const { ROLES } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password_hash' },
    role: { type: DataTypes.ENUM(...Object.values(ROLES)), allowNull: false },
    employeeId: { type: DataTypes.UUID, allowNull: true, field: 'employee_id' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    failedLoginAttempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'failed_login_attempts' },
    lockedUntil: { type: DataTypes.DATE, allowNull: true, field: 'locked_until' }
  }, { tableName: 'users' });
  return User;
};
