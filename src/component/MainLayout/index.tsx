import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Typography,
  message,
  Modal,
  Tag,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { signOut } from "../../service/authService";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [isLandowner, setIsLandowner] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setIsLandowner(userType === "LANDOWNER");
  }, []);

  const user = {
    name: "test",
    avatar: "https://i.pravatar.cc/150?img=5",
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to sign out?",
      icon: <LogoutOutlined style={{ color: "red" }} />,
      content: "You will need to log in again to access your dashboard.",
      okText: "Yes, Sign Out",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await signOut();
          localStorage.removeItem("token");
          message.success("You have been signed out.");
          navigate("/login");
        } catch (error) {
          console.error("Sign-out failed:", error);
          localStorage.removeItem("token");
          message.success("You have been signed out.");
          navigate("/login");
        }
      },
      onCancel() {
        message.info("Sign-out canceled.");
      },
    });
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" danger onClick={handleLogout}>
        {" "}
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "18px",
            padding: "16px",
          }}
        >
          {collapsed ? "🏡" : "Property Manager"}
        </div>

        <Menu theme="dark" mode="inline">
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="marketplace" icon={<UserOutlined />}>
            <Link to="/marketplace">Marketplace</Link>
          </Menu.Item>
          {isLandowner && (
            <Menu.Item key="amentics" icon={<UserOutlined />}>
              <Link to="/amentics">Amentics</Link>
            </Menu.Item>
          )}
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="logout" danger onClick={handleLogout}>
            {" "}
            <LogoutOutlined /> Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#001529",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {collapsed ? (
              <MenuUnfoldOutlined
                onClick={() => setCollapsed(false)}
                style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => setCollapsed(true)}
                style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
              />
            )}
            <h1 style={{ color: "white", marginLeft: "16px" }}>Dashboard</h1>
          </div>

          <Dropdown
            overlay={profileMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Tag
                bordered={false}
                className="float-right mr-10 capitalize"
                color="#f50"
              >
                {localStorage.getItem("userType") + " " + "Account"}
              </Tag>
              <Avatar src={user.avatar} size={40} />
              <Text style={{ color: "white", marginLeft: "8px" }}>
                {user.name}
              </Text>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{ margin: "16px", padding: "16px", background: "white" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
