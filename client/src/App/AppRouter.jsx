import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import io from "socket.io-client";
import Login from "../components/Login";
import App from "./index";
import NoPageFound from "../components/NoPageFound";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

const initialNotification = {
  isNotify: false,
  msg: "",
  type: "",
};

function AppRouter() {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [notificationState, setNotification] = useState(initialNotification);

  const showNotification = (newType, msg) => {
    let type = "";
    if (newType === 0) type = "success";
    if (newType === 1) type = "error";
    setNotification({ isNotify: true, msg, type });
  };

  useEffect(() => {
    if (socket.connected) {
      setIsSocketConnected(true);
    }
    if (!socket.connected) {
      showNotification(1, "Network Error");
      setIsSocketConnected(false);
    }

    socket.on("connect", () => {
      setIsSocketConnected(true);
    });
    socket.on("disconnect", (data) => {
      console.log("aaaaaaaaaaaaa", data);
      setIsSocketConnected(false);
      showNotification(1, "Opps! Socket disconnected");
    });

    // socket.on("reconnect", () => {
    //   //Your Code Here
    //   console.log("reconnected");
    // });
  }, []);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login isSocketConnected={isSocketConnected} socket={socket} />
        </Route>
        <Route exact path="/login">
          <Login isSocketConnected={isSocketConnected} socket={socket} />
        </Route>
        <Route path="/app">
          <App isSocketConnected={isSocketConnected} socket={socket} />
        </Route>
        <Route>
          <NoPageFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default AppRouter;
