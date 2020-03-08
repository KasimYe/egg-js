const Controller = require("egg").Controller;

class BrandController extends Controller {
  async list() {
    const { request, helper, service, response } = this.ctx;
    const { page, size } = helper.validateParams(
      {
        page: { type: "numberString", field: "page", required: false },
        size: { type: "numberString", field: "size", required: false }
      },
      request.query,
      this.ctx
    );

    const { count, rows: list } = await service.api.brand.listAndCount(
      {},
      page,
      size,
      [],
      ["id", "name", "floor_price", "app_list_pic_url"]
    );

    response.body = {
      count,
      totalPages: helper.pageTotal(count, size),
      pageSize: size,
      currentPage: page,
      data: list
    };
  }

  /**
   * @description 查询品牌详情
   * @memberof BrandCtrl
   */
  async detail() {
    const { request, response, helper, service } = this.ctx;
    const { id: brandId } = helper.validateParams(
      {
        id: { type: "numberString", field: "id", required: true }
      },
      request.query,
      this.ctx
    );

    const data = await service.api.brand.one(brandId);    

    response.body = {
      brand: data
    };
  }
}

module.exports = BrandController;
