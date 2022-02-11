'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // define association here
    }
  };
  Client.init({
    full_name: DataTypes.STRING,
    type: DataTypes.ENUM('self', 'another'),
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'clients',
    modelName: 'Client',
  });
  return Client;
};