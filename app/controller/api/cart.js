const Controller = require("egg").Controller;
const { Op } = require("sequelize");

class CartController extends Controller {
  // 获取购物车商品的总件件数
  async goodscount() {
    const { service, response } = this.ctx;
    const cartData = await service.api.cart.getCart();
    response.body = {
      cartTotal: {
        goodsCount: cartData.cartTotal.goodsCount
      }
    };
  }

  /**
   * @description 获取购物车信息，所有对购物车的增删查改操作，都要重新返回购物车信息
   * @memberof CartCtrl
   */
  async index() {
    const { service, response } = this.ctx;
    response.body = await service.api.cart.getCart();
  }

  /**
   * @description 添加商品到购物车
   * @memberof CartCtrl
   */
  async add() {
    const { request, helper, service, response } = this.ctx;
    const { goodsId, productId, number } = helper.validateParams(
      {
        goodsId: { type: "number" },
        productId: { type: "number" },
        number: { type: "number" }
      },
      request.body,
      this.ctx
    );

    await service.api.cart.add(goodsId, productId, number);
    response.body = await service.api.cart.getCart();
  }

  /**
   * @description 更新购物车商品数量
   * @memberof CartCtrl
   */
  async update() {
    const { request, helper, service, response } = this.ctx;
    const { goodsId, productId, id: cartId, number } = helper.validateParams(
      {
        goodsId: { type: "number" },
        productId: { type: "number" },
        id: { type: "number" },
        number: { type: "number" }
      },
      request.body,
      this.ctx
    );

    await service.api.cart.updateCart(goodsId, productId, cartId, number);
    response.body = await service.api.cart.getCart();
  }

  /**
   * @description 批量删除购物车的货物
   * @memberof CartCtrl
   */
  async delete() {
    const { request, helper, model, response, service, jwtSession } = this.ctx;
    const { productIds } = helper.validateParams(
      {
        productIds: { type: "string" }
      },
      request.body,
      this.ctx
    );

    // 上传的货物id由，分割
    const productIdArr = productIds.split(",");

    await service.api.cart.delete({
      product_id: { [Op.in]: productIdArr },
      user_id: jwtSession.user_id
    });

    response.body = await service.api.cart.getCart();
  }

  /**
   * @description 最后检查，订单提交前校验与填写相关订单信息
   * @memberof CartCtrl
   */
  async checkout() {
    const { request, helper, response, service } = this.ctx;
    const { addressId } = helper.validateParams(
      {
        addressId: { type: "numberString", field: "addressId" }
        // 优惠券id，优惠券逻辑貌似暂时没有实现
        // couponId: { type: 'numberString', field: 'couponId' },
      },
      request.query,
      this.ctx
    );

    response.body = await service.api.cart.checkout(addressId);
  }

  /**
   * @description 是否选择商品，如果已经选择，则取消选择，批量操作
   * @memberof CartCtrl
   */
  async checked() {
    const { request, helper, service, response, jwtSession } = this.ctx;
    const { productIds, isChecked } = helper.validateParams(
      {
        // productIds: { type: 'string' },
        isChecked: { type: "number" }
      },
      request.body,
      this.ctx
    );

    const productArr = (productIds + "").split(",");
    await service.api.cart.update(
      { product_id: { [Op.in]: productArr }, user_id: jwtSession.user_id },
      {
        checked: isChecked
      }
    );

    response.body = await service.api.cart.getCart();
  }
}

module.exports = CartController;
