"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const apiPrefix = app.config.apiPrefix;

  const needLogin = app.role.can("login");

  router.get("/", controller.home.index);

  // router.get(apiPrefix + '/test', controller.home.test);

  // 商城首页
  router.get(apiPrefix + "/index/index", controller.api.index.index);

  // // 主题列表页
  // router.get(apiPrefix + '/topic/list', controller.topic.list);
  // // 主题详情页
  // router.get(apiPrefix + '/topic/detail', controller.topic.detail);
  // // 主题相关
  // router.get(apiPrefix + '/topic/related', controller.topic.relate);

  // // 评论列表
  // // 查询货物评论列表
  // router.get(apiPrefix + '/comment/list', controller.comment.list);
  // // 查询货物评论总数
  // router.get(apiPrefix + '/comment/count', controller.comment.count);
  // // 添加评论
  // router.post(apiPrefix + '/comment/post', needLogin, controller.comment.addPost);

  // 商品分类列表
  router.get(apiPrefix + "/catalog/index", controller.api.catalog.index);
  // 商品当前分类详情
  router.get(apiPrefix + '/catalog/current', controller.api.catalog.current);

  // 当前正在销售的货物总数
  router.get(apiPrefix + '/goods/count', controller.api.good.count);
  // 获取分类下的商品
  router.get(apiPrefix + '/goods/category', controller.api.good.category);
  // 搜索货物列表
  router.get(apiPrefix + '/goods/list', controller.api.good.list);
  // 货物详情
  router.get(apiPrefix + '/goods/detail', controller.api.good.detail); ;
  // 相关货物列表
  router.get(apiPrefix + '/goods/related', controller.api.good.relate);

  // 微信登录
  router.post(apiPrefix + '/auth/loginByWeixin', controller.api.auth.loginByWeChat);

  // 购物车相关
  // 购物车信息
  router.get(apiPrefix + '/cart/index', needLogin, controller.api.cart.index);
  // 添加商品到购物车
  router.post(apiPrefix + '/cart/add', needLogin, controller.api.cart.add);
  // 获取购物车商品的总件数
  router.get(apiPrefix + '/cart/goodscount', controller.api.cart.goodscount);
  // 更新购物车商品总数
  router.post(apiPrefix + '/cart/update', needLogin, controller.api.cart.update);
  // 删除购物车
  router.post(apiPrefix + '/cart/delete', needLogin, controller.api.cart.delete);
  // 下单前检查
  router.get(apiPrefix + '/cart/checkout', needLogin, controller.api.cart.checkout);
  // 选中或者剔除购物车内的货物
  router.post(apiPrefix + '/cart/checked', needLogin, controller.api.cart.checked);

  // 区域相关
  // 获取父区域id下的子区域列表
  router.get(apiPrefix + '/region/list', controller.api.region.listChildRegion);

  // 地址相关
  // 地址列表
  router.get(apiPrefix + '/address/list', needLogin, controller.api.address.list);
  // 地址详情
  router.get(apiPrefix + '/address/detail', needLogin, controller.api.address.detail);
  // 保存地址
  router.post(apiPrefix + '/address/save', needLogin, controller.api.address.save);
  // 删除地址
  router.post(apiPrefix + '/address/delete', needLogin, controller.api.address.deleteAddress);

  // 收藏相关接口
  // 显示用户收藏的所有货物
  router.get(apiPrefix + '/collect/list', needLogin, controller.api.collect.list);
  // 用户添加或者删除收藏
  router.post(apiPrefix + '/collect/addordelete', needLogin, controller.api.collect.addOrDelete);

  // 品牌相关
  router.get(apiPrefix + '/brand/detail', controller.api.brand.detail);
  router.get(apiPrefix + "/brand/list", controller.api.brand.list);

  // 搜索相关
  // 搜索历史与热门搜索
  router.get(apiPrefix + '/search/index', controller.api.search.index);
  // 实时搜索
  router.get(apiPrefix + '/search/helper', controller.api.search.helper);
  // 清除用户搜索历史
  router.post(apiPrefix + '/search/clearhistory', controller.api.search.clearHistory);

  // // 订单相关
  // // 查询订单列表
  // router.get(apiPrefix + '/order/list', needLogin, controller.order.list);
  // // 订单详情
  // router.get(apiPrefix + '/order/detail', controller.order.detail);
  // // 提交订单
  // router.post(apiPrefix + '/order/submit', controller.order.submit);
};
