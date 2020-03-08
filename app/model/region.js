/*
 * @Author: qiao
 * @Date: 2018-07-16 11:30:32
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-16 19:55:58
 * 省份城市区域表
 */

const { SMALLINT, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const region = sequelize.define(
    "region",
    {
      id: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      parent_id: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      name: {
        type: STRING(120),
        allowNull: false,
        defaultValue: ""
      },

      type: {
        type: TINYINT,
        allowNull: false,
        defaultValue: 2
      },

      agency_id: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "region",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "4044"
    }
  );

  return region;
};
