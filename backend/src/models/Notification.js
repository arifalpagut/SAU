module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'INFO' },
    module: { type: DataTypes.STRING(50), allowNull: true },
    entityType: { type: DataTypes.STRING(50), allowNull: true, field: 'entity_type' },
    entityId: { type: DataTypes.UUID, allowNull: true, field: 'entity_id' },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_read' },
    readAt: { type: DataTypes.DATE, allowNull: true, field: 'read_at' }
  }, { tableName: 'notifications', updatedAt: false });
  return Notification;
};