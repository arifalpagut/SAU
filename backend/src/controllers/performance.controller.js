const performanceService = require('../services/performance.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const listPeriods = catchAsync(async (req, res) => { return success(res, await performanceService.listPeriods(), 'Donemler'); });
const createPeriod = catchAsync(async (req, res) => { const data = await performanceService.createPeriod(req.body); res.locals.audit = { action: 'CREATE', entityType: 'evaluation_periods', entityId: data.id }; return success(res, data, 'Donem olusturuldu', 201); });
const updatePeriod = catchAsync(async (req, res) => { const data = await performanceService.updatePeriod(req.params.id, req.body); return success(res, data, 'Donem guncellendi'); });
const listGoals = catchAsync(async (req, res) => { return success(res, await performanceService.listGoals(req.user, req.query), 'Hedefler'); });
const createGoal = catchAsync(async (req, res) => { const data = await performanceService.createGoal(req.user, req.body); return success(res, data, 'Hedef olusturuldu', 201); });
const updateGoal = catchAsync(async (req, res) => { const data = await performanceService.updateGoal(req.user, req.params.id, req.body); return success(res, data, 'Hedef guncellendi'); });
const selfScoreGoal = catchAsync(async (req, res) => { const data = await performanceService.selfScoreGoal(req.user, req.params.id, req.body.selfScore); return success(res, data, 'Oz degerlendirme'); });
const managerScoreGoal = catchAsync(async (req, res) => { const data = await performanceService.managerScoreGoal(req.user, req.params.id, req.body.managerScore); return success(res, data, 'Yonetici puani'); });
const listEvaluations = catchAsync(async (req, res) => { return success(res, await performanceService.listEvaluations(req.user, req.query), 'Degerlendirmeler'); });
const getReports = catchAsync(async (req, res) => { return success(res, await performanceService.getPerformanceReports(), 'Performans raporu'); });
const listCriteria = catchAsync(async (req, res) => { return success(res, await performanceService.listCriteria(), 'Kriterler'); });
const scoreCriteria = catchAsync(async (req, res) => {
  const data = await performanceService.scoreCriteria(req.user, req.params.evaluationId, req.body.scores, req.body.feedback);
  res.locals.audit = { action: 'SCORE_CRITERIA', entityType: 'evaluations', entityId: data.id };
  return success(res, data, 'Kriter puanlamasi kaydedildi');
});

module.exports = { listPeriods, createPeriod, updatePeriod, listGoals, createGoal, updateGoal, selfScoreGoal, managerScoreGoal, listEvaluations, getReports, listCriteria, scoreCriteria };