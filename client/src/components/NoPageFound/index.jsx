import React from "react";
import style from "./NoPageFound.module.css";
import { ReactComponent as Logo } from "../../image/upDraw/undraw_page_not_found_su7k.svg";
export default function NoPage() {
  return (
    <div className={style.noPage}>
      <Logo className={style.noPageLogo} />
    </div>
  );
}
