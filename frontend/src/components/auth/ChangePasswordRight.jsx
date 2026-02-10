import React, { useState } from "react";
import { Form, Input, Button, ConfigProvider, message } from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../../api/authApi";

const ChangePasswordRight = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // const onFinish = async (values) => {
  //   setLoading(true);
  //   try {
  //     await changePasswordApi(values);

  //     message.success("Password updated successfully");

  //     //  security best practice
  //     localStorage.removeItem("token");

  //     navigate("/dashboard");
  //   } catch (error) {
  //     message.error(error.message || "Failed to update password");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await changePasswordApi(values);

 
      message.success(
        "Password updated successfully. Please login with your new credentials."
      );

 
      localStorage.removeItem("token");

   
      navigate("/login"); 
    } catch (error) {
      message.error(error.message || "Failed to update password");
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
      <div className="mb-6 text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#10314a] mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500">
          Enter your new credentials below
        </p>
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
          name="change_password"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
      
          <Form.Item
            label={<span className="font-semibold">Old Password</span>}
            name="oldPassword"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter old password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Required" },
              { min: 6, message: "Min 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Confirm Password</span>}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
            />
          </Form.Item>

    
          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              style={buttonGradient}
              className="w-full h-12 text-lg font-semibold"
              loading={loading}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>

      <div className="mt-4 text-center text-xs text-gray-400">
        © 2026 SecurePathSolution
      </div>
    </div>
  );
};

export default ChangePasswordRight;
