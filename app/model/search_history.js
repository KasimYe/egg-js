/*
 * @Author: qiao
 * @Date: 2018-07-11 11:24:22
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-15 20:15:05
 * 搜索历史表
 */


const { INTEGER, STRING, MEDIUMINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const searchHistory = sequelize.define(
    "search_history",
    {
      id: {
        type: INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },

      keyword: {
        type: STRING(50),
        allowNull: false
      },

      from: {
        type: STRING(45),
        allowNull: false,
        defaultValue: "",
        comment: "搜索来源，如PC、小程序、APP等"
      },

      add_time: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "搜索时间"
      },

      user_id: {
        type: MEDIUMINT.UNSIGNED,
        defaultValue: null
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "search_history",
      timestamps: false,
      charset: "utf8mb4"
    }
  );

  return searchHistory;
};
