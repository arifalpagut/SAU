const { EVALUATION_STATUS } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    periodId: { type: DataTypes.UUID, allowNull: false, field: 'period_id' },
    reviewerId: { type: DataTypes.UUID, allowNull: true, field: 'reviewer_id' },
    overallScore: { type: DataTypes.DECIMAL(3, 1), allowNull: true, field: 'overall_score' },
    managerComment: { type: DataTypes.TEXT, allowNull: true, field: 'manager_comment' },
    employeeComment: { type: DataTypes.TEXT, allowNull: true, field: 'employee_comment' },
    feedback: { type: DataTypes.TEXT, allowNull: true },
    strengths: { type: DataTypes.TEXT, allowNull: true },
    improvementAreas: { type: DataTypes.TEXT, allowNull: true, field: 'improvement_areas' },
    status: { type: DataTypes.ENUM(...Object.values(EVALUATION_STATUS)), allowNull: false, defaultValue: EVALUATION_STATUS.IN_PROGRESS }
  }, { tableName: 'evaluations' });
  return Evaluation;
};