/*
 * @Author: qiao
 * @Date: 2018-07-01 14:20:25
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 12:03:22
 * 广告表
 */

const { INTEGER, SMALLINT, STRING, TEXT, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const ad = sequelize.define(
    "ad",
    {
      id: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      ad_position_id: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "广告位置id"
      },

      media_type: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      name: {
        type: STRING(60),
        allowNull: false,
        defaultValue: ""
      },

      link: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      image_url: {
        type: TEXT,
        allowNull: false
      },

      content: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      end_time: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      enabled: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "ad",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "4",
      indexes: [
        {
          name: "position_id",
          fields: ["ad_position_id"]
        },
        {
          name: "enabled",
          fields: ["enabled"]
        }
      ]
    }
  );

  return ad;
};
