const logModule = require("./log.js");
const authModule = require("./auth.js");
const dbModule = require("./db.js");

module.exports = {
  ...logModule,
  ...authModule,
  ...dbModule,
};
