const BaseService = require("../base");

class GoodDistrictService extends BaseService {
  constructor(app) {
    super("GoodDistrict", app);
  }

  async checkDistrict(good_id, order_district) {
    const goodDistricts = await this.list({ goods_id: good_id });
    if (goodDistricts) {
      const goodDistrict = await goodDistricts.find(
        x => x.district == order_district
      );
      if (goodDistrict) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
module.exports = GoodDistrictService;
