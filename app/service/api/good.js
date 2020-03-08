const BaseService = require("../base");
const { Op } = require("sequelize");
const helper = require("../../extend/helper");

class GoodService extends BaseService {
  constructor(app) {
    super("Good", app);
  }

  async count() {
    const { ctx } = this;
    return await ctx.model.Good.count();
  }

  async category(id) {
    const { ctx } = this;
    const category = ctx.service.api.categories;
    const currentCategory = await category.one(id);
    const parentCategory = await category.one(currentCategory.parent_id);
    const brotherCategory = await category.list(
      { parent_id: currentCategory.parent_id, is_show: 1 },
      1,
      100,
      [["sort_order", "ASC"]]
    );

    return {
      currentCategory: currentCategory,
      parentCategory: parentCategory,
      brotherCategory: brotherCategory
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
    const categoryIds = await ctx.service.api.goods
      .list(whereMap, 0, 0, orderMap, ["category_id"], true)
      .then(categoryInsts =>
        categoryInsts.map(categoryInst => categoryInst.category_id)
      );

    if (categoryIds && categoryIds.length > 0) {
      // 商品所属分类的父类id
      const parentIds = await ctx.service.api.categories
        .list({ id: { [Op.in]: categoryIds } }, 0, 0, [], ["parent_id"], true)
        .then(categoryInsts =>
          categoryInsts.map(categoryInst => categoryInst.parent_id)
        );

      // 搜索商品所属分类的父类name与id
      const parentCategory = await ctx.service.api.categories.list(
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
      const filterCategoryId = await ctx.service.api.categories.getCategoryWhereIn(
        categoryId
      );
      whereMap.category_id = { [Op.in]: filterCategoryId };
    }

    // 正式搜索商品
    const { count, rows } = await ctx.service.api.goods.listAndCount(
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
}
module.exports = GoodService;
