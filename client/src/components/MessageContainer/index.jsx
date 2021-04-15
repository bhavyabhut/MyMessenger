import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const MessageContainer = ({ socket }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const [msg, setMsg] = useState();
  const [allMsg, setAllMsg] = useState([]);
  useEffect(() => {
    socket.on("msgReceived", (data) => {
      console.log("msgReceived", data);
      if (data.from == match.params.id) setAllMsg(data.data1);
    });
    socket.on("msgReceivedForMe", (data) => {
      console.log("msgReceivedForMe", data);
      setAllMsg(data.data1);
    });
    socket.on("get-all-msg-by-id-done", (data) => setAllMsg(data));
    socket.emit("get-all-msg-by-id", { id: match.params.id });
  }, []);
  console.log(history, match);
  const sendMsg = () => {
    socket.emit("sendMsg", { sendTo: match.params.id, msg });
  };
  useEffect(() => {
    socket.on("msgReceived", (data) => {
      console.log("msgReceived", data);
      if (data.from == match.params.id) setAllMsg(data.data1);
    });
    socket.emit("get-all-msg-by-id", { id: match.params.id });
  }, [match.params.id]);
  return (
    <div>
      {match.params.id}
      <div>
        <input value={msg} onChange={(e) => setMsg(e.target.value)}></input>
      </div>
      <button onClick={sendMsg}>Send</button>
      {allMsg.map((d) => (
        <>
          <li>
            {socket.id == d.id
              ? "Me"
              : match.params.id == d.id
              ? "Same vado"
              : "Khabr ny"}{" "}
            || {d.msg}
          </li>
        </>
      ))}
    </div>
  );
};

export default MessageContainer;
