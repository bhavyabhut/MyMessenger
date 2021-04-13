import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import io from "socket.io-client";
import Login from "../components/Login";
import NoPageFound from "../components/NoPageFound";

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
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route>
          <NoPageFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
