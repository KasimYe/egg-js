/*
 * @Author: qiao
 * @Date: 2018-07-16 11:15:25
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 16:56:24
 * 地址表
 */

const { MEDIUMINT, SMALLINT, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const address = sequelize.define(
     "address",
    {
      id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ""
      },

      user_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      country_id: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: 0
      },

      province_id: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: 0
      },

      city_id: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: 0
      },

      district_id: {
        type: SMALLINT,
        allowNull: false,
        defaultValue: 0
      },

      address: {
        type: STRING(120),
        allowNull: false,
        defaultValue: ""
      },

      mobile: {
        type: STRING(60),
        allowNull: false,
        defaultValue: ""
      },

      is_default: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "被置位1的是默认地址"
      }
    },
    {
      freezeTableName: true,
      tableName:tablePrefix + "address",      
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "12",
      indexes: [{ name: "user_id", fields: ["user_id"] }]
    }
  ); 

  return address;
};
