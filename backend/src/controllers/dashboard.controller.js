const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/responseHelper');

const getSummary = catchAsync(async (req, res) => { return success(res, await dashboardService.getSummary(), 'Dashboard ozeti'); });
const getDepartmentDistribution = catchAsync(async (req, res) => { return success(res, await dashboardService.getDepartmentDistribution(), 'Departman dagilimi'); });
const getEmployeeStatusDistribution = catchAsync(async (req, res) => { return success(res, await dashboardService.getEmployeeStatusDistribution(), 'Calisan durum dagilimi'); });
const getLeaveStats = catchAsync(async (req, res) => { return success(res, await dashboardService.getLeaveStats(), 'Izin istatistikleri'); });
const getPayrollTrend = catchAsync(async (req, res) => { return success(res, await dashboardService.getPayrollTrend(), 'Bordro trendi'); });
const getPerformanceDistribution = catchAsync(async (req, res) => { return success(res, await dashboardService.getPerformanceDistribution(), 'Performans dagilimi'); });
const getRecentActivities = catchAsync(async (req, res) => { return success(res, await dashboardService.getRecentActivities(), 'Son aktiviteler'); });
const getPayrollStats = catchAsync(async (req, res) => { return success(res, await dashboardService.getPayrollStats(), 'Bordro istatistikleri'); });
const getPerformanceStats = catchAsync(async (req, res) => { return success(res, await dashboardService.getPerformanceStats(), 'Performans istatistikleri'); });

module.exports = { getSummary, getDepartmentDistribution, getEmployeeStatusDistribution, getLeaveStats, getPayrollTrend, getPerformanceDistribution, getRecentActivities, getPayrollStats, getPerformanceStats };