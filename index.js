const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server);
io.on("connection", (s) => {
  console.log(s);
});
server.listen("5000", () => {
  console.log("server is running on 5000");
});
