const BaseService = require("../base");
const moment = require("moment");
const { StatusError } = require("../../entity/status_error");

class OrderService extends BaseService {
  constructor(app) {
    super("Order", app);
  }

  /**
   * @description 产生订单号
   */
  generateOrderNumber = () => {
    // const date = new Date();
    const a = moment().format("YYYYMMDDHHmmss");
    const sn = a + Math.ceil(Math.random() * 1000000);
    return sn;
  };

  /**
   * @description 下订单
   * @param {IOrderAttr} orderInfo 订单信息
   * @param {ICartInst[]} checkedGoodsList 需要加入订单的货物列表
   * @returns {IOrderAttr} newOrderInfo 新订单信息
   */
  async addOrder(orderInfo, checkedGoodsList) {
    const model = this.app.model;
    const sapi = this.service.api;
    let newOrderInfo;
    await model.transaction(async t => {
      // 在此处开启自动托管事务 NOTE: 其实这些地方有必要开启事务吗，其实没有必要开启事务，
      // 只有提交订单，真正减去货物的时候才要开启事务

      // 先检查有没有足够的存货，一次性全查出来，然后在内存里面匹配
      const products = await Promise.all(
        checkedGoodsList.map(async checkedGood => {
          const product = await sapi.product.find(
            { goods_id: checkedGood.goods_id, id: checkedGood.product_id },
            [],
            true,
            t
          );

          if (!product || product.goods_number < checkedGood.number) {
            throw new StatusError(
              checkedGood.goods_name + "库存不足",
              StatusError.ERROR_STATUS.DATA_ERROR
            );
          }
          return product;
        })
      );

      // 插入订单信息
      newOrderInfo = await this.save(orderInfo, true, t);
      
      // 插入订单商品表
      const orderGoodsData = [];
      checkedGoodsList.forEach(checkedGood => {
        const item = {
          order_id: newOrderInfo.id,
          goods_id: checkedGood.goods_id,
          goods_sn: checkedGood.goods_sn,
          product_id: checkedGood.product_id,
          goods_name: checkedGood.goods_name,
          list_pic_url: checkedGood.list_pic_url,
          market_price: checkedGood.market_price,
          retail_price: checkedGood.retail_price,
          number: checkedGood.number,
          goods_specifition_name_value:
            checkedGood.goods_specifition_name_value,
          goods_specifition_ids: checkedGood.goods_specifition_ids
        };
        orderGoodsData.push(item);
      });
      const addOrderGood = await sapi.orderGood.saveMany(
        orderGoodsData,
        true,
        t
      );
      
      // 清除购物车
      const clearCart = await sapi.cart.delete(
        { user_id: newOrderInfo.user_id, checked: 1 },
        true,
        t
      );
      
      // 减少相应库存
      let updateProducts = [];
      for (const product of products) {
        let good;
        for (const checkedGood of checkedGoodsList) {
          if (product.id === checkedGood.product_id) {
            good = checkedGood;
            break;
          }
        }
        const updateProduct = await sapi.product.update(
          { goods_id: good.goods_id, id: good.product_id },
          { goods_number: product.goods_number - good.number },
          true,
          t
        );
        updateProducts.push(updateProduct);
      }
      
      await Promise.all([addOrderGood, clearCart, ...updateProducts]);
    });
    
    return newOrderInfo.toJSON();
  }

  /**
   * @description 获取订单状态 NOTE: 现在还只有未支付状态，没有其他状态
   * @param {number} orderId 订单id
   * @returns {string} statusText 订单状态
   */
  getOrderStatusText = async orderId => {
    const orderInfo = await this.one(orderId);

    let statusText = "未付款";
    switch (orderInfo.order_status) {
      case 0:
        statusText = "未付款";
        break;
      case 101:
        statusText = "已取消";
        break;
      case 102:
        statusText = "已删除";
        break;
      case 201:
        statusText = "已付款";
        break;
      case 300:
        statusText = "已开单";
        break;
      case 301:
        statusText = "已揽件";
        break;
      case 302:
        statusText = "已收货";
        break;
      case 402:
        statusText = "已退款";
        break;
    }
    return statusText;
  };

  /**
   * @description 获取订单可操作选项
   * @param {number} orderId 订单id
   * @returns {IhandleOption} 可操作选项
   */
  getOrderHandleOption = async orderId => {
    const handleOption = {
      cancel: false, // 取消操作
      delete: false, // 删除操作
      pay: false, // 支付操作
      comment: false, // 评论操作
      delivery: false, // 确认收货操作
      confirm: false, // 完成订单操作
      return: false, // 退换货操作
      buy: false // 再次购买
    };

    const orderInfo = await this.one(orderId);

    // 订单流程：下单成功－》支付订单－》发货－》收货－》评论
    // 订单相关状态字段设计，采用单个字段表示全部的订单状态
    // 1xx表示订单取消和删除等状态 0订单创建成功等待付款，101订单已取消，102订单已删除
    // 2xx表示订单支付状态,201订单已付款，等待发货
    // 3xx表示订单物流相关状态,300订单已发货，301用户确认收货
    // 4xx表示订单退换货相关的状态,401没有发货，退款402,已收货，退款退货
    // 如果订单已经取消或是已完成，则可删除和再次购买

    if (orderInfo.order_status === 101) {
      handleOption.delete = true;
      handleOption.buy = true;
    }

    // 如果订单没有被取消，且没有支付，则可支付，可取消
    if (orderInfo.order_status === 0) {
      handleOption.cancel = true;
      handleOption.pay = true;
    }

    // 如果订单已付款，没有发货，则可退款操作
    if (orderInfo.order_status === 201) {
      handleOption.return = true;
    }

    // 如果订单已经发货，没有收货，则可收货操作和退款、退货操作
    if (orderInfo.order_status === 300) {
      handleOption.cancel = true;
      handleOption.pay = true;
      handleOption.return = true;
    }

    // 如果订单已经支付，且已经收货，则可完成交易、评论和再次购买
    if (orderInfo.order_status === 301) {
      handleOption.delete = true;
      handleOption.comment = true;
      handleOption.buy = true;
    }

    return handleOption;
  };

  /**
   * @description 查看用户订单列表
   * @returns
   * @memberof OrderServ
   */
  async orderList() {
    const { model, jwtSession, helper, service } = this.ctx;
    const { count, rows: orders } = await this.listAndCount({
      user_id: jwtSession.user_id
    });

    const newOrders = await Promise.all(
      orders.map(async order => {
        const goodsList = await service.api.orderGood.list({
          order_id: order.id
        });
        order["goodsList"] = goodsList;

        let goodsCount = 0;
        goodsList.forEach(good => (goodsCount += good.number));
        order["goodsCount"] = goodsCount;

        // 订单状态处理
        order["order_status_text"] = await this.getOrderStatusText(order.id);

        // 可操作的选项
        order["handleOption"] = await this.getOrderHandleOption(order.id);
        return order;
      })
    );

    return {
      count,
      totalPages: helper.pageTotal(count, 10),
      pageSize: 10,
      currentPage: 1,
      data: newOrders
    };
  }

  /**
   * @description 提交订单
   * @param {number} addressId
   * @param {number} couponId
   * @param {string} postscript
   * @returns
   * @memberof OrderServ
   */
  async submit(addressId, couponId, postscript) {
    const { model, jwtSession, service } = this.ctx;

    // 获取收货地址信息和计算运费
    const addressInfo = await service.api.address.one(addressId);
    // NOTE: 运费固定为0，运费逻辑未实现
    let freightPrice = 0.0;
    if (!addressInfo) {
      throw new StatusError(
        "请选择收货地址",
        StatusError.ERROR_STATUS.DATA_ERROR
      );
    } else {
      const freightPriceInfo = await service.api.region.one(
        addressInfo.district_id
      );
      freightPrice = freightPriceInfo.freight_price;
    }

    // 获取购物车中需要付款的商品
    const checkedGoodsList = await service.api.cart.list({
      user_id: jwtSession.user_id,
      session_id: 1,
      checked: 1
    });

    if (!checkedGoodsList || checkedGoodsList.length === 0) {
      throw new StatusError(
        "请选择商品进行结算",
        StatusError.ERROR_STATUS.DATA_ERROR
      );
    }

    // 统计商品总价
    let goodsTotalPrice = 0.0;
    checkedGoodsList.forEach(good => {
      goodsTotalPrice += good.number * good.retail_price;
    });

    // 获取订单使用的优惠券，优惠金额暂时固定为0
    const couponPrice = 0.0;
    if (couponId) {
      // 在这个地方查询优惠券以及优惠金额
    }

    // 计算订单价格
    const orderTotalPrice = goodsTotalPrice + freightPrice - couponPrice;
    const actualPrice = orderTotalPrice - 0.0; // 减去其它支付的金额后，要实际支付的金额

    const orderInfo = {
      order_sn: this.generateOrderNumber(),
      user_id: jwtSession.user_id,

      // 收货地址和运费
      consignee: addressInfo.name,
      mobile: addressInfo.mobile,
      province: addressInfo.province_id,
      city: addressInfo.city_id,
      district: addressInfo.district_id,
      address: addressInfo.address,
      freight_price: freightPrice,

      // 留言
      postscript,

      // 使用的优惠券
      coupon_id: 0,
      coupon_price: couponPrice,

      add_time: Math.floor(Date.now() / 1000),
      goods_price: goodsTotalPrice,
      order_price: orderTotalPrice,
      actual_price: actualPrice
    };

    // 开启事务，生成订单。
    const newOrderInfo = await this.addOrder(orderInfo, checkedGoodsList);

    return newOrderInfo;
  }

  /**
   * @description 订单详情
   * @param {number} orderId
   * @returns
   * @memberof OrderServ
   */
  async detail(orderId) {
    const { model, jwtSession, service } = this.ctx;
    const orderInfo = await this.find({
      user_id: jwtSession.user_id,
      id: orderId
    });

    if (!orderInfo) {
      throw new StatusError(
        "没有该笔订单",
        StatusError.ERROR_STATUS.DATA_ERROR
      );
    }

    // 处理订单收货地址
    const [provinceName, cityName, districtName] = await Promise.all([
      service.api.region.getRegionName(orderInfo.province),
      service.api.region.getRegionName(orderInfo.city),
      service.api.region.getRegionName(orderInfo.district)
    ]);
    orderInfo["province_name"] = provinceName;
    orderInfo["city_name"] = cityName;
    orderInfo["district_name"] = districtName;
    orderInfo["full_region"] = provinceName + cityName + districtName;

    // 物流信息 NOTE: 现在没有做
    orderInfo["express"] = {};

    // 订单内货物
    const orderGoods = await service.api.orderGood.list({ order_id: orderId });

    // 订单状态处理
    orderInfo["order_status_text"] = await this.getOrderStatusText(orderId);
    orderInfo["add_time"] = moment(orderInfo.add_time * 1000).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    // orderInfo['final_pay_time'] = moment('001234', 'Hmmss').format('mm:ss');

    // 订单最后支付时间 NOTE: 逻辑未完善
    if (orderInfo.order_status === 0) {
      orderInfo["final_pay_time"] = moment("001234", "Hmmss").format("mm:ss");
    }

    const handleOption = await this.getOrderHandleOption(orderId);

    return {
      orderInfo,
      orderGoods,
      handleOption
    };
  }

  async cancel(orderId) {
    const { model, jwtSession, service } = this.ctx;
    const orderInfo = await this.find({
      user_id: jwtSession.user_id,
      id: orderId
    });
    if (!orderInfo) {
      throw new StatusError("订单不存在", StatusError.ERROR_STATUS.DATA_ERROR);
    }
    if (orderInfo.order_status == 0) {
      await this.updateById(orderId, { order_status: 101 });
      return { orderInfo };
    } else {
      throw new StatusError("订单已开票", StatusError.ERROR_STATUS.DATA_ERROR);
    }
  }
}

module.exports = OrderService;
