module.exports = (sequelize, DataTypes) => {
  const LeaveBalance = sequelize.define('LeaveBalance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    leaveTypeId: { type: DataTypes.UUID, allowNull: false, field: 'leave_type_id' },
    year: { type: DataTypes.INTEGER, allowNull: false },
    totalDays: { type: DataTypes.DECIMAL(4, 1), allowNull: false, defaultValue: 14, field: 'total_days' },
    usedDays: { type: DataTypes.DECIMAL(4, 1), allowNull: false, defaultValue: 0, field: 'used_days' },
    remainingDays: { type: DataTypes.DECIMAL(4, 1), allowNull: false, defaultValue: 14, field: 'remaining_days' }
  }, { tableName: 'leave_balances' });
  return LeaveBalance;
};
