module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'GENERAL' },
    priority: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'NORMAL' },
    publishedBy: { type: DataTypes.UUID, allowNull: true, field: 'published_by' },
    targetRoles: { type: DataTypes.TEXT, allowNull: true, defaultValue: '', field: 'target_roles' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    publishedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW, field: 'published_at' },
    expiresAt: { type: DataTypes.DATEONLY, allowNull: true, field: 'expires_at' }
  }, { tableName: 'announcements' });
  return Announcement;
};