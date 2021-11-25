'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkType extends Model {
    static associate(models) {
      // define association here
    }
  };
  WorkType.init({
    title: DataTypes.STRING,
    value: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'work_types',
    modelName: 'WorkType',
  });
  return WorkType;
};