const Controller = require("egg").Controller;

class OrderController extends Controller {
  /**
   * @description 获取订单列表
   * @memberof OrderCtrl
   */
  async list() {
    const { response, service } = this.ctx;
    const orderList = await service.api.order.orderList();

    response.body = orderList;
  }

  /**
   * @description 提交订单
   * @memberof OrderCtrl
   */
  async submit() {
    const { request, helper, response, service } = this.ctx;
    const { addressId, couponId, postscript = "" } = helper.validateParams(
      {
        addressId: { type: "number" },
        couponId: { type: "number" },
        postscript: { type: "string", required: false }
      },
      request.body,
      this.ctx
    );

    const orderInfo = await service.api.order.submit(
      addressId,
      couponId,
      postscript
    );

    response.body = { orderInfo };
  }

  /**
   * @description 订单详情
   * @memberof OrderCtrl
   */
  async detail() {
    const { request, response, helper, service } = this.ctx;
    const { orderId } = helper.validateParams(
      {
        orderId: { type: "numberString", field: "orderId" }
      },
      request.query,
      this.ctx
    );
    const detail = await service.api.order.detail(orderId);
    response.body = detail;
  }

  async cancel() {
    const { request, response, helper, service } = this.ctx;
    const { orderId } = helper.validateParams(
      {
        orderId: { type: "numberString", field: "orderId" }
      },
      request.query,
      this.ctx
    );
    const detail = await service.api.order.cancel(orderId);
    response.body = detail;
  }
}
module.exports = OrderController;
