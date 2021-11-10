'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      const options = {
        through: 'user_has_rules',
        as: 'rules',
        foreignKey: 'user_id',
        otherKey: 'rule_id',
      };
      this.belongsToMany(models.Rule, options);
    }
  };
  User.init({
    username: DataTypes.STRING,
    full_name: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};