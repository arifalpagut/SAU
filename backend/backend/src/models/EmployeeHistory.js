module.exports = (sequelize, DataTypes) => {
  const EmployeeHistory = sequelize.define('EmployeeHistory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    changeType: { type: DataTypes.STRING(50), allowNull: false, field: 'change_type' },
    fieldName: { type: DataTypes.STRING(100), allowNull: true, field: 'field_name' },
    oldValue: { type: DataTypes.TEXT, allowNull: true, field: 'old_value' },
    newValue: { type: DataTypes.TEXT, allowNull: true, field: 'new_value' },
    changedBy: { type: DataTypes.UUID, allowNull: true, field: 'changed_by' },
    notes: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'employee_history', updatedAt: false });
  return EmployeeHistory;
};