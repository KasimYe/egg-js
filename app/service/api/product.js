const BaseService=require('../base')

class ProductService extends BaseService {
  constructor(app) {
    super('Product', app);
  }
}
module.exports=ProductService