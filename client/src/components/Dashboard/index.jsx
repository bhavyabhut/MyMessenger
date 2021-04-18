import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import style from "./dashboard.module.css";
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

// 0 for success
// 1 for error

function Dashboard({ isSocketConnected, socket }) {
  return (
    <div className={style.loginPage}>
      <div className={style.loginImage}>
        <Logo5 className={style.loginLogo} />
        <Logo6 className={style.loginLogo} />
        <Logo7 className={style.loginLogo} />
        <Logo8 className={style.loginLogo} />
      </div>
      <div className={style.loginInput}>
        <div className={style.loginNameBox}>
          <h1 className={style.welcome}> Welcome to your secure messenger</h1>
        </div>
      </div>
      <div className={style.loginImage}>
        <Logo1 className={style.loginLogo} />
        <Logo2 className={style.loginLogo} />
        <Logo3 className={style.loginLogo} />
        <Logo4 className={style.loginLogo} />
      </div>
    </div>
  );
}

export default Dashboard;
