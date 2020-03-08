"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sequelize: {
    enable: true,
    package: "egg-sequelize"
  },

  validate: {
    package: "egg-validate"
  },

  userrole: {
    package: "egg-userrole"
  }
};
