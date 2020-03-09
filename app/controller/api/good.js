const Controller = require("egg").Controller;

class GoodController extends Controller {
  /**
   * @description 计算在售商品数
   * @memberof GoodCtrl
   */
  async count() {
    const goodsCount = await this.service.api.good.count();

    this.ctx.response.body = {
      goodsCount
    };
  }

  /**
   * @description 获取分类下的商品
   * @memberof GoodCtrl
   */
  async category() {
    const { helper, request, service, response } = this.ctx;
    const { id } = helper.validateParams(
      {
        id: { type: "numberString", field: "id" }
      },
      request.query,
      this.ctx
    );

    response.body = await service.api.good.category(id);
  }

  /**
   * @description 搜索货物列表
   * @memberof GoodCtrl
   */
  async list() {
    const { helper, request, service, response, jwtSession } = this.ctx;
    const {
      categoryId = 0,
      keyword = null,
      brandId = null,
      isNew = null,
      isHot = null,
      page,
      size = 20,
      sort = "desc",
      order
    } = helper.validateParams(
      {
        categoryId: {
          type: "numberString",
          field: "categoryId",
          required: false
        },
        keyword: { type: "string", required: false },
        brandId: { type: "numberString", field: "brandId", required: false },
        isNew: { type: "numberString", field: "isNew", required: false },
        isHot: { type: "numberString", field: "isHot", required: false },
        page: { type: "numberString", field: "page" },
        size: { type: "numberString", field: "size", required: false },
        sort: { type: "string", required: false }
      },
      request.query,
      this.ctx
    );

    response.body = await service.api.good.listByCategory(
      keyword,
      page,
      size,
      sort,
      order,
      categoryId,
      brandId,
      isNew,
      isHot
    );
  }

  /**
   * @description 查找货物详情
   * @memberof GoodCtrl
   */
  async detail() {
    const { helper, request, service, response } = this.ctx;
    const { id: goodId } = helper.validateParams(
      {
        id: { type: "numberString", field: "id" }
      },
      request.query,
      this.ctx
    );   

    response.body = await service.api.good.detail(goodId);
  }

  /**
   * @description 相关货物列表
   * @memberof GoodCtrl
   */
  async relate() {
    const { helper, request, model, response } = this.ctx;
    const { id: goodId } = helper.validateParams(
      {
        id: { type: "numberString", field: "id" }
      },
      request.query,
      this.ctx
    );

    // 查找相关货物id
    const relatedGoodIds = await model.RelatedGood.findAll({
      where: { id: goodId },
      attributes: ["related_goods_id"],
      raw: true
    });

    let relatedGoods = null;
    if (relatedGoodIds && relatedGoodIds.length > 0) {
      // 根据相关id查找相关货物
      relatedGoods = await model.Good.findAll({
        where: { id: { [Op.in]: relatedGoodIds } },
        attributes: ["id", "name", "list_pic_url", "retail_price"],
        raw: true
      });
    } else {
      // 没有相关货物id，查找同种类的货物
      const goodInfo = await model.Good.find({
        where: { id: goodId },
        raw: true
      });
      relatedGoods = await model.Good.findAll({
        where: { category_id: goodInfo.category_id },
        attributes: ["id", "name", "list_pic_url", "retail_price"],
        limit: 8,
        raw: true
      });
    }

    response.body = {
      goodsList: relatedGoods
    };
  }
}

module.exports = GoodController;
