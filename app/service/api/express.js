const Service = require("egg").Service;
const _ = require("lodash");
const KDNiao = require("../../entity/kdniao");

class ExpressService extends Service {
  async search(exNumber) {
    const config = this.app.config;
    const exName = "(邮政)";
    if (_.endsWith(exNumber, exName)) {
      const exCode = _.trimEnd(exNumber, exName);
      const client = new KDNiao({
        EBusinessID: config.kdniao.EBusinessID,
        AppKey: config.kdniao.AppKey,
        sandbox: false,
        debug: true
      });

      const result = await client.RealTimeQuery({
        ShipperCode: "YZBK",
        LogisticCode: exCode
      });
      return result;
    }
  }
}
module.exports = ExpressService;
