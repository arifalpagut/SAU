const { LEAVE_STATUS } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    leaveTypeId: { type: DataTypes.UUID, allowNull: false, field: 'leave_type_id' },
    startDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'end_date' },
    totalDays: { type: DataTypes.DECIMAL(4, 1), allowNull: false, field: 'total_days' },
    businessDays: { type: DataTypes.INTEGER, allowNull: true, field: 'business_days' },
    reason: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM(...Object.values(LEAVE_STATUS)), allowNull: false, defaultValue: LEAVE_STATUS.PENDING },
    approvedBy: { type: DataTypes.UUID, allowNull: true, field: 'approved_by' },
    approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
    managerApproverId: { type: DataTypes.UUID, allowNull: true, field: 'manager_approver_id' },
    managerApprovedAt: { type: DataTypes.DATE, allowNull: true, field: 'manager_approved_at' },
    hrApproverId: { type: DataTypes.UUID, allowNull: true, field: 'hr_approver_id' },
    hrApprovedAt: { type: DataTypes.DATE, allowNull: true, field: 'hr_approved_at' },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true, field: 'rejection_reason' }
  }, { tableName: 'leaves' });
  return Leave;
};