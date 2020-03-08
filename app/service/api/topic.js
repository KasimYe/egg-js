const BaseService=require('../base')

class TopicService extends BaseService {
  constructor(app) {
    super('Topic', app);
  }
}
module.exports=TopicService