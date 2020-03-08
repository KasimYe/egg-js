/*
 * @Author: qiao
 * @Date: 2018-07-01 13:13:34
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-02 14:09:51
 * 品牌表
 */


const { DECIMAL, INTEGER, STRING, TINYINT } =require( "sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  // TODO: mysql里面定义了ENGINE，这里没有定义
  const brand = sequelize.define(
    "brand",
    {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      list_pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      simple_desc: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      sort_order: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 50
      },

      is_show: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        comment: "是否显示： 1 显示， 0不显示"
        // index: true,
      },

      floor_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      app_list_pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      is_new: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "是否是新品牌？？"
      },

      new_pic_url: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      new_sort_order: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 10
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "brand",
      timestamps: false,
      charset: "utf8mb4",
      // 设置增长初始值
      initialAutoIncrement: "1046012",
      indexes: [
        {
          name: "is_show",
          fields: ["is_show"]
        }
      ]
    }
  );

  return brand;
};
