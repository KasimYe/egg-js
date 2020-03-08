/*
 * @Author: qiao
 * @Date: 2018-07-23 11:08:08
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 11:34:26
 * 订单货物表
 */


const { MEDIUMINT, TEXT, DECIMAL, SMALLINT, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const orderGoods = sequelize.define(
    "order_good",
    {
      id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      order_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "订单id"
      },

      goods_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "货物id"
      },

      goods_name: {
        type: STRING(120),
        allowNull: false,
        defaultValue: ""
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

      number: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      },

      market_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      retail_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      goods_specifition_name_value: {
        type: TEXT,
        allowNull: false
      },

      is_real: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      goods_specifition_ids: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      list_pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "order_goods",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "24",
      indexes: [
        { name: "order_id", fields: ["order_id"] },
        { name: "goods_id", fields: ["goods_id"] }
      ]
    }
  );

  return orderGoods;
};
