const { Payroll, PayrollItem, Employee, Department } = require('../models');
const AppError = require('../utils/AppError');
const { calculatePayroll } = require('../utils/payrollCalculator');
const { sequelize } = require('../models');

async function runPayroll(month, year) {
  const employees = await Employee.findAll({ where: { status: 'ACTIVE' } });
  const results = [];
  for (const employee of employees) {
    const transaction = await sequelize.transaction();
    try {
      const existing = await Payroll.findOne({ where: { employeeId: employee.id, periodMonth: month, periodYear: year }, transaction });
      const calculated = calculatePayroll({ grossSalary: employee.grossSalary, additions: 0 });
      let payroll;
      if (existing) {
        await existing.update({ grossSalary: calculated.grossSalary, totalAdditions: calculated.totalAdditions, totalDeductions: calculated.totalDeductions, netSalary: calculated.netSalary, status: 'CALCULATED', calculatedAt: new Date() }, { transaction });
        await PayrollItem.destroy({ where: { payrollId: existing.id }, transaction });
        payroll = existing;
      } else {
        payroll = await Payroll.create({ employeeId: employee.id, periodMonth: month, periodYear: year, grossSalary: calculated.grossSalary, totalAdditions: calculated.totalAdditions, totalDeductions: calculated.totalDeductions, netSalary: calculated.netSalary, status: 'CALCULATED', calculatedAt: new Date() }, { transaction });
      }
      for (const item of calculated.items) {
        await PayrollItem.create({ payrollId: payroll.id, itemType: item.itemType, itemName: item.itemName, amount: item.amount }, { transaction });
      }
      await transaction.commit();
      results.push(payroll);
    } catch (error) { await transaction.rollback(); throw error; }
  }
  return results;
}

async function listPayrolls(query = {}) {
  const where = {};
  if (query.month) where.periodMonth = Number(query.month);
  if (query.year) where.periodYear = Number(query.year);
  return Payroll.findAll({ where, include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: PayrollItem, as: 'items' }], order: [['periodYear', 'DESC'], ['periodMonth', 'DESC']] });
}

async function getPayrollById(id, currentUser) {
  const payroll = await Payroll.findByPk(id, { include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: PayrollItem, as: 'items' }] });
  if (!payroll) throw new AppError('Bordro kaydi bulunamadi', 404);
  if (currentUser.role === 'EMPLOYEE' && payroll.employeeId !== currentUser.employeeId) throw new AppError('Sadece kendi bordronuzu goruntuleyebilirsiniz', 403);
  return payroll;
}

async function getMyPayrolls(currentUser) {
  return Payroll.findAll({ where: { employeeId: currentUser.employeeId }, include: [{ model: PayrollItem, as: 'items' }], order: [['periodYear', 'DESC'], ['periodMonth', 'DESC']] });
}

async function approvePayroll(id) {
  const payroll = await Payroll.findByPk(id);
  if (!payroll) throw new AppError('Bordro kaydi bulunamadi', 404);
  await payroll.update({ status: 'APPROVED' });
  return payroll;
}

async function getCostReport(query = {}) {
  const where = {};
  if (query.month) where.periodMonth = Number(query.month);
  if (query.year) where.periodYear = Number(query.year);
  const payrolls = await Payroll.findAll({ where, include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }] });
  const summary = payrolls.reduce((acc, p) => {
    const deptName = p.employee?.department?.name || 'Bilinmeyen';
    if (!acc.departments[deptName]) acc.departments[deptName] = { department: deptName, grossTotal: 0, netTotal: 0, deductionTotal: 0, employeeCount: 0 };
    acc.departments[deptName].grossTotal += Number(p.grossSalary);
    acc.departments[deptName].netTotal += Number(p.netSalary);
    acc.departments[deptName].deductionTotal += Number(p.totalDeductions);
    acc.departments[deptName].employeeCount += 1;
    acc.company.grossTotal += Number(p.grossSalary);
    acc.company.netTotal += Number(p.netSalary);
    acc.company.deductionTotal += Number(p.totalDeductions);
    return acc;
  }, { company: { grossTotal: 0, netTotal: 0, deductionTotal: 0 }, departments: {} });
  return summary;
}

module.exports = { runPayroll, listPayrolls, getPayrollById, getMyPayrolls, approvePayroll, getCostReport };
