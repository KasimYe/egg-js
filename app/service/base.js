const { Service } = require("egg");
const helper = require("../extend/helper");

class BaseService extends Service {
  static model;
  /**
   * 构造函数
   * @param model 模型名称
   * @param app Context上下文
   */
  constructor(model, app) {
    super(app);
    this.model = model;
  }

  /**
   * findAll List
   * @param where 查询条件
   * @param offset 页数
   * @param limit 每页条目数
   * @param order 排序，格式[['name', 'DESC']]
   * @param attributes 查询的列
   */
  async list(
    where = {},
    offset = 0,
    limit = 0,
    order = [],
    attributes = [],
    raw = true
  ) {
    const options = {
      where: where,
      limit: limit !== 0 ? limit : null,
      offset: offset !== 0 ? helper.pageOffset(offset, limit) : null,
      order: order === [] ? null : order,
      attributes: attributes.length > 0 ? attributes : null,
      raw: raw
    };
    return await this.app.model[this.model].findAll(options);
  }

  /**
   *
   * @param where 查询条件
   * @param offset 页数
   * @param limit 每页条目数
   * @param order 排序，格式[['name', 'DESC']]
   * @param attributes 查询的列
   * @param raw
   */
  async listAndCount(
    where = {},
    offset = 0,
    limit = 0,
    order = [],
    attributes = [],
    raw = true
  ) {
    const options = {
      where: where,
      limit: limit !== 0 ? limit : null,
      offset: offset !== 0 ? helper.pageOffset(offset, limit) : null,
      order: order === [] ? null : order,
      attributes: attributes.length > 0 ? attributes : null,
      raw: raw
    };
    return await this.app.model[this.model].findAndCountAll(options);
  }

  async find(where = {}, attributes = []) {
    const options = {
      where: where,
      attributes: attributes.length > 0 ? attributes : null,
      raw: true
    };
    return await this.app.model[this.model].findOne(options);
  }

  async one(id) {
    return await this.app.model[this.model].findOne({
      where: { id: id },
      raw: true
    });
  }

  async updateById(id, data) {
    return await this.app.model[this.model].update(data, { where: { id: id } });
  }

  async update(where = {}, data) {
    return await this.app.model[this.model].update(data, { where: where });
  }

  async save(data) {
    return await this.app.model[this.model].create(data);
  }

  //   async saveMany(models: any[]) {}

  async deleteById(id) {
    return await this.app.model[this.model].destroy({ where: { id: id } });
  }

  async delete(where = {}) {
    return await this.app.model[this.model].destroy({ where: where });
  }

  //   async deleteMany(ids: number[]) {}
}

module.exports = BaseService;
