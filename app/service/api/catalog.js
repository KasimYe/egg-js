const { Service } = require("egg");
class CatalogService extends Service {
  async list(id) {
    const { ctx } = this;
    const categories = ctx.service.api.category;
    const data = await categories.list({ parent_id: 0 }, 1, 10);
    let currentCategory = null;
    if (id) {
      currentCategory = await categories.one(id);
    } else {
      currentCategory = data[0];
    }
    if (currentCategory && currentCategory.id) {
      currentCategory.subCategoryList = await categories.list(
        { parent_id: currentCategory.id, is_show: 1 },
        1,
        100,
        [["sort_order", "ASC"]]
      );
    }
    return { categoryList: data, currentCategory: currentCategory };
  }

  async current(id) {
    const { ctx } = this;
    const categories = ctx.service.api.category;
    let currentCategory = await categories.one(id);
    currentCategory.subCategoryList = await categories.list(
      { parent_id: currentCategory.id, is_show: 1 },
      0,
      0,
      [["sort_order", "ASC"]]
    );
    return { currentCategory: currentCategory };
  }
}

module.exports = CatalogService;
