import logo from "./logo.svg";
import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

function App() {
  const [msg, setMsg] = useState();
  const [id, setId] = useState();
  const [myData, setMyData] = useState();
  const [allUsers, setAllUsers] = useState();

  // useEffect(() => {
  //   getData();
  // }, [videoRef]);

  useEffect(() => {
    socket.on("getData", (data) => console.log(data));
    socket.on("login_error", (data) => console.log(data));
    socket.on("new_user", (data) => setAllUsers(data));
    socket.on("login_success", (data) => {
      setMyData(data.myData);
      setAllUsers(data.allUser);
    });
  }, []);
  const submit = () => {
    socket.emit("login", { name: id });
  };
  return (
    <>
      {myData ? (
        <>
          <h2>Welcome {myData.name}</h2>

          {allUsers &&
            allUsers.length > 0 &&
            allUsers
              .filter((d) => d.id !== myData.id)
              .map((user) => {
                return (
                  <>
                    <li>{user.name}</li>
                  </>
                );
              })}
        </>
      ) : (
        <>
          <input
            value={id}
            type="text"
            onChange={(e) => {
              setId(e.target.value);
            }}
          ></input>
          <input
            value={msg}
            type="text"
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          ></input>

          <button onClick={submit}> Submit</button>
        </>
      )}
    </>
  );
}

export default App;

const a = "name";

const person = {
  [a]: "sdfsdf",
};
