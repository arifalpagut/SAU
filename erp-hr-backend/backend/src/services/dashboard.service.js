const { Employee, Leave, Payroll, Evaluation } = require('../models');

async function getSummary() {
  const totalEmployees = await Employee.count();
  const activeEmployees = await Employee.count({ where: { status: 'ACTIVE' } });
  const pendingLeaves = await Leave.count({ where: { status: 'PENDING' } });
  const approvedLeaves = await Leave.count({ where: { status: 'APPROVED' } });
  const payrolls = await Payroll.findAll();
  const totalPayrollCost = payrolls.reduce((acc, p) => acc + Number(p.grossSalary), 0);
  const evaluations = await Evaluation.findAll();
  const averagePerformance = evaluations.length > 0 ? Number((evaluations.reduce((acc, e) => acc + Number(e.overallScore || 0), 0) / evaluations.length).toFixed(1)) : 0;
  return { totalEmployees, activeEmployees, pendingLeaves, approvedLeaves, totalPayrollCost, averagePerformance };
}

async function getLeaveStats() {
  const allLeaves = await Leave.findAll();
  const byStatus = allLeaves.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});
  return { total: allLeaves.length, byStatus };
}

async function getPayrollStats() {
  const payrolls = await Payroll.findAll();
  return { totalRecords: payrolls.length, totalGross: payrolls.reduce((a,p)=>a+Number(p.grossSalary),0), totalNet: payrolls.reduce((a,p)=>a+Number(p.netSalary),0), totalDeductions: payrolls.reduce((a,p)=>a+Number(p.totalDeductions),0) };
}

async function getPerformanceStats() {
  const evaluations = await Evaluation.findAll();
  const average = evaluations.length > 0 ? Number((evaluations.reduce((a,e)=>a+Number(e.overallScore||0),0)/evaluations.length).toFixed(1)) : 0;
  return { totalEvaluations: evaluations.length, averageScore: average };
}

module.exports = { getSummary, getLeaveStats, getPayrollStats, getPerformanceStats };
