module.exports = (sequelize, DataTypes) => {
  const PayrollParameter = sequelize.define('PayrollParameter', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    parameterName: { type: DataTypes.STRING(100), allowNull: false, field: 'parameter_name' },
    parameterValue: { type: DataTypes.DECIMAL(10, 5), allowNull: false, field: 'parameter_value' },
    year: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' }
  }, { tableName: 'payroll_parameters' });
  return PayrollParameter;
};