module.exports = (sequelize, DataTypes) => {
  const PayrollItem = sequelize.define('PayrollItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    payrollId: { type: DataTypes.UUID, allowNull: false, field: 'payroll_id' },
    itemType: { type: DataTypes.ENUM('EARNING', 'DEDUCTION'), allowNull: false, field: 'item_type' },
    itemName: { type: DataTypes.STRING(100), allowNull: false, field: 'item_name' },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
  }, { tableName: 'payroll_items' });
  return PayrollItem;
};
