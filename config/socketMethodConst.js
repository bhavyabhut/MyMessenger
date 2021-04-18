const socketMethod = {
  login: "login",
  login_error: "login_error",
  login_success: "login_success",
  new_user: "new_user",
  getAllUsers: "get-all-users",
  getAllUsersDone: "get-all-users-done",
  seenMsg: "seen-msg",
  messageReceivedForMe: "msgReceivedForMe",
  messageReceived: "msgReceived",
  message: "message",
  getData: "getData",
  sendMessage: "sendMsg",
  getAllMessageById: "get-all-msg-by-id",
  getAllMessageByIdDone: "get-all-msg-by-id-done",
  disconnect: "disconnect",
};

module.exports = socketMethod;
