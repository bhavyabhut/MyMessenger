const socketBasicEmitMethod = (socket, method, data) =>
  socket.emit(method, data);

const socketBasicBroadcastMethod = (socket, method, data) =>
  socket.broadcast.emit(method, data);

module.exports = { socketBasicBroadcastMethod, socketBasicEmitMethod };
