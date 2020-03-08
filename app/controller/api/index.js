const Controller = require("egg").Controller;

class IndexController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.api.index.index();
  }
}

module.exports = IndexController;
