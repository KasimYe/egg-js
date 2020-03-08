const BaseService=require('../base')

 class BrandService extends BaseService {
  constructor(app) {
    super('Brand', app);
  }
}
module.exports=BrandService