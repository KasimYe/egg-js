const Controller = require('egg').Controller;

class CatalogController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.api.catalog.list(ctx.params.id);
  }

  async current() {
    const { helper, request, service, response } = this.ctx;
    const { id } = helper.validateParams({
      id: { type: 'numberString', field: 'id' },
    }, request.query, this.ctx);
    response.body = await service.api.catalog.current(id);
  }
}

module.exports = CatalogController;
