const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv").config();
const app = express();
const path = require("path");
const {
  login,
  seenMsg,
  sendMsg,
  disconnected,
  message,
  getAllMsgById,
  getAllUsers,
  chats,
  users,
} = require("./helper/socket/socketFunction");

app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});

if (process.env.NODE_ENV === "production") {
  console.log("ha");
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

io.on("connection", (socket) => {
  console.log("client connected", socket.id);
  login(socket, io);
  getAllUsers(socket, io);
  seenMsg(socket, io);
  message(socket, io);
  sendMsg(socket, io);
  getAllMsgById(socket, io);
  disconnected(socket, io);
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
