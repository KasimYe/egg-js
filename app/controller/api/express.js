const Controller = require("egg").Controller;

class ExpressController extends Controller {
  async search() {
    const { request, response, helper, service } = this.ctx;
    const { id } = helper.validateParams(
      {
        id: { type: "string", field: "id" }
      },
      request.query,
      this.ctx
    );    
    response.body = await service.api.express.search(id);
  }
}
module.exports = ExpressController;
