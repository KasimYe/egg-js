/*
 * @Author: qiao
 * @Date: 2018-07-17 15:00:44
 * @Last Modified by: qiao
 * @Last Modified time: 2018-07-17 19:26:00
 * egg-userrole插件配置文件
 */
const { StatusError } = require("../entity/status_error");
module.exports = app => {
  app.role.failureHandler = () => {
    throw new StatusError(
      "需要先登录！",
      StatusError.StatusError.ERROR_STATUS.PERMISSION_ERROR
    );
  };

  app.role.use("login", ctx => {
    const { jwtSession } = ctx;
    // if (app.env === "unittest") {
    //   ctx.jwtSession = {
    //     user_id: 1,
    //     session_key: "123",
    //     openid: "123",
    //     iat: 1
    //   };
    //   return true;
    // }

    if (jwtSession && jwtSession.user_id) {
      return true;
    } else {
      return false;
    }
  });
};
