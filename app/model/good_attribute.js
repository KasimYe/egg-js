/*
 * @Author: qiao
 * @Date: 2018-07-11 16:33:17
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 16:45:55
 * 商品属性
 */


const { INTEGER, TEXT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const goodAttribute = sequelize.define(
    "goods_attribute",
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

      attribute_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      value: {
        type: TEXT,
        allowNull: false,
        comment: "货物属性描述"
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "goods_attribute",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "872",
      indexes: [
        { name: "goods_id", fields: ["goods_id"] },
        { name: "attr_id", fields: ["attribute_id"] }
      ]
    }
  );

  return goodAttribute;
};
