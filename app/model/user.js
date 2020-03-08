/*
 * @Author: qiao
 * @Date: 2018-07-09 15:30:02
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-15 19:10:58
 * 用户表
 */

const { MEDIUMINT, STRING, TINYINT, INTEGER } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const user = sequelize.define(
    "user",
    {
      id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      username: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        unique: true
      },

      password: {
        type: STRING(32),
        allowNull: false,
        defaultValue: ""
      },

      gender: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      birthday: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      register_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      last_login_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      last_login_ip: {
        type: STRING(15),
        allowNull: false,
        defaultValue: ""
      },

      user_level_id: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      nickname: {
        type: STRING(60),
        allowNull: false
      },

      mobile: {
        type: STRING(20),
        allowNull: false
      },

      register_ip: {
        type: STRING(45),
        allowNull: false,
        defaultValue: ""
      },

      avatar: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      weixin_openid: {
        type: STRING(50),
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "user",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "14"
    }
  );

  return user;
};
