module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING(100), allowNull: false },
    level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    departmentId: { type: DataTypes.UUID, allowNull: false, field: 'department_id' }
  }, { tableName: 'positions' });
  return Position;
};
