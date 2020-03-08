/*
 * @Author: qiao
 * @Date: 2018-07-16 11:42:39
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-16 11:52:55
 * 用户优惠券表
 */


const { MEDIUMINT, INTEGER, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const userCoupon = sequelize.define(
    "user_coupon",
    {
      id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      coupon_id: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      coupon_number: {
        type: STRING(20),
        allowNull: false,
        defaultValue: ""
      },

      user_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      used_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      order_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "user_coupon",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "32",
      indexes: [{ name: "user_id", fields: ["user_id"] }]
    }
  );

  return userCoupon;
};
