module.exports = (sequelize, DataTypes) => {
  const CriterionScore = sequelize.define('CriterionScore', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    evaluationId: { type: DataTypes.UUID, allowNull: false, field: 'evaluation_id' },
    criterionId: { type: DataTypes.UUID, allowNull: false, field: 'criterion_id' },
    score: { type: DataTypes.DECIMAL(3, 1), allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: true },
    scoredBy: { type: DataTypes.UUID, allowNull: true, field: 'scored_by' }
  }, { tableName: 'criterion_scores' });
  return CriterionScore;
};