const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});

let users = [];

const socketBasicEmitMethod = (socket, method, data) =>
  socket.emit(method, data);

const socketBasicBroadcastMethod = (socket, method, data) =>
  socket.broadcast.emit(method, data);

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  socket.on("login", (data) => {
    if (Object.keys(data).length === 0) {
      socketBasicEmitMethod(socket, "login_error", "Please enter name");
      return;
    }
    if (!data.name) {
      socketBasicEmitMethod(socket, "login_error", "Please enter name");
      return;
    }

    const matchUser = users.filter((user) => user.name === data.name);

    if (matchUser.length > 0) {
      socketBasicEmitMethod(
        socket,
        "login_error",
        "Name is already in use! Please enter a new name"
      );
      return;
    }
    users.push({ ...data, id: socket.id });
    socketBasicEmitMethod(socket, "login_success", {
      myData: { ...data, id: socket.id },
      allUser: users,
    });
    socketBasicBroadcastMethod(socket, "new_user", users);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.to(data.id).emit("getData", data);
  });

  socket.on("disconnect", (data) => {
    console.log(data, socket.id);
    let newUser = users.filter((user) => user.id !== socket.id);
    users = [...newUser];
    socketBasicBroadcastMethod(socket, "new_user", users);
  });
});

server.listen("5000", () => {
  console.log("server is running o 5000");
});
