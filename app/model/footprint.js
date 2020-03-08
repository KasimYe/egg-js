/*
 * @Author: qiao
 * @Date: 2018-07-11 17:21:10
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 19:44:07
 * 用户足迹表
 */


const { INTEGER } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const footprint = sequelize.define(
    tablePrefix + "footprint",
    {
      id: {
        type: INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },

      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      goods_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "用户查看过的货物id"
      },

      add_time: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "footprint",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "92"
    }
  );
  return footprint;
};
