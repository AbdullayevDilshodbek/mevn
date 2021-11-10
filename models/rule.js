'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rule extends Model {
    static associate(models) {
      // define association here
    }
  };
  Rule.init({
    title: DataTypes.STRING,
    code: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'rules',
    modelName: 'Rule',
  });
  return Rule;
};