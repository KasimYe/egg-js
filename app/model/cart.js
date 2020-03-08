/*
 * @Author: qiao
 * @Date: 2018-07-15 21:11:27
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 15:39:59
 * 购物车表
 */

const {
  MEDIUMINT,
  SMALLINT,
  DECIMAL,
  STRING,
  TEXT,
  TINYINT
} = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const cart = sequelize.define(
    "cart",
    {
      id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      // NOTE: 目前没有用，所有插入的值都被设置为1
      session_id: {
        type: STRING(32),
        allowNull: false,
        defaultValue: "",
        comment: "记录添加到购物车的sessionid。"
      },

      goods_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      goods_sn: {
        type: STRING(60),
        allowNull: false,
        defaultValue: ""
      },

      product_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      goods_name: {
        type: STRING(120),
        allowNull: false,
        defaultValue: ""
      },

      market_price: {
        type: DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      retail_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      number: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      goods_specifition_name_value: {
        type: TEXT,
        allowNull: false,
        comment: "规格属性组成的字符串，用来显示用"
      },

      goods_specifition_ids: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        comment: "product表对应的goods_specifition_ids"
      },

      checked: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        comment: "1代表在购物车中被选中需要结算，0代表没有被选中"
      },

      list_pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "cart",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "97",
      collate: "utf8mb4_bin"
    }
  );

  return cart;
};
