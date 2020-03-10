const Controller = require("egg").Controller;
const { Op } = require("sequelize");

class SearchController extends Controller {
  /**
   * @description 返回搜索历史与热门搜索
   * @memberof SearchCtrl
   */
  async index() {
    const { jwtSession, response, service, model } = this.ctx;

    // 取出输入框默认的关键词
    const defaultKeyword = await service.api.keyword.find({ is_default: 1 });
    // 取出热搜关键词
    const hotKeywordList = await service.api.keyword.list(
      { is_hot: 1 },
      0,
      0,
      [["sort_order", "ASC"]],
      ["keyword", "is_hot"]
    );

    // 取出历史搜索
    let historyKeywordList = [];
    if (jwtSession && jwtSession.user_id) {
      historyKeywordList = await model.SearchHistory.findAll({
        attributes: ["keyword"],
        where: { user_id: jwtSession.user_id },
        raw: true,
        limit: 10
      }).then(res => res.map(inst => inst.keyword));
    }

    response.body = {
      defaultKeyword,
      hotKeywordList,
      historyKeywordList
    };
  }

  /**
   * @description 实时关键词搜索
   * @memberof SearchCtrl
   */
  async helper() {
    const { request, helper, response, service } = this.ctx;
    const { keyword } = helper.validateParams(
      {
        keyword: { type: "string" }
      },
      request.query,
      this.ctx
    );

    const results = await service.api.keyword
      .list({ keyword: { [Op.like]: keyword } }, 1, 10, [], ["keyword"])
      .then(res => res.map(inst => inst.keyword));

    response.body = results;
  }

  /**
   * @description 清除用户搜索历史
   * @memberof SearchCtrl
   */
  async clearHistory() {
    const { jwtSession, service, response } = this.ctx;

    if (jwtSession && jwtSession.user_id) {
      await service.api.searchHistory.delete({ user_id: jwtSession.user_id });
    }

    response.body = "";
  }
}
module.exports = SearchController;
