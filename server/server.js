require("dotenv").config();
const express = require("express");
const path = require("path");

const { log } = require("./lib/log.js");

const { db, auth, users, admin, quizzes, documents, vocabulary } = require("./lib");

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

server.post("/api/document", auth.tokenMiddleWare, documents.documentHandler);
server.get("/api/documents", auth.tokenMiddleWare, admin.usersHandler);
server.get("/api/handle-documents", auth.tokenMiddleWare, documents.dummyDataHandler);
server.post("/api/add-document", auth.tokenMiddleWare, documents.addDocument);
server.post("/api/delete-document", auth.tokenMiddleWare, documents.deleteDocument);

server.post("/api/update-vocabulary", auth.tokenMiddleWare, vocabulary.updateUserVocabHandler);

server.get("/api/admin/users", auth.tokenMiddleWare, admin.usersHandler);
server.post("/api/admin/delete-user", auth.tokenMiddleWare, admin.deleteUser);
server.post("/api/admin/revoke-token", auth.tokenMiddleWare, admin.revokeTokenHandler);
server.post("/api/admin/masquerade", auth.tokenMiddleWare, admin.masqueradeHandler);
server.get("/api/admin/end-masquerade", auth.tokenMiddleWare, admin.endMasqueradeHandler);

server.get("/api/quizzes", auth.tokenMiddleWare, quizzes.quizzesHandler);

// Handles any requests that don't match the ones above
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend_build", "index.html"));
});

const port = process.env.VOCTAIL_SERVER_PORT || 8080;
server.listen(port);
log("Listening on port " + port);
