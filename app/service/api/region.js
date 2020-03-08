const BaseService = require("../base");

class RegionService extends BaseService {
  constructor(app) {
    super("Region", app);
  }

  getRegionName = regionId => {
    return this.find({ id: regionId }, ["name"]).then(res => res.name);
  };
}

module.exports = RegionService;
