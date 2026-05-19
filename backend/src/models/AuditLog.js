module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    action: { type: DataTypes.STRING(50), allowNull: false },
    moduleName: { type: DataTypes.STRING(50), allowNull: true, field: 'module_name' },
    entityType: { type: DataTypes.STRING(50), allowNull: false, field: 'entity_type' },
    entityId: { type: DataTypes.UUID, allowNull: true, field: 'entity_id' },
    oldValues: { type: DataTypes.JSONB, allowNull: true, field: 'old_values' },
    newValues: { type: DataTypes.JSONB, allowNull: true, field: 'new_values' },
    description: { type: DataTypes.TEXT, allowNull: true },
    ipAddress: { type: DataTypes.STRING(45), allowNull: true, field: 'ip_address' },
    userAgent: { type: DataTypes.TEXT, allowNull: true, field: 'user_agent' }
  }, { tableName: 'audit_logs', updatedAt: false });
  return AuditLog;
};