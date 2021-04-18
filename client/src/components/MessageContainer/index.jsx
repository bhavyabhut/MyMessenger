import React, { useState, useEffect, useRef } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { SendOutlined } from "@ant-design/icons";
import SeenTick from "../SeenTick";
import { Input, Button, notification, Menu, Dropdown } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import Scrollbar from "react-smooth-scrollbar";
import Avatar from "react-avatar";

const initialNotification = {
  isNotify: false,
  msg: "",
  type: "",
};

const MessageContainer = ({ socket, allUsers }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const [msg, setMsg] = useState();
  const [allMsg, setAllMsg] = useState([]);
  const [notificationState, setNotification] = useState(initialNotification);
  const [theme, setTheme] = useState("white");

  const messageEl = useRef();

  const msgReceived = (data) => {
    console.log("msgReceived", data);
    if (data.from == match.params.id) setAllMsg(data.data);
    if (data.isSeenRequired && match.params.id)
      socket.emit("seen-msg", { id: match.params.id });
  };

  useEffect(() => {
    socket.on("msgReceived", msgReceived);
    socket.on("msgReceivedForMe", (data) => {
      console.log("msgReceivedForMe", data);
      setAllMsg(data.data);
    });
    socket.on("get-all-msg-by-id-done", (data) => setAllMsg(data));
    if (match.params.id) {
      socket.emit("get-all-msg-by-id", { id: match.params.id });
      socket.emit("seen-msg", { id: match.params.id });
    }

    return () => {
      console.log("sache thay che ke ny use effect ma");
      socket.removeListener("msgReceived", msgReceived);
      socket.off("msgReceived", msgReceived);
    };
  }, [match.params.id]);
  const showNotification = (newType, msg) => {
    let type = "";
    if (newType === 0) type = "success";
    if (newType === 1) type = "error";
    setNotification({ isNotify: true, msg, type });
  };

  useEffect(() => {
    console.log("hu thavu joy", allUsers);
    if (allUsers && allUsers.length > 0) {
      let a = allUsers.filter((user) => user.id == match.params.id);
      if (a.length === 0) history.push("/userLeft");
    }
  }, [allUsers]);
  useEffect(() => {
    if (notificationState.isNotify) {
      notification.open({
        message: notificationState.type === "success" ? "Success" : "Error",
        description: notificationState.msg,
        type: notificationState.type,
      });
      setNotification(initialNotification);
    }
  }, [notificationState.isNotify]);
  const sendMsg = () => {
    if (!msg || msg.trim() === "") {
      showNotification(1, "Please enter proper message");
      return;
    }
    socket.emit("sendMsg", { sendTo: match.params.id, msg });
    setMsg("");
  };

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  const changeTheme = (e) => {
    console.log(e.key, e.domEvent.target.id);
    if (e.key === "item_0") setTheme("white");
    if (e.key === "item_1") setTheme("yellow");
    if (e.key === "item_2") setTheme("pink");
    if (e.key === "item_3") setTheme("love");
  };

  const menu = (
    <Menu onClick={changeTheme}>
      <Menu.Item id="white">
        {/* <Avatar textSizeRatio={2} size="32" round color="white" /> */}
        <span style={{ marginLeft: "5px" }}>White</span>
      </Menu.Item>
      <Menu.Item id="yellow">
        {/* <Avatar textSizeRatio={2} size="32" round color="blue" /> */}
        <span style={{ marginLeft: "5px" }}>Yellow</span>
      </Menu.Item>
      <Menu.Item id="pink">
        {/* <Avatar textSizeRatio={2} size="32" round color="pink" /> */}
        <span style={{ marginLeft: "5px" }}>Pink</span>
      </Menu.Item>
      <Menu.Item id="love">
        {/* <Avatar textSizeRatio={2} size="32" round color="lightpink" /> */}
        <span style={{ marginLeft: "5px" }}>Love</span>
      </Menu.Item>
    </Menu>
  );

  // background: url("./image/Whatsapp-Wallpaper-022.jpg") center no-repeat;

  return (
    <div
      className="chatImage"
      style={{
        height: "100%",
        // backgroundColor: "white",
        backgroundImage: `url("/image/${theme}.jpg")`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="chat">
        <div className="messages" ref={messageEl}>
          {allMsg &&
            allMsg.map((d) => {
              let width = 30;
              if (d.msg.length > 40) width = width + (d.msg.length - 40) / 20;
              if (width > 70) width = 70;
              return (
                <>
                  <p
                    style={{ width: `${width}%` }}
                    className={`msg${socket.id == d.id ? " dark" : ""}`}
                  >
                    {/* <div></div> */}
                    <span
                      style={{
                        color: `${socket.id == d.id ? "white" : "black"}`,
                        fontSize: "1rem",
                      }}
                    >
                      {d.msg}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: `${
                          socket.id == d.id ? "flex-end" : "flex-start"
                        }`,
                        fontSize: "0.8rem",
                      }}
                    >
                      <span
                        style={{
                          color: `${socket.id == d.id ? "#58a9f5" : "white"}`,
                        }}
                      >
                        {new Date(d.time)
                          .toUTCString()
                          .slice(0, new Date(d.time).toUTCString().length - 3)}
                      </span>
                      <span style={{ marginLeft: "0.5rem" }}>
                        {d.id == socket.id ? (
                          <SeenTick isSeen={d.seen} />
                        ) : null}
                      </span>
                    </div>
                  </p>
                </>
              );
            })}
        </div>
        <div className="footer">
          <div style={{ marginRight: "1rem " }}>
            <Dropdown overlay={menu} placement="topCenter">
              <Button>Change Theme</Button>
            </Dropdown>
          </div>
          <Input
            placeholder="Type something..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="sendInput"
          />
          <Button
            type="primary"
            shape="round"
            onClick={sendMsg}
            className="sendButton"
          >
            Send
            <SendOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
