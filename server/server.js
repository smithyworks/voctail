require("dotenv").config();

const express = require("express");
const { log, db, jwt, auth } = require("./lib");

if (!db.isConnected()) {
  log("Problem connecting to the database.");
  db.disconnect();
  process.exit(1);
}

const server = express();
server.use(express.json());

server.get("/users", jwt.verifyToken, auth.listUsers);
server.post("/register", auth.register);
server.post("/login", auth.login);
server.get("/logout", jwt.verifyToken, auth.logout);
server.post("/token", jwt.token);

server.listen(8080);
