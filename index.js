// let users = [];

// let chats = {};

const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const app = express();

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

app.get("/data", (req, res) => {
  res.json({ chats, users });
});

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  login(socket, io);
  getAllUsers(socket, io);
  seenMsg(socket, io);
  message(socket, io);
  sendMsg(socket, io);
  getAllMsgById(socket, io);
  disconnected(socket, io);

  // socket.on("login", (data) => {
  //   if (Object.keys(data).length === 0) {
  //     socketBasicEmitMethod(socket, "login_error", "Please enter name");
  //     return;
  //   }
  //   if (!data.name) {
  //     socketBasicEmitMethod(socket, "login_error", "Please enter name");
  //     return;
  //   }

  //   const matchUser = users.filter((user) => user.name === data.name);

  //   if (matchUser.length > 0) {
  //     socketBasicEmitMethod(
  //       socket,
  //       "login_error",
  //       "Name is already in use! Please enter a new name"
  //     );
  //     return;
  //   }
  //   users.push({ ...data, id: socket.id, isLogin: true });
  //   chats[socket.id] = {};
  //   socketBasicEmitMethod(socket, "login_success", {
  //     myData: { ...data, id: socket.id, isLogin: true },
  //     allUser: users,
  //   });
  //   socketBasicBroadcastMethod(socket, "new_user", users);
  // });

  // socket.on("get-all-users", (data) => {
  //   console.log("socket", socket.id, "get", data);
  //   const user = users.filter((user) => user.id === socket.id);
  //   if (!user) {
  //     socketBasicEmitMethod(socket, "get-all-users-done", {
  //       success: false,
  //       msg: "No User Found",
  //     });
  //     return;
  //   }
  //   if (user && user.length === 0) {
  //     socketBasicEmitMethod(socket, "get-all-users-done", {
  //       success: false,
  //       msg: "No User Found",
  //     });
  //     return;
  //   }
  //   if (!user[0].isLogin) {
  //     socketBasicEmitMethod(socket, "get-all-users-done", {
  //       success: false,
  //       msg: "User not login",
  //     });
  //     return;
  //   }

  //   socketBasicEmitMethod(socket, "get-all-users-done", {
  //     success: true,
  //     data: users,
  //   });
  // });

  // socket.on("seen-msg", (data) => {
  //   console.log(data, chats);
  //   if (!data.id) return;
  //   if (chats[data.id] && chats[data.id][socket.id]) {
  //     chats[data.id][socket.id] = chats[data.id][socket.id].map((d) => {
  //       if (d.id == socket.id) {
  //         return { ...d, seen: true };
  //       }
  //       return d;
  //     });
  //     socketBasicEmitMethod(socket, "msgReceivedForMe", {
  //       from: data.id,
  //       // msg: data.msg,
  //       data: chats[socket.id][data.id],
  //       data2: chats[data.id][socket.id],
  //     });
  //     io.sockets.to(data.id).emit("msgReceived", {
  //       from: data.id,
  //       // msg: data.msg,
  //       data: chats[socket.id][data.id],
  //       data2: chats[data.id][socket.id],
  //     });
  //   }
  // });

  // socket.on("message", (data) => {
  //   console.log(data);
  //   socket.broadcast.to(data.id).emit("getData", data);
  // });

  // socket.on("sendMsg", (data) => {
  //   console.log(data);
  //   let time = new Date().toGMTString();

  //   let myMsg = { id: socket.id, msg: data.msg, time, seen: false };
  //   // let yourMsg = { id: socket.id, msg: data.msg, time, seen: false };

  //   // let yourMsg = { id: data.sendTo, msg: data.msg, time, seen: false };

  //   if (chats[socket.id] && chats[socket.id][data.sendTo]) {
  //     chats[socket.id][data.sendTo].push(myMsg);
  //   } else {
  //     chats[socket.id][data.sendTo] = [myMsg];
  //   }
  //   if (chats[data.sendTo] && chats[data.sendTo][socket.id]) {
  //     chats[data.sendTo][socket.id].push(myMsg);
  //   } else {
  //     chats[data.sendTo][socket.id] = [myMsg];
  //   }
  //   socketBasicEmitMethod(socket, "msgReceivedForMe", {
  //     from: socket.id,
  //     // msg: data.msg,
  //     data: chats[socket.id][data.sendTo],
  //     data2: chats[data.sendTo][socket.id],
  //   });
  //   io.sockets.to(data.sendTo).emit("msgReceived", {
  //     from: socket.id,
  //     // msg: data.msg,
  //     data: chats[socket.id][data.sendTo],
  //     data2: chats[data.sendTo][socket.id],
  //   });
  // });

  // socket.on("get-all-msg-by-id", (data) => {
  //   console.log("get-all-msg-by-id", data);
  //   let msg = [];
  //   if (chats && chats[socket.id] && chats[socket.id][data.id]) {
  //     msg = chats[socket.id][data.id];
  //   }
  //   socketBasicEmitMethod(socket, "get-all-msg-by-id-done", msg);
  //   // io.sockets.to(data.sendTo).emit("msgReceived", {
  //   //   from: socket.id,
  //   //   msg: data.msg,
  //   // });
  // });

  // socket.on("disconnect", (data) => {
  //   console.log(data, socket.id);
  //   let newUser = users.filter((user) => user.id !== socket.id);
  //   users = [...newUser];
  //   socketBasicBroadcastMethod(socket, "new_user", users);
  // });
});

server.listen("5000", () => {
  console.log("server is running o 5000");
});
