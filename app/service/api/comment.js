const BaseService = require("../base");

class CommentService extends BaseService {
  constructor(app) {
    super("Comment", app);
  }
}
module.exports = CommentService;
