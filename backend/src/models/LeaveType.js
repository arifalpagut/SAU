module.exports = (sequelize, DataTypes) => {
  const LeaveType = sequelize.define('LeaveType', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    defaultDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 14, field: 'default_days' },
    isPaid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_paid' },
    requiresApproval: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'requires_approval' }
  }, { tableName: 'leave_types' });
  return LeaveType;
};
