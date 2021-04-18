let users = [];

let chats = {};

const fs = require("fs");

const {
  socketBasicBroadcastMethod,
  socketBasicEmitMethod,
} = require("./index.js");

const methods = require("../../config/socketMethodConst");

const login = (socket, io) => {
  socket.on(methods.login, (data) => {
    if (Object.keys(data).length === 0) {
      socketBasicEmitMethod(socket, methods.login_error, "Please enter name");
      return;
    }
    if (!data.name) {
      socketBasicEmitMethod(socket, methods.login_error, "Please enter name");
      return;
    }

    const matchUser = users.filter((user) => user.name === data.name);

    if (matchUser.length > 0) {
      socketBasicEmitMethod(
        socket,
        methods.login_error,
        "Name is already in use! Please enter a new name"
      );
      return;
    }

    users.push({
      ...data,
      id: socket.id,
      isLogin: true,
      totalUnreadMessage: {},
    });
    chats[socket.id] = {};
    socketBasicEmitMethod(socket, methods.login_success, {
      myData: { ...data, id: socket.id, isLogin: true },
      allUser: users,
    });
    socketBasicBroadcastMethod(socket, methods.new_user, users);
  });
};

const getAllUsers = (socket, io) => {
  socket.on(methods.getAllUsers, (data) => {
    console.log("socket", socket.id, "get", data);
    const user = users.filter((user) => user.id === socket.id);
    if (!user) {
      socketBasicEmitMethod(socket, methods.getAllUsersDone, {
        success: false,
        msg: "No User Found",
      });
      return;
    }
    if (user && user.length === 0) {
      socketBasicEmitMethod(socket, methods.getAllUsersDone, {
        success: false,
        msg: "No User Found",
      });
      return;
    }
    if (!user[0].isLogin) {
      socketBasicEmitMethod(socket, methods.getAllUsersDone, {
        success: false,
        msg: "User not login",
      });
      return;
    }

    socketBasicEmitMethod(socket, methods.getAllUsersDone, {
      success: true,
      data: users,
    });
  });
};

const seenMsg = (socket, io) => {
  socket.on(methods.seenMsg, (data) => {
    console.log(methods.seenMsg, data, chats, socket.id);
    if (!data.id) return;
    if (chats[data.id]) {
      console.log(methods.seenMsg, chats[data.id][socket.id]);
      if (chats[data.id][socket.id])
        chats[data.id][socket.id] = chats[data.id][socket.id].map((d) => {
          if (d.id == data.id) {
            return { ...d, seen: true };
          }
          return d;
        });
      // chats[socket.id][data.id] = chats[socket.id][data.id]?.map((d) => {
      //   if (d.id == socket.id) {
      //     return { ...d, seen: true };
      //     console.log("may be thase j ny");
      //   }
      //   return d;
      // });
      // socketBasicEmitMethod(socket, methods.messageReceivedForMe, {
      //   from: socket.id,
      //   data: chats[socket.id][data.id],
      // });

      io.sockets.to(data.id).emit(methods.messageReceived, {
        from: socket.id,
        data: chats[data.id][socket.id],
        isSeenRequired: false,
      });
    }

    users.map((u) => {
      if (u.id == socket.id) {
        if (u.totalUnreadMessage && u.totalUnreadMessage[data.id])
          u.totalUnreadMessage[data.id] = 0;
      }
    });
    io.sockets.to(socket.id).emit(methods.new_user, users);
  });
};

const message = (socket, io) => {
  socket.on(methods.message, (data) => {
    console.log(data);
    socket.broadcast.to(data.id).emit(methods.getData, data);
  });
};

const sendMsg = (socket, io) => {
  socket.on(methods.sendMessage, (data) => {
    console.log(data);
    let time = new Date().toUTCString();

    let myMsg = { id: socket.id, msg: data.msg, time, seen: false };
    let yourMsg = { id: socket.id, msg: data.msg, time };

    // let yourMsg = { id: data.sendTo, msg: data.msg, time, seen: false };

    if (chats[socket.id]) {
      if (chats[socket.id][data.sendTo])
        chats[socket.id][data.sendTo].push(myMsg);
      else chats[socket.id][data.sendTo] = [myMsg];
    }
    if (chats[data.sendTo]) {
      if (chats[data.sendTo][socket.id])
        chats[data.sendTo][socket.id].push(yourMsg);
      else chats[data.sendTo][socket.id] = [yourMsg];
    }
    let data1 = [];
    let data2 = [];
    if (chats[socket.id] && chats[socket.id][data.sendTo])
      data1 = chats[socket.id][data.sendTo];
    if (chats[data.sendTo] && chats[data.sendTo][socket.id])
      data2 = chats[data.sendTo][socket.id];
    socketBasicEmitMethod(socket, methods.messageReceivedForMe, {
      from: socket.id,
      data: data1,
    });
    io.sockets.to(data.sendTo).emit(methods.messageReceived, {
      from: socket.id,
      data: data2,
      isSeenRequired: true,
    });
    // let newUsers = [...users];
    // let [myUser] = newUsers.filter((u) => u.id == socket.id);
    // if (myUser && myUser.totalUnreadMessage) {
    //   if (myUser.totalUnreadMessage[data.sendTo]) {
    //     myUser.totalUnreadMessage[data.sendTo] =
    //       myUser.totalUnreadMessage[data.sendTo] + 1;
    //   } else {
    //     myUser.totalUnreadMessage[data.sendTo] = 1;
    //   }
    // }

    const a = users.map((u) => {
      if (u.id == data.sendTo && u.totalUnreadMessage) {
        if (u.totalUnreadMessage[socket.id]) {
          u.totalUnreadMessage[socket.id] = u.totalUnreadMessage[socket.id] + 1;
        } else {
          u.totalUnreadMessage[socket.id] = 1;
        }
        return u;
      }
      return u;
    });
    // fs.writeFileSync("user.json", JSON.stringify(a));
    console.log(a, "ha moj", users);
    io.sockets.to(data.sendTo).emit(methods.new_user, users);
  });
};

const getAllMsgById = (socket, io) => {
  socket.on(methods.getAllMessageById, (data) => {
    console.log(methods.getAllMessageById, data);
    let msg = [];
    if (chats && chats[socket.id] && chats[socket.id][data.id]) {
      msg = chats[socket.id][data.id];
    }
    socketBasicEmitMethod(socket, methods.getAllMessageByIdDone, msg);
  });
};

const disconnected = (socket, io) => {
  socket.on(methods.disconnect, (data) => {
    console.log(data, socket.id);
    let newUser = users.filter((user) => user.id != socket.id);
    users = [...newUser];
    chats = Object.keys(chats)
      .filter((key) => key !== socket.id)
      .reduce((obj, key) => {
        obj[key] = chats[key];
        return obj;
      }, {});
    for (let [key, value] of Object.entries(chats)) {
      console.log(key, value, "bar");
      for (let [key2, value2] of Object.entries(chats[key])) {
        console.log(key2, value2, "andr");
        if (chats[key][socket.id]) delete chats[key][socket.id];
      }
    }
    console.log("new User dus", newUser, chats);
    socketBasicBroadcastMethod(socket, methods.new_user, users);
  });
};

module.exports = {
  login,
  getAllUsers,
  seenMsg,
  sendMsg,
  message,
  getAllMsgById,
  disconnected,
  users,
  chats,
};
