"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatusError extends Error {
    constructor(message, status = StatusError.StatusError.ERROR_STATUS.SERVER_ERROR) {
        super(message);
        this.status = status;
    }
}
exports.StatusError = StatusError;
StatusError.ERROR_STATUS = {
    // 服务器错误
    SERVER_ERROR: -1,
    // 请求参数错误
    REQUEST_PARAMS_ERROR: -2,
    // 会话过期
    SESSION_EXPIRED: 401,
    // 数据错误（数据库数据缺失等）
    DATA_ERROR: -4,
    // 权限不足
    PERMISSION_ERROR: -5,
};
//# sourceMappingURL=helper.js.map