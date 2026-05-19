const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./User');
const DepartmentModel = require('./Department');
const PositionModel = require('./Position');
const EmployeeModel = require('./Employee');
const LeaveTypeModel = require('./LeaveType');
const LeaveBalanceModel = require('./LeaveBalance');
const LeaveModel = require('./Leave');
const PayrollModel = require('./Payroll');
const PayrollItemModel = require('./PayrollItem');
const EvaluationPeriodModel = require('./EvaluationPeriod');
const GoalModel = require('./Goal');
const EvaluationModel = require('./Evaluation');
const AuditLogModel = require('./AuditLog');
const RefreshTokenModel = require('./RefreshToken');

const User = UserModel(sequelize, DataTypes);
const Department = DepartmentModel(sequelize, DataTypes);
const Position = PositionModel(sequelize, DataTypes);
const Employee = EmployeeModel(sequelize, DataTypes);
const LeaveType = LeaveTypeModel(sequelize, DataTypes);
const LeaveBalance = LeaveBalanceModel(sequelize, DataTypes);
const Leave = LeaveModel(sequelize, DataTypes);
const Payroll = PayrollModel(sequelize, DataTypes);
const PayrollItem = PayrollItemModel(sequelize, DataTypes);
const EvaluationPeriod = EvaluationPeriodModel(sequelize, DataTypes);
const Goal = GoalModel(sequelize, DataTypes);
const Evaluation = EvaluationModel(sequelize, DataTypes);
const AuditLog = AuditLogModel(sequelize, DataTypes);
const RefreshToken = RefreshTokenModel(sequelize, DataTypes);

Department.hasMany(Position, { foreignKey: 'department_id', as: 'positions' });
Position.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Employee, { foreignKey: 'department_id', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Position.hasMany(Employee, { foreignKey: 'position_id', as: 'employees' });
Employee.belongsTo(Position, { foreignKey: 'position_id', as: 'position' });
Employee.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'manager_id', as: 'teamMembers' });
Employee.hasOne(User, { foreignKey: 'employee_id', as: 'user' });
User.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
Employee.hasMany(Leave, { foreignKey: 'employee_id', as: 'leaves' });
Leave.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
LeaveType.hasMany(Leave, { foreignKey: 'leave_type_id', as: 'leaves' });
Leave.belongsTo(LeaveType, { foreignKey: 'leave_type_id', as: 'leaveType' });
Employee.hasMany(LeaveBalance, { foreignKey: 'employee_id', as: 'leaveBalances' });
LeaveBalance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
LeaveType.hasMany(LeaveBalance, { foreignKey: 'leave_type_id', as: 'leaveBalances' });
LeaveBalance.belongsTo(LeaveType, { foreignKey: 'leave_type_id', as: 'leaveType' });
Employee.hasMany(Payroll, { foreignKey: 'employee_id', as: 'payrolls' });
Payroll.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
Payroll.hasMany(PayrollItem, { foreignKey: 'payroll_id', as: 'items' });
PayrollItem.belongsTo(Payroll, { foreignKey: 'payroll_id', as: 'payroll' });
EvaluationPeriod.hasMany(Goal, { foreignKey: 'period_id', as: 'goals' });
Goal.belongsTo(EvaluationPeriod, { foreignKey: 'period_id', as: 'period' });
Employee.hasMany(Goal, { foreignKey: 'employee_id', as: 'goals' });
Goal.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
EvaluationPeriod.hasMany(Evaluation, { foreignKey: 'period_id', as: 'evaluations' });
Evaluation.belongsTo(EvaluationPeriod, { foreignKey: 'period_id', as: 'period' });
Employee.hasMany(Evaluation, { foreignKey: 'employee_id', as: 'evaluations' });
Evaluation.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize, User, Department, Position, Employee, LeaveType, LeaveBalance,
  Leave, Payroll, PayrollItem, EvaluationPeriod, Goal, Evaluation, AuditLog, RefreshToken
};
