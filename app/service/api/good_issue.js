const BaseService = require("../base");

class GoodIssueService extends BaseService {
  constructor(app) {
    super("GoodIssue", app);
  }
}
module.exports = GoodIssueService;
