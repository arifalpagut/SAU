const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const getSummary = catchAsync(async (req, res) => { return success(res, await dashboardService.getSummary(), 'Ozet dashboard verisi getirildi'); });
const getLeaveStats = catchAsync(async (req, res) => { return success(res, await dashboardService.getLeaveStats(), 'Izin istatistikleri getirildi'); });
const getPayrollStats = catchAsync(async (req, res) => { return success(res, await dashboardService.getPayrollStats(), 'Bordro istatistikleri getirildi'); });
const getPerformanceStats = catchAsync(async (req, res) => { return success(res, await dashboardService.getPerformanceStats(), 'Performans istatistikleri getirildi'); });

module.exports = { getSummary, getLeaveStats, getPayrollStats, getPerformanceStats };
