const BaseService = require("../base");

class RegionService extends BaseService {
  constructor(app) {
    super("Region", app);
  }

  getRegionName = async regionId => {
    return this.find({ id: regionId }, ["name"]).then(res => res.name);
  };

  getFreightPrice = async regionId => {
    return this.find({ id: regionId }, ["freight_price"]).then(
      res => res.freight_price
    );
  };
}

module.exports = RegionService;
