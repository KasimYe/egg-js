/*
 * @Author: qiao
 * @Date: 2018-07-11 16:47:05
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 16:59:32
 * 货物常见问题
 */


const { INTEGER, STRING, TEXT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const goodIssue = sequelize.define(
    "goods_issue",
    {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      goods_id: {
        type: TEXT
      },

      question: {
        type: STRING(255),
        defaultValue: null
      },

      answer: {
        type: STRING(45),
        defaultValue: null
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "goods_issue",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "5"
    }
  );

  return goodIssue;
};
