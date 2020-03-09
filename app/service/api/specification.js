const BaseService = require("../base");

class SpecificationService extends BaseService {
  constructor(app) {
    super("Specification", app);
  }
}

module.exports = SpecificationService;
