/*
 * @Author: qiao
 * @Date: 2018-07-11 18:21:54
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 18:48:00
 * 商品特性表
 */


const { INTEGER, STRING, TEXT, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const attribute = sequelize.define(
    "attribute",
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      attribute_category_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      name: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        comment: "属性名称"
      },

      input_type: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      },

      values: {
        type: TEXT,
        allowNull: false
      },

      sort_order: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: "0"
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "attribute",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "103",
      indexes: [{ name: "cat_id", fields: ["attribute_category_id"] }]
    }
  );

  return attribute;
};
