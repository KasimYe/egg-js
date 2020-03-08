/*
 * @Author: qiao
 * @Date: 2018-07-04 09:54:34
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-04 11:02:16
 * 评论图片表
 */


const { INTEGER, STRING, TINYINT } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const commentPicture = sequelize.define(
    "comment_picture",
    {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      comment_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      sort_order: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 5
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "comment_picture",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "1121"
    }
  );

  return commentPicture;
};
