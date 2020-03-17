const BaseService = require("../base");

class SearchHistoryService extends BaseService {
  constructor(app) {
    super("SearchHistoriy", app);
  }

  async addSearchHistory(keyword, from, user_id, add_time) {
    return await this.save({ keyword, from, user_id, add_time });
  }
}

module.exports = SearchHistoryService;
