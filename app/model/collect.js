/*
 * @Author: qiao
 * @Date: 2018-07-11 17:04:06
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 19:32:34
 * 用户收藏表
 */


const { MEDIUMINT, INTEGER, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const collect = sequelize.define(
    "collect",
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

      value_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "货物id"
      },

      add_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      is_attention: {
        type: TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: "是否是收藏，这个关键字应该无用"
      },

      type_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "collect",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "55",
      indexes: [
        { name: "user_id", fields: ["user_id"] },
        { name: "goods_id", fields: ["value_id"] },
        { name: "is_attention", fields: ["is_attention"] }
      ]
    }
  );

  return collect;
};
