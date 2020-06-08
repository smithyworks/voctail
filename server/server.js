require("dotenv").config();
const express = require("express");
const path = require("path");

const { log } = require("./lib/log.js");
const { db, auth, users, admin } = require("./lib");

db.checkConnection((connected) => {
  if (connected) log("Connected to the Database!");
  else {
    log("Problem connecting to the database.");
    db.disconnect();
    process.exit(1);
  }
});

const server = express();
server.use(express.json());
// Serve the static files from the React app
server.use(express.static(path.join(__dirname + "/frontend_build")));

server.get("/api/test", (req, res) => res.status(200).send("Server is online!"));

server.post("/api/register", auth.registerHandler);
server.post("/api/login", auth.loginHandler);
server.post("/api/token", auth.tokenHandler);
server.get("/api/logout", auth.tokenMiddleWare, auth.logoutHandler);

server.get("/api/user", auth.tokenMiddleWare, users.userHandler);

server.get("/api/admin/users", auth.tokenMiddleWare, admin.usersHandler);

// Handles any requests that don't match the ones above
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend_build", "index.html"));
});

const port = process.env.PORT || 8080;
server.listen(port);
log("Listening on port " + port);
