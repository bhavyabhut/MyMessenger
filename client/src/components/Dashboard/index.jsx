// import React, { useEffect, useState, useRef } from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   Redirect,
// } from "react-router-dom";
// import Avatar from "react-avatar";

// import { Menu, Button, notification, Layout, Divider } from "antd";

// import { DashboardOutlined } from "@ant-design/icons";
// import { useHistory } from "react-router-dom";
// import NoPage from "../NoPageFound";
// import MessageContainer from "../MessageContainer";

// const { SubMenu } = Menu;

// // const socket = io("http://localhost:5000", {
// //   transports: ["websocket", "polling"],
// // });
// const { Header, Footer, Sider, Content } = Layout;

// const initialNotification = {
//   isNotify: false,
//   msg: "",
//   type: "",
// };

// // 0 for success
// // 1 for error

// function Dashboard({ isSocketConnected, socket }) {
//   const [allUsers, setAllUsers] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [collapse, setCollapse] = useState(false);

//   const history = useHistory();

//   console.log(history);

//   const [notificationState, setNotification] = useState(initialNotification);

//   const showNotification = (newType, msg) => {
//     let type = "";
//     if (newType === 0) type = "success";
//     if (newType === 1) type = "error";
//     setNotification({ isNotify: true, msg, type });
//   };

//   useEffect(() => {
//     // socket.on("getData", (data) => {
//     //   console.log("dashboard get_data", data);
//     // });
//     socket.on("new_user", (data) => {
//       setAllUsers(data);
//       console.log("dashboard new user", data);
//     });
//     socket.on("get-all-users-done", (data) => {
//       console.log("finally", data);

//       if (data.success) {
//         setAllUsers(data.data);
//         return;
//       }
//       if (!data.success) {
//         showNotification(1, data.msg);
//       }
//     });
//     socket.emit("get-all-users", { id: socket.id });
//   }, []);

//   useEffect(() => {
//     if (notificationState.isNotify) {
//       notification.open({
//         message: notificationState.type === "success" ? "Success" : "Error",
//         description: notificationState.msg,
//         type: notificationState.type,
//       });
//       setNotification(initialNotification);
//     }
//   }, [notificationState.isNotify]);

//   const toggleCollapsed = () => setCollapse(!collapse);

//   return (
//     <Layout style={{ height: "100vh" }}>
//       <Sider collapsible collapsed={collapse} onCollapse={toggleCollapsed}>
//         <div style={{ marginTop: "3.7rem" }}>
//           {/* <Button type="primary" onClick={toggleCollapsed}>
//             {collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//           </Button> */}

//           <Menu style={{ height: "100%" }} mode="inline" theme="dark">
//             <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
//               <Link to={`/app/dashboard`}>Dashboard</Link>
//             </Menu.Item>
//             {/* <span style={{ marginLeft: "2rem" }}>Chats</span> */}

//             {allUsers &&
//               allUsers
//                 .filter((d) => d.id !== socket.id)
//                 .map((data) => (
//                   <Menu.Item
//                     key={data.id}
//                     icon={
//                       <Avatar
//                         name={data.name}
//                         textSizeRatio={1.85}
//                         size="30"
//                         round
//                       />
//                     }
//                   >
//                     <Link to={`/app/${data.id}`}>{data.name}</Link>
//                   </Menu.Item>
//                 ))}
//           </Menu>
//         </div>
//       </Sider>
//       <Layout>
//         <Header>Header</Header>
//         <Content>
//           <Switch>
//             <Route path="/app/" exact>
//               DashBoard
//             </Route>
//             <Route path="/app/dashboard" exact>
//               DashBoard
//             </Route>
//             <Route path="/app/:id" exact>
//               <MessageContainer socket={socket} />
//             </Route>
//             <Route>
//               {/* <NoPage /> */}
//               <Redirect to="/404"></Redirect>
//             </Route>
//           </Switch>
//         </Content>
//         <Footer>Footer</Footer>
//       </Layout>
//     </Layout>
//   );
// }

// export default Dashboard;

import React from "react";

export default function Dashboard() {
  return <div>Welcome to my chat message</div>;
}
