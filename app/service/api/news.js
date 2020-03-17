const BaseService = require("../base");

class NewsService extends BaseService {
  constructor(app) {
    super("News", app);
  }
}

module.exports = NewsService;
