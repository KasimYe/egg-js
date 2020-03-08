/*
 * @Author: qiao
 * @Date: 2018-07-01 18:22:07
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 16:45:42
 */

const { DECIMAL, INTEGER, STRING, TEXT, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const topic = sequelize.define(
    "topic",
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      title: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      content: {
        type: TEXT
      },

      avatar: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      item_pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      subtitle: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      topic_category_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      price_info: {
        type: DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      read_count: {
        type: STRING(255),
        allowNull: false,
        defaultValue: 0
      },

      scene_pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      topic_template_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      topic_tag_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      sort_order: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 100
      },

      is_show: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "topic",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "316"
    }
  );

  return topic;
};
