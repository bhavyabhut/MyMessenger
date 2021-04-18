import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import style from "./login.module.css";
import io from "socket.io-client";
import { Input, Button, notification } from "antd";
import { UnlockOutlined } from "@ant-design/icons";
import { ReactComponent as Logo1 } from "../../image/upDraw/undraw_Bookmarks_re_mq1u.svg";
import { ReactComponent as Logo2 } from "../../image/upDraw/undraw_Connected_re_lmq2.svg";
import { ReactComponent as Logo3 } from "../../image/upDraw/undraw_Like_dislike_re_dwcj.svg";
import { ReactComponent as Logo4 } from "../../image/upDraw/undraw_Sign_in_re_o58h.svg";
import { ReactComponent as Logo5 } from "../../image/upDraw/undraw_Social_growth_re_tjy9.svg";
import { ReactComponent as Logo6 } from "../../image/upDraw/undraw_Traveling_re_weve.svg";
import { ReactComponent as Logo7 } from "../../image/upDraw/undraw_Video_streaming_re_v3qg.svg";
import { ReactComponent as Logo8 } from "../../image/upDraw/undraw_well_done_i2wr.svg";

// const socket = io("http://localhost:5000", {
//   transports: ["websocket", "polling"],
// });

const initialNotification = {
  isNotify: false,
  msg: "",
  type: "",
};

// 0 for success
// 1 for error

function Login({ isSocketConnected, socket }) {
  const [msg, setMsg] = useState();
  const [id, setId] = useState();
  const [myData, setMyData] = useState();
  const [allUsers, setAllUsers] = useState();
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const [notificationState, setNotification] = useState(initialNotification);

  const showNotification = (newType, msg) => {
    let type = "";
    if (newType === 0) type = "success";
    if (newType === 1) type = "error";
    setNotification({ isNotify: true, msg, type });
  };

  useEffect(() => {
    // socket.on("getData", (data) => console.log(data));
    socket.on("login_error", (data) => {
      console.log("ogin_error", data);
      setLoading(false);
      showNotification(1, data);
    });
    // socket.on("new_user", (data) => setAllUsers(data));
    socket.on("login_success", (data) => {
      setLoading(false);
      // setMyData(data.myData);
      // setAllUsers(data.allUser);
      // console.log(data);
      showNotification(0, "Success full Join");
      history.push("/app");
    });
  }, []);
  const submit = () => {
    if (!isSocketConnected) {
      showNotification(1, "Socket is not connected!");
      return;
    }
    setLoading(true);
    socket.emit("login", { name });
  };

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

  return (
    <div className={style.loginPage}>
      <div className={style.loginImage}>
        <Logo1 className={style.loginLogo} />
        <Logo2 className={style.loginLogo} />
        <Logo3 className={style.loginLogo} />
        <Logo4 className={style.loginLogo} />
      </div>
      <div className={style.loginInput}>
        <div className={style.loginNameBox}>
          {/* <strong style={{ marginBottom: "0.5rem" }}>Name :</strong> */}
          <Input
            placeholder="John doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button
            loading={loading}
            icon={<UnlockOutlined />}
            shape="round"
            type="primary"
            onClick={submit}
            style={{ marginTop: "1.5rem", width: "50%" }}
          >
            Join!
          </Button>
        </div>
      </div>
      <div className={style.loginImage}>
        <Logo5 className={style.loginLogo} />
        <Logo6 className={style.loginLogo} />

        <Logo7 className={style.loginLogo} />
        <Logo8 className={style.loginLogo} />
      </div>
    </div>
  );
}

export default Login;
