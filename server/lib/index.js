const log = require("./log.js");
const db = require("./db.js");
const auth = require("./auth.js");
const users = require("./users.js");
const validation = require("./validation.js");
const admin = require("./admin.js");
const quizzes = require("./quizzes.js");
const documents = require("./documents.js");
const vocabulary = require("./vocabulary.js");

module.exports = {
  log,
  db,
  auth,
  users,
  validation,
  admin,
  quizzes,
  documents,
  vocabulary,
};
