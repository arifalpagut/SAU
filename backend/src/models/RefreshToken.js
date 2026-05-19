module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    token: { type: DataTypes.TEXT, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
    revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, { tableName: 'refresh_tokens' });
  return RefreshToken;
};
