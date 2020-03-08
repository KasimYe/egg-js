/*
 * @Author: qiao
 * @Date: 2018-07-01 14:46:28
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 21:36:02
 * 广告位置表
 */

const { SMALLINT, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const adPosition = sequelize.define(
    "ad_position",
    {
      id: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: STRING(60),
        allowNull: false,
        defaultValue: ""
      },

      width: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      height: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      desc: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "ad_position",
      timestamps: false,
      initialAutoIncrement: "2",
      charset: "utf8mb4"
    }
  );

  return adPosition;
};
