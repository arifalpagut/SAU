module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    action: { type: DataTypes.STRING(50), allowNull: false },
    entityType: { type: DataTypes.STRING(50), allowNull: false, field: 'entity_type' },
    entityId: { type: DataTypes.UUID, allowNull: true, field: 'entity_id' },
    oldValues: { type: DataTypes.JSONB, allowNull: true, field: 'old_values' },
    newValues: { type: DataTypes.JSONB, allowNull: true, field: 'new_values' },
    ipAddress: { type: DataTypes.STRING(45), allowNull: true, field: 'ip_address' }
  }, { tableName: 'audit_logs', updatedAt: false });
  return AuditLog;
};
