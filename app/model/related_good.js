/*
 * @Author: qiao
 * @Date: 2018-07-14 19:18:39
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-14 19:28:08
 * 相关货物表
 */

const { INTEGER } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const relatedGood = sequelize.define(
    "related_good",
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      goods_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      related_goods_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "related_goods",
      timestamps: false,
      charset: "utf8mb4"
    }
  );

  return relatedGood;
};
