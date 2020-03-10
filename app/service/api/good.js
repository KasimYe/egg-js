const BaseService = require("../base");
const { Op } = require("sequelize");
const helper = require("../../extend/helper");
const moment = require("moment");

class GoodService extends BaseService {
  constructor(app) {
    super("Good", app);
  }

  async count() {
    const { ctx } = this;
    return await ctx.model.Good.count({
      where: { is_delete: 0, is_on_sale: 1 },
      col: "id"
    });
  }

  async category(id) {
    const currentCategory = await this.service.api.category.one(id);
    const [parentCategory, brotherCategory] = await Promise.all([
      this.service.api.category.one(currentCategory.parent_id),
      this.service.api.category.list({ parent_id: currentCategory.parent_id })
    ]);

    return {
      currentCategory,
      parentCategory,
      brotherCategory
    };
  }

  async listByCategory(
    keyword,
    page,
    size,
    sort,
    order,
    categoryId,
    brandId,
    isNew,
    isHot
  ) {
    const { ctx } = this;
    // 添加搜索查找条件
    let whereMap = {};
    if (keyword && ctx.session.user.id) {
      // 将用户的搜索记录插入到表中
      whereMap.name = { [Op.like]: `%${keyword}%` };

      ctx.service.api.searchHistories.save({
        keyword: keyword,
        user_id: ctx.session.userid,
        add_time: new Date().getTime() / 1000
      });
    }

    brandId ? (whereMap.brand_id = brandId) : null;

    isNew ? (whereMap.is_new = isNew) : null;

    isHot ? (whereMap.is_hot = isHot) : null;

    // 添加排序条件
    let orderMap;
    if (sort === "price") {
      // 按价格排序
      orderMap = [["retail_price", order]];
    } else {
      // 按照商品添加时间
      orderMap = [["id", "desc"]];
    }

    // 添加筛选分类
    let filterCategory = [
      {
        id: 0,
        name: "全部",
        checked: false
      }
    ];
    // 搜索商品所属分类
    const categoryIds = await ctx.service.api.good
      .list(whereMap, 0, 0, orderMap, ["category_id"], true)
      .then(categoryInsts =>
        categoryInsts.map(categoryInst => categoryInst.category_id)
      );

    if (categoryIds && categoryIds.length > 0) {
      // 商品所属分类的父类id
      const parentIds = await ctx.service.api.category
        .list({ id: { [Op.in]: categoryIds } }, 0, 0, [], ["parent_id"], true)
        .then(categoryInsts =>
          categoryInsts.map(categoryInst => categoryInst.parent_id)
        );

      // 搜索商品所属分类的父类name与id
      const parentCategory = await ctx.service.api.category.list(
        { id: { [Op.in]: parentIds } },
        0,
        0,
        [],
        ["id", "name"],
        true
      );

      if (parentCategory && parentCategory.length > 0) {
        filterCategory = filterCategory.concat(parentCategory);
      }
    }

    // 添加指定搜索种类条件
    if (categoryId > 0) {
      // 获取指定种类的所有子分类id
      const filterCategoryId = await this.getCategoryWhereIn(categoryId);
      whereMap.category_id = { [Op.in]: filterCategoryId };
    }

    // 正式搜索商品
    const { count, rows } = await this.listAndCount(
      whereMap,
      page,
      size,
      orderMap,
      ["id", "name", "list_pic_url", "retail_price"],
      false
    );

    // 检查使用哪个过滤规则
    filterCategory.forEach(filter => {
      filter.checked =
        (!categoryId && filter.id === 0) || filter.id === categoryId;
    });

    return {
      count,
      totalPages: helper.pageTotal(count, size),
      pageSize: size,
      currentPage: page,
      data: rows,
      goodsList: rows,
      filterCategory
    };
  }

  /**
   * @description 查询指定分类id的子分类id
   * @param {number} parentId: 需要查找的父类id
   * @return {Promise<ICategoryInst[] | null>} childIds
   */
  getChildCategoryId = async parentId => {
    const childIds = await this.service.api.category.list(
      { parent_id: parentId },
      0,
      0,
      [],
      ["id"]
    );
    return childIds;
  };

  /**
   * @description 查询指定分类id的子类id以及包括了自身id的数组
   * @param {number} categoryId 需要查找的id
   * @returns {Promise<number[] | null>} childIds
   */
  getCategoryWhereIn = async categoryId => {
    const childIds = await this.getChildCategoryId(
      categoryId
    ).then(categoryInsts => categoryInsts.map(categoryInst => categoryInst.id));
    childIds.push(categoryId);
    return childIds;
  };

  async detail(goodId) {
    const { jwtSession } = this.ctx;
    const sapi = this.service.api;
    // 解构别名;
    const [
      info,
      gallery,
      attribute,
      issue,
      { count: commentCount, rows: hotComments }
    ] = await Promise.all([
      this.one(goodId),
      sapi.goodGallery.list({ goods_id: goodId }, 1, 4),
      sapi.goodAttribute.getGoodValues(goodId),
      // NOTE: 这个地方原项目中没有加 goods_id=goodId的查询，应该要加上才对
      sapi.goodIssue.list({ goods_id: goodId }),
      sapi.comment.listAndCount({ value_id: goodId, type_id: 0 })
    ]);
    // 查找商品品牌
    const brand = await sapi.brand.one(info.brand_id);

    // 查找评论用户信息
    let commentInfo = {};
    if (hotComments && hotComments.length > 0) {
      const [commentUser, picList] = await Promise.all([
        sapi.user.one(hotComments[0].user_id),
        sapi.commentPicture.list({ comment_id: hotComments[0].id })
      ]);
      commentInfo = {
        content: Buffer.from(hotComments[0].content, "base64").toString(),
        add_time: moment(hotComments[0].add_time * 1000).format(
          "YYYY-MM-DD hh:mm:ss"
        ), // hotComments[0].add_time * 1000
        nickname: commentUser && commentUser.nickname,
        avatar: commentUser && commentUser.avatar,
        pic_list: picList
      };
    }

    const comment = {
      count: commentCount,
      data: commentInfo
    };

    let userHasCollect = false;
    if (jwtSession) {
      // 当前用户是否收藏
      userHasCollect = await sapi.collect.isUserHasCollect(
        jwtSession.user_id,
        0,
        goodId
      );
      // 记录用户足迹
      await sapi.footprint.addFootprint(jwtSession.user_id, goodId);
    }

    // 查找商品规格信息
    const [specificationList, productList] = await Promise.all([
      this.getSpecificationList(goodId),
      this.getProductList(goodId)
    ]);

    return {
      info,
      gallery,
      attribute,
      userHasCollect,
      issue,
      comment,
      brand,
      specificationList,
      productList
    };
  }

  getSpecificationList = async goodsId => {
    const sapi = this.service.api;
    // 根据商品id信息，查找规格值列表
    const specificationRes = await sapi.goodSpecification.getGoodValues(
      goodsId
    );

    const specificationList = [];
    const hasSpecificationList = {};
    // 按规格名称分组
    for (const specItem of specificationRes) {
      if (!hasSpecificationList[specItem.specification_id]) {
        specificationList.push({
          specification_id: specItem.specification_id,
          // TODO: 这个地方需要检查数据结构
          name: specItem["name"],
          valueList: [specItem]
        });
        hasSpecificationList[specItem.specification_id] = specItem;
      } else {
        for (const specification of specificationList) {
          if (specification.specification_id === specItem.specification_id) {
            specification.valueList.push(specItem);
            break;
          }
        }
      }
    }

    return specificationList;
  };

  /**
   * @description 根据货物id查找具体商品信息
   * @param {number} goodsId 货物id
   * @returns {PromiseLike<IProductInst[]>} 商品具体列表
   */
  getProductList = goodsId => {
    return this.service.api.product.list({ goods_id: goodsId });
  };

  async relate(goodId) {
    const sapi = this.ctx.service.api;
    // 查找相关货物id
    const relatedGoodIds = await sapi.relatedGood.list(
      { id: goodId },
      0,
      0,
      [],
      ["related_goods_id"]
    );
    let relatedGoods = null;
    if (relatedGoodIds && relatedGoodIds.length > 0) {
      // 根据相关id查找相关货物
      relatedGoods = await this.list(
        { id: { [Op.in]: relatedGoodIds } },
        0,
        0,
        [],
        ["id", "name", "list_pic_url", "retail_price"]
      );
    } else {
      // 没有相关货物id，查找同种类的货物
      const goodInfo = await this.one(goodId);
      relatedGoods = await this.list(
        { category_id: goodInfo.category_id },
        1,
        8,
        [],
        ["id", "name", "list_pic_url", "retail_price"]
      );
    }
    return {
      goodsList: relatedGoods
    };
  }
}
module.exports = GoodService;
