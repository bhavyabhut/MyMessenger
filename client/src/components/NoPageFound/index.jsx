import React from "react";
import style from "./NoPageFound.module.css";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../image/upDraw/undraw_page_not_found_su7k.svg";
export default function NoPage() {
  return (
    <div className={style.noPage}>
      <Logo className={style.noPageLogo} />
      <span>
        Go back to <Link to="/app">dashboard</Link>{" "}
      </span>
    </div>
  );
}
