const { EvaluationPeriod, Goal, Evaluation, Employee, Department } = require('../models');
const AppError = require('../utils/AppError');
const { ROLES } = require('../utils/constants');

async function recalculateEvaluation(employeeId, periodId) {
  const goals = await Goal.findAll({ where: { employeeId, periodId } });
  if (!goals.length) return null;
  const weightedTotal = goals.reduce((acc, g) => {
    const w = Number(g.weight || 0);
    const s = g.managerScore != null ? Number(g.managerScore) : g.selfScore != null ? Number(g.selfScore) : 0;
    return acc + (s * w);
  }, 0);
  const totalWeight = goals.reduce((acc, g) => acc + Number(g.weight || 0), 0);
  const overallScore = totalWeight > 0 ? Number((weightedTotal / totalWeight).toFixed(1)) : 0;
  const evaluation = await Evaluation.findOne({ where: { employeeId, periodId } });
  if (evaluation) { await evaluation.update({ overallScore, status: 'COMPLETED' }); return evaluation; }
  return Evaluation.create({ employeeId, periodId, overallScore, status: 'COMPLETED' });
}

async function listPeriods() { return EvaluationPeriod.findAll({ order: [['startDate', 'DESC']] }); }
async function createPeriod(payload) { return EvaluationPeriod.create(payload); }
async function updatePeriod(id, payload) {
  const period = await EvaluationPeriod.findByPk(id);
  if (!period) throw new AppError('Degerlendirme donemi bulunamadi', 404);
  await period.update(payload); return period;
}

async function createGoal(currentUser, payload) {
  if (currentUser.role === ROLES.MANAGER) {
    const emp = await Employee.findByPk(payload.employeeId);
    if (!emp || emp.managerId !== currentUser.employeeId) throw new AppError('Sadece kendi ekibiniz icin hedef tanimlayabilirsiniz', 403);
  }
  return Goal.create(payload);
}

async function updateGoal(currentUser, goalId, payload) {
  const goal = await Goal.findByPk(goalId, { include: [{ model: Employee, as: 'employee' }] });
  if (!goal) throw new AppError('Hedef bulunamadi', 404);
  if (currentUser.role === ROLES.MANAGER && goal.employee.managerId !== currentUser.employeeId) throw new AppError('Bu hedefi guncellemeye yetkiniz yok', 403);
  await goal.update(payload); return goal;
}

async function listGoals(currentUser, query = {}) {
  const where = {};
  if (query.periodId) where.periodId = query.periodId;
  if (currentUser.role === ROLES.EMPLOYEE) where.employeeId = currentUser.employeeId;
  else if (currentUser.role === ROLES.MANAGER) {
    const team = await Employee.findAll({ where: { managerId: currentUser.employeeId }, attributes: ['id'] });
    where.employeeId = team.map((e) => e.id);
  }
  return Goal.findAll({ where, include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: EvaluationPeriod, as: 'period' }], order: [['createdAt', 'DESC']] });
}

async function selfScoreGoal(currentUser, goalId, selfScore) {
  const goal = await Goal.findByPk(goalId);
  if (!goal) throw new AppError('Hedef bulunamadi', 404);
  if (goal.employeeId !== currentUser.employeeId) throw new AppError('Sadece kendi hedeflerinizi puanlayabilirsiniz', 403);
  await goal.update({ selfScore, finalScore: goal.managerScore || selfScore });
  await recalculateEvaluation(goal.employeeId, goal.periodId);
  return goal;
}

async function managerScoreGoal(currentUser, goalId, managerScore) {
  const goal = await Goal.findByPk(goalId, { include: [{ model: Employee, as: 'employee' }] });
  if (!goal) throw new AppError('Hedef bulunamadi', 404);
  if (currentUser.role === ROLES.MANAGER && goal.employee.managerId !== currentUser.employeeId) throw new AppError('Sadece kendi ekibinizi degerlendirebilirsiniz', 403);
  await goal.update({ managerScore, finalScore: managerScore });
  await recalculateEvaluation(goal.employeeId, goal.periodId);
  return goal;
}

async function listEvaluations(currentUser, query = {}) {
  const where = {};
  if (query.periodId) where.periodId = query.periodId;
  if (currentUser.role === ROLES.EMPLOYEE) where.employeeId = currentUser.employeeId;
  else if (currentUser.role === ROLES.MANAGER) {
    const team = await Employee.findAll({ where: { managerId: currentUser.employeeId }, attributes: ['id'] });
    where.employeeId = team.map((e) => e.id);
  }
  return Evaluation.findAll({ where, include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: EvaluationPeriod, as: 'period' }], order: [['createdAt', 'DESC']] });
}

async function getPerformanceReports() {
  const evaluations = await Evaluation.findAll({ include: [{ model: Employee, as: 'employee', include: [{ model: Department, as: 'department' }] }, { model: EvaluationPeriod, as: 'period' }] });
  const deptScores = {};
  for (const e of evaluations) {
    const dn = e.employee?.department?.name || 'Bilinmeyen';
    if (!deptScores[dn]) deptScores[dn] = { department: dn, totalScore: 0, count: 0 };
    deptScores[dn].totalScore += Number(e.overallScore || 0);
    deptScores[dn].count += 1;
  }
  const departments = Object.values(deptScores).map((d) => ({ department: d.department, averageScore: d.count ? Number((d.totalScore / d.count).toFixed(1)) : 0, employeeCount: d.count }));
  return { departments, evaluations };
}

module.exports = { listPeriods, createPeriod, updatePeriod, createGoal, updateGoal, listGoals, selfScoreGoal, managerScoreGoal, listEvaluations, getPerformanceReports };
