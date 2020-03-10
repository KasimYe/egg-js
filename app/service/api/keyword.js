const BaseService = require("../base");

class KeywordService extends BaseService {
  constructor(app) {
    super("Keyword", app);
  }
}

module.exports = KeywordService;
