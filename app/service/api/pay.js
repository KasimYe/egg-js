const { Service } = require("egg");
const { StatusError } = require("../../entity/status_error");
const xml2js = require("xml2js");

class PayService extends Service {
  async prepay(orderId) {
    const sapi = this.service.api;
    const orderInfo = await sapi.order.one(orderId);
    if (!orderInfo) {
      throw new StatusError("订单已取消", StatusError.ERROR_STATUS.DATA_ERROR);
    }
    if (parseInt(orderInfo.pay_status) !== 0) {
      throw new StatusError(
        "订单已支付，请不要重复操作",
        StatusError.ERROR_STATUS.DATA_ERROR
      );
    }
    const openid = await sapi.user
      .find({ id: orderInfo.user_id }, ["weixin_openid"])
      .then(res => res.weixin_openid);
    if (!openid) {
      throw new StatusError(
        "微信支付失败:openid",
        StatusError.ERROR_STATUS.DATA_ERROR
      );
    }

    try {
      const returnParams = await sapi.wechat.createUnifiedOrder({
        openid: openid,
        body: "订单编号：" + orderInfo.order_sn,
        out_trade_no: orderInfo.order_sn,
        total_fee: parseInt(orderInfo.actual_price * 100),
        spbill_create_ip: ""
      });
      return returnParams;
    } catch (err) {
      throw new StatusError(
        "微信支付失败:api",
        StatusError.ERROR_STATUS.DATA_ERROR
      );
    }
  }

  async notify(xml) {
    const sapi = this.service.api;
    const notifyData = await xml2js.parseStringPromise(xml);
    const result = sapi.wechat.payNotify(notifyData.xml);
    if (!result) {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>`;
    }

    const orderSer = sapi.order;
    const orderInfo = await orderSer.find({ order_sn: result.out_trade_no });
    if (!orderInfo) {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
    }
    if (orderInfo.pay_status < 2) {
      await orderSer
        .updateById(orderInfo.id, {
          pay_status: 2,
          pay_name: result.transaction_id,
          pay_time: result.time_end
        })
        .then(
          orderSer.updateById(orderInfo.id, {
            order_status: 201
          })
        );
    }
    return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
  }
}

module.exports = PayService;
