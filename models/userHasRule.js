'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserHasRule extends Model {
    static associate(models) {
      // define association here
    }
  };
  UserHasRule.init({
    user_id: DataTypes.INTEGER,
    rule_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'user_has_rules',
    modelName: 'UserHasRule',
  });
  return UserHasRule;
};