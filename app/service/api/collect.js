const BaseService = require("../base");

class CollectService extends BaseService {
  constructor(app) {
    super("Collect", app);
  }

    /**
   * @description 检查用户是否对指定货物进行了收藏
   * @param {number} userId 用户id
   * @param {number} typeId 类型id???，作用未知，固定为0
   * @param {number} valueId 值id
   * @returns {Promise<boolean>} hasCollect 如果是ture则已经收藏
   */
  isUserHasCollect = (userId, typeId, valueId) => {
    return this.app.model.Collect.count({
      where: { type_id: typeId, value_id: valueId, user_id: userId },
      col: 'id',
    }).then(count => count > 0);
  };
}
module.exports = CollectService;
