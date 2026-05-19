const { PERIOD_STATUS } = require('../utils/constants');
module.exports = (sequelize, DataTypes) => {
  const EvaluationPeriod = sequelize.define('EvaluationPeriod', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'end_date' },
    status: { type: DataTypes.ENUM(...Object.values(PERIOD_STATUS)), allowNull: false, defaultValue: PERIOD_STATUS.DRAFT }
  }, { tableName: 'evaluation_periods' });
  return EvaluationPeriod;
};
