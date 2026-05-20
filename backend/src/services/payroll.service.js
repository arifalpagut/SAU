const { Payroll, PayrollItem, PayrollParameter, Employee, Department } = require('../models');
const AppError = require('../utils/AppError');
const { calculatePayroll } = require('../utils/payrollCalculator');
const { sequelize } = require('../models');

async function loadParameters(year) {
  const params = await PayrollParameter.findAll({ where: { year: year, isActive: true } });
  const paramMap = {};
  for (const p of params) { paramMap[p.parameterName] = Number(p.parameterValue); }
  return paramMap;
}
async function calculateOnly(input) { const params = await loadParameters(input.year); return calculatePayroll(input, params); }
async function generatePayroll(input) {
  const params = await loadParameters(input.year);
  const calculated = calculatePayroll(input, params);
  const transaction = await sequelize.transaction();
  try {
    const existing = await Payroll.findOne({ where: { employeeId: input.employeeId, periodMonth: input.month, periodYear: input.year }, transaction });
    if (existing && existing.status === 'APPROVED') throw new AppError('Onaylanmis bordro yeniden olusturulamaz', 400);
    const pd = {
      employeeId: input.employeeId, periodMonth: input.month, periodYear: input.year,
      grossSalary: calculated.grossSalary, bonusPayment: calculated.bonusPayment,
      overtimePayment: calculated.overtimePayment, transportationAllowance: calculated.transportationAllowance,
      mealAllowance: calculated.mealAllowance, otherEarnings: calculated.otherEarnings,
      totalGrossEarnings: calculated.totalGrossEarnings,
      employeeSgkPremium: calculated.employeeSgkPremium, employeeUnemploymentPremium: calculated.employeeUnemploymentPremium,
      incomeTaxBase: calculated.incomeTaxBase, incomeTax: calculated.incomeTax, stampTax: calculated.stampTax,
      besDeduction: calculated.besDeduction, advanceDeduction: calculated.advanceDeduction,
      enforcementDeduction: calculated.enforcementDeduction, otherDeductions: calculated.otherDeductions,
      totalDeductions: calculated.totalDeductions, totalAdditions: calculated.totalAdditions, netSalary: calculated.netSalary,
      employerSgkPremium: calculated.employerSgkPremium, employerUnemploymentPremium: calculated.employerUnemploymentPremium,
      totalEmployerCost: calculated.totalEmployerCost, status: 'CALCULATED', calculatedAt: new Date()
    };
    let payroll;
    if (existing) { await existing.update(pd, { transaction }); await PayrollItem.destroy({ where: { payrollId: existing.id }, transaction }); payroll = existing; }
    else { payroll = await Payroll.create(pd, { transaction }); }
    for (const item of calculated.items) { await PayrollItem.create({ payrollId: payroll.id, itemType: item.itemType, itemName: item.itemName, amount: item.amount }, { transaction }); }
    await transaction.commit();
    return getPayrollById(payroll.id, { role: 'ADMIN', employeeId: null });
  } catch (error) { await transaction.rollback(); throw error; }
}
async function runPayroll(month, year) {
  const employees = await Employee.findAll({ where: { status: 'ACTIVE' } });
  const results = [];
  for (const emp of employees) {
    try { const r = await generatePayroll({ employeeId: emp.id, month, year, grossSalary: emp.grossSalary, bonusPayment: 0, overtimePayment: 0, transportationAllowance: 0, mealAllowance: 0, otherEarnings: 0, besDeduction: 0, advanceDeduction: 0, enforcementDeduction: 0, otherDeductions: 0 }); results.push(r); }
    catch (err) { results.push({ employeeId: emp.id, error: err.message }); }
  }
  return results;
}
async function listPayrolls(query) {
  query = query || {};
  const where = {};
  if (query.month) where.periodMonth = Number(query.month);
  if (query.year) where.periodYear = Number(query.year);
  if (query.status) where.status = query.status;
  return Payroll.findAll({ where, include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: PayrollItem, as: 'items' }], order: [['periodYear', 'DESC'], ['periodMonth', 'DESC']] });
}
async function getPayrollById(id, currentUser) {
  const payroll = await Payroll.findByPk(id, { include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: PayrollItem, as: 'items' }] });
  if (!payroll) throw new AppError('Bordro kaydi bulunamadi', 404);
  if (currentUser.role === 'EMPLOYEE' && payroll.employeeId !== currentUser.employeeId) throw new AppError('Yetki yok', 403);
  return payroll;
}
async function getPayrollsByEmployee(eid, cu) { if (cu.role === 'EMPLOYEE' && eid !== cu.employeeId) throw new AppError('Yetki yok', 403); return Payroll.findAll({ where: { employeeId: eid }, include: [{ model: PayrollItem, as: 'items' }], order: [['periodYear', 'DESC'], ['periodMonth', 'DESC']] }); }
async function getPayrollsByPeriod(year, month) { return Payroll.findAll({ where: { periodYear: year, periodMonth: month }, include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: PayrollItem, as: 'items' }], order: [['createdAt', 'DESC']] }); }
async function approvePayroll(id, userId) { const p = await Payroll.findByPk(id); if (!p) throw new AppError('Bulunamadi', 404); if (p.status === 'APPROVED') throw new AppError('Zaten onaylanmis', 400); if (p.status !== 'CALCULATED') throw new AppError('Sadece hesaplanmis bordrolar onaylanabilir', 400); await p.update({ status: 'APPROVED', approvedBy: userId, approvedAt: new Date() }); return p; }
async function cancelPayroll(id) { const p = await Payroll.findByPk(id); if (!p) throw new AppError('Bulunamadi', 404); if (p.status === 'PAID') throw new AppError('Odenmis iptal edilemez', 400); await p.update({ status: 'CANCELLED' }); return p; }
async function getMyPayrolls(cu) { return Payroll.findAll({ where: { employeeId: cu.employeeId }, include: [{ model: PayrollItem, as: 'items' }], order: [['periodYear', 'DESC'], ['periodMonth', 'DESC']] }); }
async function getCostReport(query) {
  query = query || {}; const where = {};
  if (query.month) where.periodMonth = Number(query.month); if (query.year) where.periodYear = Number(query.year);
  const payrolls = await Payroll.findAll({ where, include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }] });
  const s = { company: { grossTotal: 0, netTotal: 0, deductionTotal: 0, employerCostTotal: 0 }, departments: {} };
  for (const p of payrolls) { const dn = p.employee?.department?.name || 'Bilinmeyen'; if (!s.departments[dn]) s.departments[dn] = { department: dn, grossTotal: 0, netTotal: 0, deductionTotal: 0, employerCostTotal: 0, employeeCount: 0 }; s.departments[dn].grossTotal += Number(p.totalGrossEarnings || p.grossSalary); s.departments[dn].netTotal += Number(p.netSalary); s.departments[dn].deductionTotal += Number(p.totalDeductions); s.departments[dn].employerCostTotal += Number(p.totalEmployerCost || 0); s.departments[dn].employeeCount += 1; s.company.grossTotal += Number(p.totalGrossEarnings || p.grossSalary); s.company.netTotal += Number(p.netSalary); s.company.deductionTotal += Number(p.totalDeductions); s.company.employerCostTotal += Number(p.totalEmployerCost || 0); }
  return s;
}
async function listParameters(year) { const where = { isActive: true }; if (year) where.year = year; return PayrollParameter.findAll({ where, order: [['year', 'DESC'], ['parameterName', 'ASC']] }); }

module.exports = { calculateOnly, generatePayroll, runPayroll, listPayrolls, getPayrollById, getPayrollsByEmployee, getPayrollsByPeriod, approvePayroll, cancelPayroll, getMyPayrolls, getCostReport, listParameters };