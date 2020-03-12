const Controller = require("egg").Controller;
const moment = require("moment");
const _ = require("lodash");

class FootprintController extends Controller {
  async list() {
    const { model, jwtSession, response } = this.ctx;
    const list = await model.Footprint.findAll({
      where: { user_id: jwtSession.user_id },
      raw: true,
      order: [["id", "DESC"]],
      include: [
        {
          association: model.Footprint.belongsTo(model.Good, {
            foreignKey: "goods_id",
            targetKey: "id"
          }),
          model: model.Good,
          attributes: ["name", "list_pic_url", "goods_brief", "retail_price"]
        }
      ]
    });

    // 去重、格式化日期、按天分组
    list.data = _.map(
      _.uniqBy(list.data, function(item) {
        return item.goods_id;
      }),
      item => {
        item.add_time = moment.unix(item.add_time).format("YYYY-MM-DD");
        // 今天
        if (moment().format("YYYY-MM-DD") === item.add_time) {
          item.add_time = "今天";
        }
        // 昨天
        if (
          moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD") === item.add_time
        ) {
          item.add_time = "昨天";
        }
        // 前天
        if (
          moment()
            .subtract(2, "days")
            .format("YYYY-MM-DD") === item.add_time
        ) {
          item.add_time = "前天";
        }
        return item;
      }
    );

    list.data = _.groupBy(list.data, function(item) {
      return item.add_time;
    });
    list.data = _.values(list.data);

    response.body = list;
  }
}

module.exports = FootprintController;
