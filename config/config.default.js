/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1583664552114_9323";

  // 微信配置
  config.wechat = {
    appid: "wx53d3600d66f0fe90",
    secret: "cb5a135ceb3105716df122af9f1429ff",
    mch_id: "",
    partner_key: "",
    notify_url: ""
  };

  // add your config here
  config.middleware = ["jwtSession", "responseHandler"];

  // 为中间件过滤请求
  config.responseHandler = {
    enable: true,
    match: [/\/api\//]
  };

  // 为jwt中间件设置config
  config.jwtSession = {
    enable: true,
    match: [/\/api\//],
    tokenHeader: "X-Nideshop-Token",
    secret: "SLDLKKDS323ssdd@#@@gf"
  };

  config.security = {
    csrf: {
      enable: false
    }
  };

  // config.cluster = {
  //   listen: {
  //     path: "",
  //     port: 7002,
  //     hostname: "127.0.0.1"
  //   }
  // };

  config.sequelize = {
    dialect: "mysql",
    host: "127.0.0.1",
    port: 3306,
    database: "nideshop",
    username: "root",
    password: "BRYY@abc123"
  };
  config.tablePrefix = "nideshop_";
  config.apiPrefix = "/api";

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig
  };
};
