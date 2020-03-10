const Controller = require("egg").Controller;

class RegionController extends Controller {
  /**
   * @description 查询父区域id下的子区域列表
   * @memberof RegionCtrl
   */
  async listChildRegion() {
    const { request, helper, service, response } = this.ctx;
    const { parentId } = helper.validateParams(
      {
        parentId: { type: "numberString", field: "parentId" }
      },
      request.query,
      this.ctx
    );

    response.body = await service.api.region.list({ parent_id: parentId });
  }
}
module.exports = RegionController;
