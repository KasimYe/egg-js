const BaseService = require("../base");
const { StatusError } = require("../../entity/status_error");
const { Op } = require("sequelize");

class CartService extends BaseService {
  constructor(app) {
    super("Cart", app);
  }

  async count() {
    return (await this.getCart()).cartTotal.goodsCount;
  }

  async getCart() {
    // NOTE: 需要做会话控制：如果会话不存在，则写死userid为1
    const { model, jwtSession = { user_id: 1 } } = this.ctx;
    const cartList =
      (await model.Cart.findAll({
        where: { user_id: jwtSession.user_id },
        raw: true
      })) || [];

    // 购物车统计信息
    // 购车中中货物总数
    let goodsCount = 0;
    // 购物车中零售价总价
    let goodsAmount = 0.0;
    let checkedGoodsCount = 0;
    let checkedGoodsAmount = 0.0;

    for (const cartItem of cartList) {
      goodsCount += cartItem.number;
      goodsAmount += cartItem.number * cartItem.retail_price;
      if (cartItem.checked) {
        checkedGoodsCount += cartItem.number;
        checkedGoodsAmount += cartItem.number * cartItem.retail_price;
      }

      // NOTE: 已经有商品图片了，源码这里为什么还要查找商品的图片？？
      // cartItem.list_pic_url = await model.Good.find({
      //   where: { id: cartItem.goods_id },
      //   attributes: ['list_pic_url'],
      //   raw: true,
      // }).then(res => res.list_pic_url);
    }

    return {
      cartList,
      cartTotal: {
        goodsCount,
        goodsAmount,
        checkedGoodsCount,
        checkedGoodsAmount
      }
    };
  }
  /**
   * @description 检查商品是否下架
   * @param {number} goodsId
   * @memberof CartServ
   * @throws {StatusError}
   */
  async checkGoodsOnSale(goodsId) {
    const sapi = this.ctx.service.api;
    const goodsInfo = await sapi.good.one(goodsId);
    // 判断商品是否可以购买
    if (!goodsInfo || goodsInfo.is_delete === 1) {
      throw new StatusError("商品已下架", StatusError.ERROR_STATUS.DATA_ERROR);
    }
    return goodsInfo;
  }
  /**
   * @description 添加货物到购物车
   * @param {number} goodsId
   * @param {number} productId
   * @param {number} number
   * @memberof CartServ
   */
  async add(goodsId, productId, number) {
    const { jwtSession = { user_id: 1 } } = this.ctx;
    const goodsInfo = await this.checkGoodsOnSale(goodsId);
    console.log("jwtSession:", jwtSession);
    await this.addGoods(
      jwtSession.user_id,
      goodsId,
      productId,
      number,
      goodsInfo
    );
  }
  /**
   * @description 向购物车里面添加货物
   * @param {number} userId 用户id
   * @param {number} goodsId 货物id
   * @param {number} productId 产品id
   * @param {number} number 要向购物车增加的货物数量
   */
  addGoods = async (userId, goodsId, productId, number, goodsInfo) => {
    const sapi = this.ctx.service.api;
    // 查询货物规格信息，判断是否有足够的存货
    const productInfo = await sapi.product.find({
      goods_id: goodsId,
      id: productId
    });

    if (!productInfo || productInfo.goods_number < number) {
      throw new StatusError("库存不足", StatusError.ERROR_STATUS.DATA_ERROR);
    }
    // 判断是否已经在购物车上
    const cartInfo = await this.find({
      goods_id: goodsId,
      product_id: productId
    });
    if (cartInfo) {
      // 商品已经存在购物车上，直接更新购物车
      await this.update(
        { goods_id: goodsId, product_id: productId, id: cartInfo.id },
        {
          number: cartInfo.number + number
        }
      );
    } else {
      // 商品不在购物车上，查询添加规格名和值
      const goodsSepcifitionValue = await sapi.goodSpecification
        .list(
          {
            goods_id: goodsId,
            id: { [Op.in]: productInfo.goods_specification_ids.split("_") }
          },
          0,
          0,
          [],
          ["value"]
        )
        .then(res => res.map(inst => inst.value));
      // 添加到购物车
      const cartData = {
        goods_id: goodsId,
        product_id: productId,
        goods_sn: productInfo.goods_sn,
        goods_name: goodsInfo.name,
        list_pic_url: goodsInfo.list_pic_url,
        number,
        // NOTE: 这里的session_id 写死了等于1，以后要改进
        session_id: "1",
        user_id: userId,
        retail_price: productInfo.retail_price,
        market_price: productInfo.retail_price,
        goods_specifition_name_value: goodsSepcifitionValue.join(";"),
        goods_specifition_ids: productInfo.goods_specification_ids,
        checked: 1
      };
      console.log("cartData:", cartData);
      await this.insertOrUpdate(cartData);
    }
  };

  updateGoods = async (goodsId, productId, number, cartId) => {
    // 查询货物规格信息，判断是否有足够的存货
    const productInfo = await app.model.Product.find({
      where: { goods_id: goodsId, id: productId },
      raw: true
    });
    if (!productInfo || productInfo.goods_number < number) {
      throw new StatusError("库存不足", StatusError.ERROR_STATUS.DATA_ERROR);
    }
    // NOTE: 原工程的逻辑比这里复杂，但是不明白什么意思
    // 查找到购物车商品更新数量
    await app.model.Cart.update(
      {
        number
      },
      {
        where: { id: cartId }
      }
    );
  };
}
module.exports = CartService;
