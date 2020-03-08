/*
 * @Author: qiao
 * @Date: 2018-07-11 19:52:36
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-11 20:35:07
 * 商品对应规格表值表
 */


const { INTEGER, STRING } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const specification = sequelize.define(
    "goods_specification",
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      goods_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      specification_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "货物规格id，可以去规格表中查询"
      },

      value: {
        type: STRING(50),
        allowNull: false,
        defaultValue: "",
        comment: "货物规格描述"
      },

      pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "goods_specification",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "6",
      indexes: [
        { name: "goods_id", fields: ["goods_id"] },
        { name: "specification_id", fields: ["specification_id"] }
      ]
    }
  );

  return specification;
};
