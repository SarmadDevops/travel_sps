import React, { useState } from "react";
import { Form, Input, Button, ConfigProvider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/authApi"; 

import logo from "../../assets/securepathsolution.png"; 
const LoginRight = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await loginApi(values);

      
      console.log("Login API Response:", res);
      console.log("User Role from API:", res.user?.role);

    
      localStorage.setItem("token", res.token);

    
      const userRole = res.user?.role || "SUPER_ADMIN";
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("user", JSON.stringify(res.user));
      message.success("Login successful");
      console.log("Redirecting user with role:", userRole);

    
      if (userRole === "ADMIN") {
        navigate("/branch/dashboard");
      } else if (userRole === "AGENT") {
        navigate("/agent/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      message.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const buttonGradient = {
    background: `linear-gradient(to bottom, #1A3A5C 0%, #1F7B85 100%)`,
    outline: "none",
    border: "none",
  };
  return (
    <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-6 lg:py-10 lg:px-12 relative">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-start mb-4 lg:mb-6">
        <img
          src={logo}
          alt="Logo"
          className="h-20 lg:h-32 w-auto object-contain"
        />
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#10314A",
            colorText: "#10314A",
            borderRadius: 6,
          },
          components: {
            Input: {
              activeBorderColor: "#13C2C2",
              hoverBorderColor: "#13C2C2",
              paddingBlock: 12,
            },
          },
        }}
      >
        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          {/* USERNAME */}
          <Form.Item
            label={<span className="font-semibold">Username</span>}
            name="identifier"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          {/* PASSWORD */}
          <Form.Item
            label={<span className="font-semibold">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#13C2C2" />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            />
          </Form.Item>
          {/* BUTTON */}
          <Form.Item className="mt-8">
            <Button
              type="primary"
              htmlType="submit"
              style={buttonGradient}
              className="w-full h-12 text-lg font-semibold"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
      {/* FOOTER */}
      <div className="mt-8 text-center text-xs text-gray-400">
        © 2026 SecurePathSolution
      </div>
    </div>
  );
};
export default LoginRight;
