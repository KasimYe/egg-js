/*
 * @Author: qiao
 * @Date: 2018-07-01 13:13:34
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 14:09:51
 * 新闻表
 */

const { INTEGER, STRING, TEXT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  // TODO: mysql里面定义了ENGINE，这里没有定义
  const news = sequelize.define(
    "news",
    {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      title: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      content: {
        type: TEXT,
        comment: "文章内容"
      },

      add_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "文章添加时间"
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "news",
      timestamps: false,
      charset: "utf8mb4"
    }
  );

  return news;
};
