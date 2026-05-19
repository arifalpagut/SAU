const performanceService = require('../services/performance.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const listPeriods = catchAsync(async (req, res) => { return success(res, await performanceService.listPeriods(), 'Degerlendirme donemleri getirildi'); });
const createPeriod = catchAsync(async (req, res) => {
  const data = await performanceService.createPeriod(req.body);
  res.locals.audit = { action: 'CREATE', entityType: 'evaluation_periods', entityId: data.id, newValues: req.body };
  return success(res, data, 'Degerlendirme donemi olusturuldu', 201);
});
const updatePeriod = catchAsync(async (req, res) => {
  const data = await performanceService.updatePeriod(req.params.id, req.body);
  res.locals.audit = { action: 'UPDATE', entityType: 'evaluation_periods', entityId: data.id, newValues: req.body };
  return success(res, data, 'Degerlendirme donemi guncellendi');
});
const listGoals = catchAsync(async (req, res) => { return success(res, await performanceService.listGoals(req.user, req.query), 'Hedefler getirildi'); });
const createGoal = catchAsync(async (req, res) => {
  const data = await performanceService.createGoal(req.user, req.body);
  res.locals.audit = { action: 'CREATE', entityType: 'goals', entityId: data.id, newValues: req.body };
  return success(res, data, 'Hedef olusturuldu', 201);
});
const updateGoal = catchAsync(async (req, res) => {
  const data = await performanceService.updateGoal(req.user, req.params.id, req.body);
  res.locals.audit = { action: 'UPDATE', entityType: 'goals', entityId: data.id, newValues: req.body };
  return success(res, data, 'Hedef guncellendi');
});
const selfScoreGoal = catchAsync(async (req, res) => {
  const data = await performanceService.selfScoreGoal(req.user, req.params.id, req.body.selfScore);
  res.locals.audit = { action: 'SELF_SCORE', entityType: 'goals', entityId: data.id };
  return success(res, data, 'Oz degerlendirme kaydedildi');
});
const managerScoreGoal = catchAsync(async (req, res) => {
  const data = await performanceService.managerScoreGoal(req.user, req.params.id, req.body.managerScore);
  res.locals.audit = { action: 'MANAGER_SCORE', entityType: 'goals', entityId: data.id };
  return success(res, data, 'Yonetici degerlendirmesi kaydedildi');
});
const listEvaluations = catchAsync(async (req, res) => { return success(res, await performanceService.listEvaluations(req.user, req.query), 'Degerlendirmeler getirildi'); });
const getReports = catchAsync(async (req, res) => { return success(res, await performanceService.getPerformanceReports(), 'Performans raporu getirildi'); });

module.exports = { listPeriods, createPeriod, updatePeriod, listGoals, createGoal, updateGoal, selfScoreGoal, managerScoreGoal, listEvaluations, getReports };
