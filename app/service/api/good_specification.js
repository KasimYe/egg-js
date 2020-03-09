const Service = require("egg").Service;

class GoodSpecificationService extends Service {
  async getGoodValues(goodId) {
    const GoodSpecification = this.app.model.GoodSpecification;
    const Specification = this.app.model.Specification;
    const results = await GoodSpecification.findAll({
      where: { goods_id: goodId },
      // NOTE: 如果不加raw: true，则include查出来的结果会被包含在include字段中
      raw: true,
      include: [
        {
          association: GoodSpecification.belongsTo(Specification, {
            foreignKey: "specification_id",
            targetKey: "id"
          }),
          model: Specification,
          // 内连接
          required: true,
          // NOTE: include查出来的字段会被自动添加上表名变成 nideshop_specifications.name，如果需要去除表名，只能自己对结果进行map修改
          attributes: ["name"]
        }
      ]
    });
    results.forEach(result => {
      // NOTE: 使用model.name 获取的是单数的表名，也就是define的时候定义的表名
      // 使用model.getTableName() 获取的是复数的表名，也就是数据库中实际的表名
      const table = Specification.name;
      result["name"] = result[table + ".name"];
    });
    return results;
  }
}
module.exports = GoodSpecificationService;
