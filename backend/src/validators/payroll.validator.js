const Joi = require('joi');
const nonNegativeDecimal = Joi.number().min(0).precision(2).default(0);
const runPayrollSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).max(2100).required()
});
const calculatePayrollSchema = Joi.object({
  employeeId: Joi.string().uuid().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
  grossSalary: Joi.number().min(0).precision(2).required(),
  bonusPayment: nonNegativeDecimal, overtimePayment: nonNegativeDecimal,
  transportationAllowance: nonNegativeDecimal, mealAllowance: nonNegativeDecimal,
  otherEarnings: nonNegativeDecimal, besDeduction: nonNegativeDecimal,
  advanceDeduction: nonNegativeDecimal, enforcementDeduction: nonNegativeDecimal,
  otherDeductions: nonNegativeDecimal
});
const generatePayrollSchema = Joi.object({
  employeeId: Joi.string().uuid().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
  grossSalary: Joi.number().min(0).precision(2).required(),
  bonusPayment: nonNegativeDecimal, overtimePayment: nonNegativeDecimal,
  transportationAllowance: nonNegativeDecimal, mealAllowance: nonNegativeDecimal,
  otherEarnings: nonNegativeDecimal, besDeduction: nonNegativeDecimal,
  advanceDeduction: nonNegativeDecimal, enforcementDeduction: nonNegativeDecimal,
  otherDeductions: nonNegativeDecimal
});
module.exports = { runPayrollSchema: runPayrollSchema, calculatePayrollSchema: calculatePayrollSchema, generatePayrollSchema: generatePayrollSchema };