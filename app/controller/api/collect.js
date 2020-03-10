const Controller = require("egg").Controller;

class CollectController extends Controller {
  /**
   * @description 显示用户收藏货物列表
   * @memberof CollectCtrl
   */
  async list() {
    const { request, helper, jwtSession, model, response } = this.ctx;
    // NOTE: 这个接口应该做分页的，但是客户端没有上传相应参数
    const { typeId } = helper.validateParams(
      {
        typeId: { type: "numberString", field: "typeId" }
      },
      request.query,
      this.ctx
    );

    const list = await model.Collect.findAll({
      where: { user_id: jwtSession.user_id, type_id: typeId },
      raw: true,
      include: [
        {
          association: model.Collect.belongsTo(model.Good, {
            foreignKey: "value_id",
            targetKey: "id"
          }),
          model: model.Good,
          attributes: ["name", "list_pic_url", "goods_brief", "retail_price"],
          // left join
          required: false
        }
      ]
    }).then(results => {
      const goodTableName = model.Good.name;
      return results.map(result => {
        result["name"] = result[goodTableName + ".name"];
        result["list_pic_url"] = result[goodTableName + ".list_pic_url"];
        result["goods_brief"] = result[goodTableName + ".goods_brief"];
        result["retail_price"] = result[goodTableName + ".retail_price"];
        return result;
      });
    });

    response.body = {
      count: list.length,
      totalPages: 1,
      pageSize: list.length,
      currentPage: 1,
      data: list
    };
  }

  /**
   * @description 用户添加或者删除货物
   * @memberof CollectCtrl
   */
  async addOrDelete() {
    const { request, helper, model, service, jwtSession, response } = this.ctx;
    const { typeId, valueId } = helper.validateParams(
      {
        typeId: { type: "number" },
        valueId: { type: "number" }
      },
      request.body,
      this.ctx
    );

    const collect = await service.api.collect.find({
      user_id: jwtSession.user_id,
      type_id: typeId,
      value_id: valueId
    });

    let handleType;
    if (!collect) {
      // 添加收藏
      await service.api.collect.save({
        user_id: jwtSession.user_id,
        value_id: valueId,
        add_time: Math.floor(Date.now() / 1000),
        type_id: typeId
      });
      handleType = "add";
    } else {
      // 删除收藏
      await service.api.collect.delete({
        user_id: jwtSession.user_id,
        type_id: typeId,
        value_id: valueId
      });
      handleType = "delete";
    }

    response.body = {
      type: handleType
    };
  }
}

module.exports = CollectController;
