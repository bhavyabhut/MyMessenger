import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Avatar from "react-avatar";
import Scrollbar from "react-smooth-scrollbar";

import { Menu, Button, notification, Layout, Divider, Badge } from "antd";

import { DashboardOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import NoPage from "../components/NoPageFound";
import MessageContainer from "../components/MessageContainer";
import Dashboard from "../components/Dashboard/index";

const { SubMenu } = Menu;

// const socket = io("http://localhost:5000", {
//   transports: ["websocket", "polling"],
// });
const { Header, Footer, Sider, Content } = Layout;

const initialNotification = {
  isNotify: false,
  msg: "",
  type: "",
};

// 0 for success
// 1 for error

function App({ isSocketConnected, socket }) {
  const [allUsers, setAllUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [collapse, setCollapse] = useState(false);

  const history = useHistory();

  const [notificationState, setNotification] = useState(initialNotification);

  const showNotification = (newType, msg) => {
    let type = "";
    if (newType === 0) type = "success";
    if (newType === 1) type = "error";
    setNotification({ isNotify: true, msg, type });
    if (msg == "No User Found") history.push("/");
  };

  useEffect(() => {
    // socket.on("getData", (data) => {
    //   console.log("dashboard get_data", data);
    // });
    socket.on("new_user", (data) => {
      console.log("dashboard new user", data);

      setAllUsers(data);
    });
    socket.on("get-all-users-done", (data) => {
      console.log("finally", data);

      if (data.success) {
        setAllUsers(data.data);
        return;
      }
      if (!data.success) {
        showNotification(1, data.msg);
      }
    });
    socket.emit("get-all-users", { id: socket.id });
  }, []);

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

  const toggleCollapsed = () => setCollapse(!collapse);
  let [myUser] = allUsers.filter((u) => u.id == socket.id);
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        width="300"
        collapsible
        collapsed={collapse}
        onCollapse={toggleCollapsed}
      >
        <div style={{ marginTop: "3.7rem" }}>
          {/* <Button type="primary" onClick={toggleCollapsed}>
            {collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button> */}
          <Scrollbar
            continuousScrolling={true}
            style={{ height: window.innerHeight - 70 }}
          >
            <Menu mode="inline" theme="dark">
              <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                <Link to={`/app/dashboard`}>Dashboard</Link>
              </Menu.Item>
              {/* <span style={{ marginLeft: "2rem" }}>Chats</span> */}

              {allUsers &&
                allUsers
                  .filter((d) => d.id !== socket.id)
                  .map((data) => (
                    <Menu.Item
                      key={data.id}
                      icon={
                        <Badge
                          offset={!collapse ? [-8, 2] : [-8, 8]}
                          size="small"
                          style={{ backgroundColor: "#52c41a" }}
                          count={
                            myUser && myUser.totalUnreadMessage[data.id]
                              ? myUser.totalUnreadMessage[data.id]
                              : null
                          }
                          overflowCount={10}
                        >
                          <Avatar
                            name={data.name}
                            textSizeRatio={2}
                            size="32"
                            round
                          />
                        </Badge>
                      }
                    >
                      <Link to={`/app/${data.id}`}>{data.name}</Link>
                    </Menu.Item>
                  ))}
            </Menu>
          </Scrollbar>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header>
          <span style={{ color: "white", float: "right" }}>
            Welcome {myUser && myUser.name}
          </span>
        </Header>
        <Content className="site-layout-background">
          <Switch>
            <Route path="/app/" exact>
              <Dashboard />
            </Route>
            <Route path="/app/dashboard" exact>
              <Dashboard />
            </Route>
            <Route path="/app/:id" exact>
              <MessageContainer allUsers={allUsers} socket={socket} />
            </Route>
            <Route>
              {/* <NoPage /> */}
              <Redirect to="/404"></Redirect>
            </Route>
          </Switch>
        </Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </Layout>
  );
}

export default App;
