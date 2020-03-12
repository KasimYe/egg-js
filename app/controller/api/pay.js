const Controller = require("egg").Controller;

class PayController extends Controller {
  async prepay() {
    const { request, helper, service, response } = this.ctx;
    const { orderId } = helper.validateParams(
      {
        orderId: { type: "numberString", field: "orderId" }
      },
      request.query,
      this.ctx
    );

    response.body = await service.api.pay.prepay(orderId);
  }

  async notify(){
    const { request, helper, service, response } = this.ctx;
    const { xml } = helper.validateParams(
      {
        xml: { type: "string", field: "xml" }
      },
      request.query,
      this.ctx
    );

    response.body = await service.api.pay.notify(xml);
  }
}

module.exports = PayController;
