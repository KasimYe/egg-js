/*
 * @Author: qiao
 * @Date: 2018-07-12 11:55:46
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-14 15:23:41
 * 具体商品表
 */


const { MEDIUMINT, DECIMAL, STRING } = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  const product = sequelize.define(
    "product",
    {
      id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      goods_id: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      goods_specification_ids: {
        type: STRING(50),
        allowNull: false,
        defaultValue: "",
        comment: "货物的规格id，多个使用_作为连接符"
      },

      goods_sn: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        comment: "货物sn号码"
      },

      goods_number: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "货物数量"
      },

      retail_price: {
        type: DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "零售价格"
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "product",
      timestamps: false,
      charset: "utf8mb4",
      initialAutoIncrement: "245"
    }
  );

  return product;
};
