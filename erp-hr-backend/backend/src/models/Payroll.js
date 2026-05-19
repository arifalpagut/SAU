const { PAYROLL_STATUS } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define('Payroll', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    periodMonth: { type: DataTypes.INTEGER, allowNull: false, field: 'period_month' },
    periodYear: { type: DataTypes.INTEGER, allowNull: false, field: 'period_year' },
    grossSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'gross_salary' },
    netSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'net_salary' },
    totalDeductions: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'total_deductions' },
    totalAdditions: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'total_additions' },
    status: { type: DataTypes.ENUM(...Object.values(PAYROLL_STATUS)), allowNull: false, defaultValue: PAYROLL_STATUS.CALCULATED },
    calculatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'calculated_at' }
  }, { tableName: 'payrolls' });
  return Payroll;
};
