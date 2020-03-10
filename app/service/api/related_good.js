const BaseService=require('../base')

class RelatedGoodService extends BaseService {
  constructor(app) {
    super('RelatedGood', app);
  }
}
module.exports=RelatedGoodService