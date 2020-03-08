/*
 * @Author: qiao
 * @Date: 2018-07-01 18:43:58
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-10 20:44:07
 * 商品分类表
 */

const { INTEGER, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const category = sequelize.define(
    "category",
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: STRING(90),
        allowNull: false,
        defaultValue: ""
      },

      keywords: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      front_desc: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      parent_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      // 这个为什么是TINYINT,但是默认值是50
      sort_order: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: "50"
      },

      show_index: {
        type: TINYINT,
        allowNull: false,
        defaultValue: 0
      },

      is_show: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      },

      banner_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      icon_url: {
        type: STRING(255),
        allowNull: false
      },

      img_url: {
        type: STRING(255),
        allowNull: false
      },

      wap_banner_url: {
        type: STRING(255),
        allowNull: false
      },

      level: {
        type: STRING(255),
        allowNull: false
      },

      type: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      front_name: {
        type: STRING(255),
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "category",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "1036008",
      indexes: [
        {
          name: "parent_id",
          fields: ["parent_id"]
        }
      ]
    }
  );
  return category;
};
