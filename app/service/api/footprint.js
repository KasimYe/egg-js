const BaseService = require("../base");

class FootprintService extends BaseService {
  constructor(app) {
    super("Footprint", app);
  }

  /**
   * @description 记录用户查看过哪些货物详情
   * @param {number} userId 用户id
   * @param {number} goodsId 货物id
   * @returns {PromiseLike<IFootPrintInst>} 添加后的记录
   */
  addFootprint = (userId, goodsId) => {
    // 用户已登录才能添加到足迹
    if (userId > 0 && goodsId > 0) {
      return this.save({
        goods_id: goodsId,
        user_id: userId,
        add_time: Date.now() / 1000,
      });
    }
  };

}
module.exports = FootprintService;
