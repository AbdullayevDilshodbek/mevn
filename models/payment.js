'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // define association here
    }
  };
  Payment.init({
    title: DataTypes.STRING,
    value: DataTypes.INTEGER,
    work_list_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
  });
  return Payment;
};