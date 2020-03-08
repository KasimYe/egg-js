const { Service } = require("egg");
const { Op } = require("sequelize");
class IndexService extends Service {
  async index() {
    const { service } = this.ctx;
    const banner = await service.api.ad.list({ ad_position_id: 1 }, 1, 10);
    const channel = await service.api.channel.list({}, 1, 10, [
      ["sort_order", "ASC"]
    ]);
    const newGoods = await service.api.good.list(
      { is_on_sale: 1, is_new: 1 },
      1,
      4,
      [["sort_order", "ASC"]],
      ["id", "name", "list_pic_url", "retail_price"]
    );
    const hotGoods = await service.api.good.list(
      { is_on_sale: 1, is_hot: 1 },
      1,
      3,
      [["sort_order", "ASC"]],
      ["id", "name", "list_pic_url", "retail_price", "goods_brief"]
    );
    const brandList = await service.api.brand.list({ is_new: 1 }, 1, 4, [
      ["new_sort_order", "ASC"]
    ]);
    const topicList = await service.api.topic.list({ is_show: 1 }, 1, 3);
    const categoryList = await service.api.category.list({
      parent_id: 0,
      name: { [Op.not]: "推荐" }
    });

    const newCategoryList = [];
    for (const categoryItem of categoryList) {
      const childCategoryIds = await service.api.category.list(
        { parent_id: categoryItem.id },
        1,
        100,
        [],
        ["id"]
      );
      const categoryGoods = await service.api.good.list(
        {
          is_on_sale: 1,
          category_id: { [Op.in]: childCategoryIds.map(result => result.id) }
        },
        1,
        7,
        [],
        ["id", "name", "list_pic_url", "retail_price"]
      );

      newCategoryList.push({
        id: categoryItem.id,
        name: categoryItem.name,
        goodsList: categoryGoods
      });
    }

    return {
      banner: banner,
      channel: channel,
      newGoodsList: newGoods,
      hotGoodsList: hotGoods,
      brandList: brandList,
      topicList: topicList,
      categoryList: newCategoryList
    };
  }
}

module.exports = IndexService;
