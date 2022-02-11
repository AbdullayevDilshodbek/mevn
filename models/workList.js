'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Client, {
        foreignKey: 'client_id',
        as: 'client'
      })

      this.belongsTo(models.WorkType, {
        foreignKey: 'work_type_id',
        as: 'work_type'
      })

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      })
    }
  };
  WorkList.init({
    title: DataTypes.STRING,
    value: DataTypes.DOUBLE,
    client_id: DataTypes.INTEGER,
    work_type_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'work_list',
    modelName: 'WorkList',
  });
  return WorkList;
};