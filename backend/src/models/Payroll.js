const { PAYROLL_STATUS } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define('Payroll', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    periodMonth: { type: DataTypes.INTEGER, allowNull: false, field: 'period_month' },
    periodYear: { type: DataTypes.INTEGER, allowNull: false, field: 'period_year' },
    grossSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'gross_salary' },
    bonusPayment: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'bonus_payment' },
    overtimePayment: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'overtime_payment' },
    transportationAllowance: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'transportation_allowance' },
    mealAllowance: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'meal_allowance' },
    otherEarnings: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'other_earnings' },
    totalGrossEarnings: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'total_gross_earnings' },
    employeeSgkPremium: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'employee_sgk_premium' },
    employeeUnemploymentPremium: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'employee_unemployment_premium' },
    incomeTaxBase: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'income_tax_base' },
    incomeTax: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'income_tax' },
    stampTax: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'stamp_tax' },
    besDeduction: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'bes_deduction' },
    advanceDeduction: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'advance_deduction' },
    enforcementDeduction: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'enforcement_deduction' },
    otherDeductions: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'other_deductions' },
    totalDeductions: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'total_deductions' },
    totalAdditions: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'total_additions' },
    netSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'net_salary' },
    employerSgkPremium: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'employer_sgk_premium' },
    employerUnemploymentPremium: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'employer_unemployment_premium' },
    totalEmployerCost: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'total_employer_cost' },
    status: { type: DataTypes.ENUM(...Object.values(PAYROLL_STATUS)), allowNull: false, defaultValue: PAYROLL_STATUS.DRAFT },
    calculatedAt: { type: DataTypes.DATE, allowNull: true, field: 'calculated_at' },
    approvedBy: { type: DataTypes.UUID, allowNull: true, field: 'approved_by' },
    approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' }
  }, { tableName: 'payrolls' });
  return Payroll;
};