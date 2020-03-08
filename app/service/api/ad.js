const BaseService=require('../base')
class AdService extends BaseService {
  constructor(app) {
    super("Ad", app);
  }
}

module.exports = AdService;
