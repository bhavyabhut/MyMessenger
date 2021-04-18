import React from "react";
import { CheckOutlined } from "@ant-design/icons";

export default function SeenTick({ isSeen }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <CheckOutlined
        style={{
          color: `${isSeen ? "rgb(32, 218, 32)" : "grey"}`,
          fontSize: "1rem",
          marginBottom: "-12px",
        }}
      />
      <CheckOutlined
        style={{
          color: `${isSeen ? "rgb(32, 218, 32)" : "grey"}`,
          fontSize: "1rem",
        }}
      />
    </div>
  );
}
