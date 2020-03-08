/*
 * @Author: qiao
 * @Date: 2018-07-01 15:13:10
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 16:18:53
 */

const { INTEGER, STRING } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const channel = sequelize.define(
    "channel",
    {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: STRING(45),
        allowNull: false,
        defaultValue: ""
      },

      url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      icon_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      sort_order: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: "10"
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "channel",
      timestamps: false,
      initialAutoIncrement: "6",
      charset: "utf8mb4"
    }
  );

  return channel;
};
