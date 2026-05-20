const { Employee, Leave, Payroll, Evaluation, Department, Position, AuditLog } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

async function getSummary() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const totalEmployees = await Employee.count();
  const activeEmployees = await Employee.count({ where: { status: 'ACTIVE' } });
  const passiveEmployees = await Employee.count({ where: { status: { [Op.in]: ['INACTIVE', 'TERMINATED'] } } });
  const totalDepartments = await Department.count({ where: { isActive: true } });
  const totalPositions = await Position.count();
  const pendingLeaves = await Leave.count({ where: { status: 'PENDING' } });

  const thisMonthApproved = await Leave.count({
    where: { status: 'APPROVED', approvedAt: { [Op.gte]: new Date(currentYear, currentMonth - 1, 1) } }
  });

  const thisMonthPayrolls = await Payroll.count({
    where: { periodMonth: currentMonth, periodYear: currentYear }
  });

  const monthlyPayrolls = await Payroll.findAll({
    where: { periodMonth: currentMonth, periodYear: currentYear }
  });
  const totalMonthlyGross = monthlyPayrolls.reduce((a, p) => a + Number(p.totalGrossEarnings || p.grossSalary || 0), 0);
  const totalMonthlyNet = monthlyPayrolls.reduce((a, p) => a + Number(p.netSalary || 0), 0);
  const totalEmployerCost = monthlyPayrolls.reduce((a, p) => a + Number(p.totalEmployerCost || 0), 0);

  const evaluations = await Evaluation.findAll();
  const averagePerformance = evaluations.length > 0
    ? Number((evaluations.reduce((a, e) => a + Number(e.overallScore || 0), 0) / evaluations.length).toFixed(1)) : 0;
  const pendingEvaluations = await Evaluation.count({ where: { status: 'IN_PROGRESS' } });

  return {
    totalEmployees, activeEmployees, passiveEmployees, totalDepartments, totalPositions,
    pendingLeaves, thisMonthApproved, thisMonthPayrolls,
    totalMonthlyGross, totalMonthlyNet, totalEmployerCost,
    averagePerformance, pendingEvaluations, currentMonth, currentYear
  };
}

async function getDepartmentDistribution() {
  const departments = await Department.findAll({ where: { isActive: true } });
  const result = [];
  for (const dept of departments) {
    const count = await Employee.count({ where: { departmentId: dept.id, status: 'ACTIVE' } });
    result.push({ name: dept.name, value: count });
  }
  return result;
}

async function getEmployeeStatusDistribution() {
  const statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'];
  const result = [];
  for (const s of statuses) {
    const count = await Employee.count({ where: { status: s } });
    if (count > 0) result.push({ name: s, value: count });
  }
  return result;
}

async function getLeaveStats() {
  const allLeaves = await Leave.findAll();
  const byStatus = {};
  allLeaves.forEach(l => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
  return { total: allLeaves.length, byStatus };
}

async function getPayrollTrend() {
  const now = new Date();
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const payrolls = await Payroll.findAll({ where: { periodMonth: month, periodYear: year } });
    const gross = payrolls.reduce((a, p) => a + Number(p.totalGrossEarnings || p.grossSalary || 0), 0);
    const net = payrolls.reduce((a, p) => a + Number(p.netSalary || 0), 0);
    result.push({ name: month + '/' + year, brut: Math.round(gross), net: Math.round(net) });
  }
  return result;
}

async function getPerformanceDistribution() {
  const evaluations = await Evaluation.findAll();
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  evaluations.forEach(e => { const s = Math.round(Number(e.overallScore || 0)); if (s >= 1 && s <= 5) dist[s]++; });
  return Object.entries(dist).map(([k, v]) => ({ name: k + ' Puan', value: v }));
}

async function getRecentActivities() {
  const recentEmployees = await Employee.findAll({ order: [['createdAt', 'DESC']], limit: 5, include: [{ model: Department, as: 'department' }] });
  const recentLeaves = await Leave.findAll({ where: { status: { [Op.in]: ['PENDING', 'APPROVED'] } }, order: [['createdAt', 'DESC']], limit: 5, include: [{ model: Employee, as: 'employee' }] });
  const recentPayrolls = await Payroll.findAll({ order: [['createdAt', 'DESC']], limit: 5, include: [{ model: Employee, as: 'employee' }] });
  const pendingApprovals = await Leave.count({ where: { status: 'PENDING' } });
  const pendingPayrollApprovals = await Payroll.count({ where: { status: 'CALCULATED' } });

  return {
    recentEmployees: recentEmployees.map(e => ({ id: e.id, name: e.firstName + ' ' + e.lastName, department: e.department?.name, date: e.createdAt })),
    recentLeaves: recentLeaves.map(l => ({ id: l.id, employee: l.employee ? l.employee.firstName + ' ' + l.employee.lastName : '', status: l.status, startDate: l.startDate })),
    recentPayrolls: recentPayrolls.map(p => ({ id: p.id, employee: p.employee ? p.employee.firstName + ' ' + p.employee.lastName : '', month: p.periodMonth + '/' + p.periodYear, status: p.status })),
    pendingApprovals: pendingApprovals + pendingPayrollApprovals
  };
}

async function getPayrollStats() {
  const payrolls = await Payroll.findAll();
  return {
    totalRecords: payrolls.length,
    totalGross: payrolls.reduce((a, p) => a + Number(p.grossSalary), 0),
    totalNet: payrolls.reduce((a, p) => a + Number(p.netSalary), 0),
    totalDeductions: payrolls.reduce((a, p) => a + Number(p.totalDeductions), 0)
  };
}

async function getPerformanceStats() {
  const evaluations = await Evaluation.findAll();
  const avg = evaluations.length > 0 ? Number((evaluations.reduce((a, e) => a + Number(e.overallScore || 0), 0) / evaluations.length).toFixed(1)) : 0;
  return { totalEvaluations: evaluations.length, averageScore: avg };
}

module.exports = { getSummary, getDepartmentDistribution, getEmployeeStatusDistribution, getLeaveStats, getPayrollTrend, getPerformanceDistribution, getRecentActivities, getPayrollStats, getPerformanceStats };