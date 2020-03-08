const BaseService = require("../base");
class AddressService extends BaseService {
  constructor(app) {
    super("Address", app);
  }

  getDetailAddress = async userAddress => {
    const { Region } = this.service.api;
    const [provinceName, cityName, districtName] = await Promise.all([
      Region.getRegionName(userAddress.province_id),
      Region.getRegionName(userAddress.city_id),
      Region.getRegionName(userAddress.district_id)
    ]);
    userAddress["province_name"] = provinceName;
    userAddress["city_name"] = cityName;
    userAddress["district_name"] = districtName;
    userAddress["full_region"] = provinceName + cityName + districtName;
    return userAddress;
  };
}

module.exports = AddressService;
