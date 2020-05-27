require("dotenv").config();

const express = require("express");
const { createPool, checkConnection, log, listUsers, register, login } = require("./lib");

const pool = createPool();
if (!checkConnection()) {
  log("Problem connecting to the database.", err);
  pool.end();
  process.exit(1);
}

const server = express();
server.use(express.json());

server.get("/users", listUsers);
server.post("/register", register);
server.post("/login", login);

server.listen(8080);
