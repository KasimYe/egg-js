const Controller = require('egg').Controller;

class CatalogController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.api.catalog.list(ctx.params.id);
  }
}

module.exports = CatalogController;
