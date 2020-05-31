require("dotenv").config();

const express = require("express");
const { log, db, auth, users } = require("./lib");

if (!db.isConnected()) {
  log("Problem connecting to the database.");
  db.disconnect();
  process.exit(1);
}

const server = express();
server.use(express.json());

server.post("/register", auth.registerHandler);
server.post("/login", auth.loginHandler);
server.post("/token", auth.tokenHandler);
server.get("/logout", auth.tokenMiddleWare, auth.logoutHandler);

server.get("/users", auth.tokenMiddleWare, users.usersHandler);
server.get("/user", auth.tokenMiddleWare, users.userHandler);

server.listen(8080);
