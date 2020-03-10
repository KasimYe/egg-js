const BaseService = require("../base");

class SearchService extends BaseService {
  constructor(app) {
    super("Search", app);
  }
}

module.exports = SearchService;
