/*
 * @Author: qiao
 * @Date: 2018-07-11 20:32:00
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 20:40:47
 * 规格表
 */


const { INTEGER, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const specification = sequelize.define(
    "specification",
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        comment: "规格名"
      },

      sort_order: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "specification",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "3"
    }
  );

  return specification;
};
