import React, { useState } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { login, verifyToken } from "../../service/authService";
import bgImg from "./../../assets/img/bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const data = await login(values.username, values.password);
      const token = data.AuthenticationResult.AccessToken;
      localStorage.setItem("token", token);

      const verificationResponse = await verifyToken(token);
      console.log("Token Verification Response:", verificationResponse);

      if (verificationResponse && verificationResponse.UserAttributes) {
        const userAttributes = verificationResponse.UserAttributes;

        const userTypeObj = userAttributes.find(
          (attr) => attr.Name === "custom:userType"
        );

        if (userTypeObj) {
          localStorage.setItem("userType", userTypeObj.Value);
          console.log("User Type Saved:", userTypeObj.Value);
        } else {
          console.warn("custom:userType not found in the response");
        }

        // ✅ Redirect to Dashboard
        message.success("Login successful!");
        navigate("/dashboard");
      } else {
        message.error("Token verification failed. Please login again.");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full bg-white flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <div className="w-[400px] bg-white/100 rounded-md shadow-md p-12">
        <Title level={2} className="text-center">
          Login
        </Title>
        <div className="text-center">
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password prefix={<KeyOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="mt-3"
                block
                loading={loading} // Show spinner when loading is true
                disabled={loading} // Disable button while loading
              >
                {loading ? "Logging In..." : "Log In"}
              </Button>
            </Form.Item>
          </Form>
          <div className="newuser text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[blue]">
              Signup Now!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
