/*
 * @Author: qiao
 * @Date: 2018-07-01 09:41:41
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-14 18:08:48
 * 货物表
 */

const {
  INTEGER,
  STRING,
  DECIMAL,
  TINYINT,
  MEDIUMINT,
  TEXT,
  SMALLINT
} = require("sequelize");

module.exports = app => {
  const sequelize = app.model;
  const tablePrefix = app.config.tablePrefix;

  // TODO: mysql里面这张表定义ENGINE，这里没有定义
  const good = sequelize.define(
    "good",
    {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true
      },

      category_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "货物所属分类id"
      },

      goods_sn: {
        type: STRING(60),
        allowNull: false,
        defaultValue: "",
        comment: "??"
      },

      name: {
        type: STRING(120),
        allowNull: false,
        defaultValue: ""
      },

      brand_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      goods_number: {
        type: MEDIUMINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      keywords: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      goods_brief: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },

      goods_desc: {
        type: TEXT,
        comment: "货物描述，都是一些图片链接"
      },

      is_on_sale: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        comment: "货物是否正在上架：1 正在上架，0 已下架"
      },

      add_time: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "货物添加时间"
      },

      sort_order: {
        type: SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 100,
        comment: "???"
      },

      is_delete: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "是否被删除：0 没有被删除， 1被删除"
      },

      attribute_category: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "属性分类？？"
      },

      counter_price: {
        type: DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "专柜价格"
      },

      extra_price: {
        type: DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "附加价格"
      },

      is_new: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "是否新品上架： ？？"
      },

      goods_unit: {
        type: STRING(45),
        allowNull: false,
        comment: "商品单位"
      },

      primary_pic_url: {
        type: STRING(255),
        allowNull: false,
        comment: "商品主图"
      },

      list_pic_url: {
        type: STRING(255),
        allowNull: false,
        comment: "商品列表图"
      },

      retail_price: {
        type: DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "零售价格"
      },

      sell_volume: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "销售量"
      },

      primary_product_id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "主sku　product_id"
      },

      unit_price: {
        type: DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "单位价格，单价"
      },

      promotion_desc: {
        type: STRING(255),
        allowNull: false,
        comment: "促销描述"
      },

      promotion_tag: {
        type: STRING(45),
        allowNull: false,
        comment: "促销标签"
      },

      app_exclusive_price: {
        type: DECIMAL(10, 2).UNSIGNED,
        allowNull: false,
        comment: "APP专享价"
      },

      is_app_exclusive: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        comment: "是否是APP专属"
      },

      is_limited: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        comment: "？？？"
      },

      is_hot: {
        type: TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: "是否正在热卖？？？"
      }
    },
    {
      freezeTableName: true,
      tableName: tablePrefix + "goods",
      charset: "utf8mb4",
      timestamps: false,
      // 创建索引
      indexes: [
        {
          name: "goods_sn",
          fields: ["goods_sn"]
        },
        {
          name: "cat_id",
          fields: ["category_id"]
        },
        {
          name: "brand_id",
          fields: ["brand_id"]
        },
        {
          name: "goods_number",
          fields: ["goods_number"]
        },
        {
          name: "sort_order",
          fields: ["sort_order"]
        }
      ]
    }
  );

  return good;
};
