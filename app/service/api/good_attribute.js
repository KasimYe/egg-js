const { Service } = require("egg");

class GoodAttributeService extends Service {
  async getGoodValues(goodId) {
    const { model } = this.app;
    return model.GoodAttribute.findAll({
      raw: true,
      include: [
        {
          association: model.GoodAttribute.belongsTo(model.Attribute, {
            foreignKey: "attribute_id",
            targetKey: "id"
          }),
          model: model.Attribute,
          // NOTE: 查出来的字段会被自动添加上表名变成 nideshop_attribute.name，如果需要去除表名，只能自己对结果进行map修改
          attributes: ["name"]
        }
      ],
      where: { goods_id: goodId },
      order: [["id", "asc"]],
      attributes: ["value"]
    }).then(results =>
      results.map(result => {
        return {
          value: result.value,
          name: result[model.Attribute.name + ".name"]
        };
      })
    );
  }
}
module.exports = GoodAttributeService;
