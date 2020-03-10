const Controller = require("egg").Controller;
const { Op } = require("sequelize");

class AddressController extends Controller {
  /**
   * @description 获取用户收货地址列表
   * @memberof AddressController
   */
  async list() {
    const { service, jwtSession, response } = this.ctx;
    const addressList = await service.api.address
      .list({ user_id: jwtSession.user_id })
      .then(addresses => {
        if (addresses.length > 0) {
          return Promise.all(
            addresses.map(address =>
              service.api.address.getDetailAddress(address)
            )
          );
        } else {
          return [];
        }
      });

    response.body = addressList;
  }

  /**
   * @description 查询用户地址详细信息
   * @memberof AddressController
   */
  async detail() {
    const { request, helper, service, jwtSession, response } = this.ctx;
    const { id: addressId } = helper.validateParams(
      {
        id: { type: "numberString", field: "id" }
      },
      request.query,
      this.ctx
    );

    const addressInfo = await service.api.address
      .find({ user_id: jwtSession.user_id, id: addressId })
      .then(address => address && model.Address.getDetailAddress(address));

    response.body = addressInfo || {};
  }

  /**
   * @description 删除用户地址
   * @memberof AddressCtrl
   */
  async deleteAddress() {
    const { request, helper, service, response, jwtSession } = this.ctx;
    const { id: addressId } = helper.validateParams(
      {
        id: { type: "number" }
      },
      request.body,
      this.ctx
    );

    await service.api.address.delete({
      user_id: jwtSession.user_id,
      id: addressId
    });

    response.body = "删除成功";
  }

  async save() {
    const { request, helper, service, jwtSession, response } = this.ctx;
    const {
      id = null,
      address,
      city_id: cityId,
      district_id: districtId,
      is_default,
      mobile,
      name,
      province_id: provinceId
    } = helper.validateParams(
      {
        id: { type: "number", required: false },
        address: { type: "string" },
        city_id: { type: "number" },
        district_id: { type: "number" },
        is_default: { type: "boolean" },
        mobile: { type: "string" },
        name: { type: "string" },
        province_id: { type: "number" }
      },
      request.body,
      this.ctx
    );

    const isDefault = is_default ? 1 : 0;
    let addressId = id;

    const addressInfo = {
      name,
      mobile,
      province_id: provinceId,
      city_id: cityId,
      district_id: districtId,
      address,
      user_id: jwtSession.user_id,
      is_default: isDefault
    };
    // 有地址id则更新地址
    if (id) {
      await service.api.address.updateById(addressId, addressInfo);
    } else {
      // 创建一个地址
      addressId = await service.api.address
        .save(addressInfo)
        .then(res => res.id);
    }

    // 如果设置为默认，则需要取消其他地址的默认
    if (is_default) {
      await service.api.address.update(
        { user_id: jwtSession.user_id, id: { [Op.ne]: addressId } },
        {
          is_default: 0
        }
      );
    }

    response.body = await service.api.address.one(addressId);
  }
}

module.exports = AddressController;
