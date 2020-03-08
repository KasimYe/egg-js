const BaseService = require("../base");

class ChannelService extends BaseService {
  constructor(app) {
    super("Channel", app);
  }
}
module.exports = ChannelService;
