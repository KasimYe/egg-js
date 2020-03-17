const Controller = require("egg").Controller;

class NewsController extends Controller {
  async index() {
    const { helper, request, service, response } = this.ctx;
    const { id } = helper.validateParams(
      {
        id: { type: "numberString", field: "id" }
      },
      request.query,
      this.ctx
    );

    response.body = await service.api.news.one(id);
  }
}

module.exports = NewsController;
