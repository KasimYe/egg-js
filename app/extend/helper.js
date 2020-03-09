const StatusError = require("../entity/status_error");

module.exports = {
  /**
   * @description 分页辅助函数，获取总页数，查询偏移
   * @param {number} totalCount 总记录数
   * @param {number} size 每页size
   * @param {number} page 需要查询第几页
   * @returns
   */
  // paginate(totalCount: number, size: number, page: number) {
  //   return {
  //     totalPages: Math.ceil(totalCount / size),
  //     offset: (page - 1) * size,
  //   };
  // },
  /**
   * @description 计算分页偏移
   * @param {number} size
   * @param {number} page
   * @returns {number} offset 查询偏移
   */
  pageOffset(page, size) {
    return (page - 1) * size;
  },

  /**
   * @description 计算总
   * @param {number} totalCount
   * @param {number} size
   * @returns {number} totalPage 总页数
   */
  pageTotal(totalCount, size) {
    return Math.ceil(totalCount / size);
  },

  /**
   * @description 检验请求参数
   * @param {object} rules 校验规则
   * @param {object} params 被校验参数
   * @param {Context} ctx Context
   * @throws {StatusError} 如果校验不通过则throw一个error
   */
  validateParams(rules, params, ctx) {
    try {
      ctx.validate(rules, params);
      return params;
    } catch (e) {
      ctx.logger.info(e.message);
      throw new StatusError(
        e.message,
        StatusError.StatusError.ERROR_STATUS.REQUEST_PARAMS_ERROR
      );
    }
  }
};
