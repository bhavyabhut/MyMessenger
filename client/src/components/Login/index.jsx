import React, { useEffect, useState, useRef } from "react";
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

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

const initialNotification = {
  isNotify: false,
  msg: "",
  type: "",
};

function Login() {
  const [msg, setMsg] = useState();
  const [id, setId] = useState();
  const [myData, setMyData] = useState();
  const [allUsers, setAllUsers] = useState();
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  const [notificationState, setNotification] = useState(initialNotification);

  useEffect(() => {
    socket.on("getData", (data) => console.log(data));
    socket.on("login_error", (data) => {
      console.log(data);
      setLoading(false);
      setNotification({
        isNotify: true,
        msg: data,
        type: "error",
      });
    });
    socket.on("new_user", (data) => setAllUsers(data));
    socket.on("login_success", (data) => {
      setLoading(false);

      setMyData(data.myData);
      setAllUsers(data.allUser);
      console.log(data);
      setNotification({
        isNotify: true,
        msg: "Success full Join ",
        type: "success",
      });
    });
  }, []);
  const submit = () => {
    setLoading(true);
    socket.emit("login", { name });
  };

  // return (
  //   <>
  //     {myData ? (
  //       <>
  //         <h2>Welcome {myData.name}</h2>

  //         {allUsers &&
  //           allUsers.length > 0 &&
  //           allUsers
  //             .filter((d) => d.id !== myData.id)
  //             .map((user) => {
  //               return (
  //                 <>
  //                   <li>{user.name}</li>
  //                 </>
  //               );
  //             })}
  //       </>
  //     ) : (
  //       <>
  //         <input
  //           value={id}
  //           type="text"
  //           onChange={(e) => {
  //             setId(e.target.value);
  //           }}
  //         ></input>
  //         <input
  //           value={msg}
  //           type="text"
  //           onChange={(e) => {
  //             setMsg(e.target.value);
  //           }}
  //         ></input>

  //         <button onClick={submit}> Submit</button>
  //       </>
  //     )}
  //   </>
  // );
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
