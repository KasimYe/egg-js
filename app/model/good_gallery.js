/*
 * @Author: qiao
 * @Date: 2018-07-11 16:03:07
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 16:23:08
 * 货物banner图
 */


const { INTEGER, STRING } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const goodGallery = sequelize.define(
    "goods_gallery",
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

      img_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      img_desc: {
        type: STRING(255),
        allowNull: false,
        defaultValue: 5
      },

      sort_order: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 5
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "goods_gallery",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "681",
      indexes: [{ name: "goods_id", fields: ["goods_id"] }]
    }
  );

  return goodGallery;
};
