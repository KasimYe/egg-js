const BaseService = require("../base");
const { StatusError } = require("../../entity/status_error");
const { Op } = require("sequelize");
const _ = require("lodash");

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
      goodsCount += Number(cartItem.number);
      goodsAmount += Number(cartItem.number) * Number(cartItem.retail_price);
      if (cartItem.checked) {
        checkedGoodsCount += Number(cartItem.number);
        checkedGoodsAmount +=
          Number(cartItem.number) * Number(cartItem.retail_price);
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
        goodsCount: _.ceil(goodsCount, 2),
        goodsAmount: _.ceil(goodsAmount, 2),
        checkedGoodsCount: _.ceil(checkedGoodsCount, 2),
        checkedGoodsAmount: _.ceil(checkedGoodsAmount, 2)
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
    if (!goodsInfo || goodsInfo.is_delete === 1 || goodsInfo.is_on_sale === 0) {
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
      await this.save(cartData);
    }
  };

  updateGoods = async (goodsId, productId, number, cartId) => {
    const sapi = this.service.api;
    // 查询货物规格信息，判断是否有足够的存货
    const productInfo = await sapi.product.find({
      goods_id: goodsId,
      id: productId
    });
    if (!productInfo || productInfo.goods_number < number) {
      throw new StatusError("库存不足", StatusError.ERROR_STATUS.DATA_ERROR);
    }
    // NOTE: 原工程的逻辑比这里复杂，但是不明白什么意思
    // 查找到购物车商品更新数量
    await this.updateById(cartId, { number });
  };

  /**
   * @description 更新购物车货物数量
   * @param {number} goodsId
   * @param {number} productId
   * @param {number} cartId
   * @param {number} number
   * @memberof CartServ
   */
  async updateCart(goodsId, productId, cartId, number) {
    await this.checkGoodsOnSale(goodsId);
    await this.updateGoods(goodsId, productId, number, cartId);
  }

  async checkout(addressId) {
    const { service, jwtSession = { user_id: 1 } } = this.ctx;

    // 查询使用地址
    const whereObj = {
      user_id: jwtSession.user_id
    };
    addressId > 0 ? (whereObj.id = addressId) : (whereObj.is_default = 1);
    const checkedAddress = await service.api.address.find(whereObj);

    // NOTE: 根据收货地址计算运费，暂时没有实现
    let freightPrice = 0.0;

    if (checkedAddress) {
      const [provinceName, cityName, districtName] = await Promise.all([
        service.api.region.getRegionName(checkedAddress.province_id),
        service.api.region.getRegionName(checkedAddress.city_id),
        service.api.region.getRegionName(checkedAddress.district_id)
      ]);
      checkedAddress["province_name"] = provinceName;
      checkedAddress["city_name"] = cityName;
      checkedAddress["district_name"] = districtName;
      checkedAddress["full_region"] = provinceName + cityName + districtName;

      freightPrice = await service.api.region.getFreightPrice(
        checkedAddress.district_id
      );
    }

    // 获取要购买的商品，checked===1才是需要购买的商品
    const cartData = await this.getCart();
    const checkedGoodsList = cartData.cartList.filter(v => {
      return v.checked === 1;
    });

    // 获取可用的优惠券信息，功能还未实现
    const couponList = await service.api.userCoupon.list({
      user_id: jwtSession.user_id,
      coupon_number: { [Op.gt]: 0 }
    });
    // 优惠券减免的金额
    const couponPrice = 0;

    // 计算订单费用
    const goodsTotalPrice = cartData.cartTotal.checkedGoodsAmount;
    const orderTotalPrice =
      Number(cartData.cartTotal.checkedGoodsAmount) +
      Number(freightPrice) -
      Number(couponPrice); // 订单的总价
    const actualPrice = Number(orderTotalPrice) - 0.0; // 减去其它支付的金额后，要实际支付的金额

    return {
      checkedAddress,
      freightPrice,
      checkedCoupon: {},
      couponList,
      couponPrice,
      checkedGoodsList,
      goodsTotalPrice,
      orderTotalPrice,
      actualPrice
    };
  }
}
module.exports = CartService;
