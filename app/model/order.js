/*
 * @Author: qiao
 * @Date: 2018-07-21 16:46:02
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-23 17:46:41
 * 订单表
 */

const {
  MEDIUMINT,
  INTEGER,
  DECIMAL,
  SMALLINT,
  STRING,
  BOOLEAN,
  TINYINT
} = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const order = sequelize.define(
    "order",
    {
      id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      order_sn: {
        type: STRING(20),
        allowNull: false,
        defaultValue: "",
        unique: true
      },

      user_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      order_status: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "订单状态，0为未支付"
      },

      shipping_status: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      pay_status: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "支付状态"
      },

      consignee: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        comment: "收货地址"
      },

      country: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      province: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "收货省份id"
      },

      city: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "收货城市"
      },

      district: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: ""
      },

      address: {
        type: STRING(255),
        allowNull: false,
        defaultValue: "",
        comment: "收货详细地址"
      },

      mobile: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        comment: "收货手机"
      },

      postscript: {
        type: STRING(255),
        allowNull: false,
        defaultValue: 0,
        comment: "订单留言"
      },

      shipping_fee: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      pay_name: {
        type: STRING(120),
        allowNull: false,
        defaultValue: ""
      },

      pay_id: {
        type: TINYINT,
        allowNull: false,
        defaultValue: 0
      },

      actual_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "实际需要支付的金额"
      },

      integral: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      integral_money: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      order_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "订单总价"
      },

      goods_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "商品总价"
      },

      add_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      confirm_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      pay_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      freight_price: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "配送费用"
      },

      coupon_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "使用的优惠券id"
      },

      parent_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      coupon_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "优惠价格"
      },

      callback_status: {
        type: BOOLEAN,
        defaultValue: true
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "order",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "15",
      indexes: [
        { name: "user_id", fields: ["user_id"] },
        { name: "order_status", fields: ["order_status"] },
        { name: "shipping_status", fields: ["shipping_status"] },
        { name: "pay_status", fields: ["pay_status"] },
        { name: "pay_id", fields: ["pay_id"] }
      ]
    }
  );

  return order;
};
