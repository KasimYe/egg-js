const { Service } = require("egg");
const crypto = require("crypto");
const md5 = require("md5");

class WeChatService extends Service {
  async decryptUserInfoData(sessionKey, encryptedData, iv) {
    // base64 decode
    const _sessionKey = Buffer.from(sessionKey, "base64");
    const _encryptedData = Buffer.from(encryptedData, "base64");
    const _iv = Buffer.from(iv, "base64");
    let decoded = "";
    try {
      // 解密
      const decipher = crypto.createDecipheriv("aes-128-cbc", _sessionKey, _iv);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      decoded = decipher.update(_encryptedData, "binary", "utf8");
      decoded += decipher.final("utf8");

      decoded = JSON.parse(decoded);
    } catch (err) {
      return "";
    }

    if (decoded.watermark.appid !== this.app.config.wechat.appid) {
      return "";
    }

    return decoded;
  }

  /**
   * 统一下单
   * @param payInfo
   * @returns {Promise}
   */
  async createUnifiedOrder(payInfo) {
    const WeiXinPay = require("weixinpay");
    const { config } = this.app;
    const weixinpay = new WeiXinPay({
      appid: config.wechat.appid, // 微信小程序appid
      openid: payInfo.openid, // 用户openid
      mch_id: config.wechat.mch_id, // 商户帐号ID
      partner_key: config.wechat.partner_key // 秘钥
    });
    console.log("payInfo:", payInfo);
    return new Promise((resolve, reject) => {
      weixinpay.createUnifiedOrder(
        {
          body: payInfo.body,
          out_trade_no: payInfo.out_trade_no,
          total_fee: payInfo.total_fee,
          spbill_create_ip: payInfo.spbill_create_ip,
          notify_url: config.wechat.notify_url,
          trade_type: "JSAPI"
        },
        res => {
          if (res.return_code === "SUCCESS" && res.result_code === "SUCCESS") {
            const returnParams = {
              appid: res.appid,
              timeStamp: parseInt(Date.now() / 1000) + "",
              nonceStr: res.nonce_str,
              package: "prepay_id=" + res.prepay_id,
              signType: "MD5"
            };
            const paramStr =
              `appId=${returnParams.appid}&nonceStr=${returnParams.nonceStr}&package=${returnParams.package}&signType=${returnParams.signType}&timeStamp=${returnParams.timeStamp}&key=` +
              config.wechat.partner_key;
            returnParams.paySign = md5(paramStr).toUpperCase();
            resolve(returnParams);
          } else {
            reject(res);
          }
        }
      );
    });
  }

  /**
   * 生成排序后的支付参数 query
   * @param queryObj
   * @returns {Promise.<string>}
   */
  buildQuery(queryObj) {
    const sortPayOptions = {};
    for (const key of Object.keys(queryObj).sort()) {
      sortPayOptions[key] = queryObj[key];
    }
    let payOptionQuery = "";
    for (const key of Object.keys(sortPayOptions).sort()) {
      payOptionQuery += key + "=" + sortPayOptions[key] + "&";
    }
    payOptionQuery = payOptionQuery.substring(0, payOptionQuery.length - 1);
    return payOptionQuery;
  }

  /**
   * 对 query 进行签名
   * @param queryStr
   * @returns {Promise.<string>}
   */
  signQuery(queryStr) {
    queryStr = queryStr + "&key=" + this.app.config.wechat.partner_key;    
    const md5Sign = md5(queryStr);
    return md5Sign.toUpperCase();
  }

  /**
   * 处理微信支付回调
   * @param notifyData
   * @returns {{}}
   */
  payNotify(notifyData) {
    if (!notifyData) {
      return false;
    }

    const notifyObj = {};
    let sign = "";
    for (const key of Object.keys(notifyData)) {
      if (key !== "sign") {
        notifyObj[key] = notifyData[key][0];
      } else {
        sign = notifyData[key][0];
      }
    }
    if (
      notifyObj.return_code !== "SUCCESS" ||
      notifyObj.result_code !== "SUCCESS"
    ) {
      return false;
    }
    const signString = this.signQuery(this.buildQuery(notifyObj));
    if (!sign || signString !== sign) {
      return false;
    }
    return notifyObj;
  }
}
module.exports = WeChatService;
