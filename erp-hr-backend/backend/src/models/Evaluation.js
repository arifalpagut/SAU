const { EVALUATION_STATUS } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeId: { type: DataTypes.UUID, allowNull: false, field: 'employee_id' },
    periodId: { type: DataTypes.UUID, allowNull: false, field: 'period_id' },
    overallScore: { type: DataTypes.DECIMAL(3, 1), allowNull: true, field: 'overall_score' },
    managerComment: { type: DataTypes.TEXT, allowNull: true, field: 'manager_comment' },
    status: { type: DataTypes.ENUM(...Object.values(EVALUATION_STATUS)), allowNull: false, defaultValue: EVALUATION_STATUS.IN_PROGRESS }
  }, { tableName: 'evaluations' });
  return Evaluation;
};
