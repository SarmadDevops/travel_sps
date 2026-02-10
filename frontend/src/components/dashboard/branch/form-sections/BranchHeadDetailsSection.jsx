import React from "react";
import { Form, Input, InputNumber, Button } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  DollarOutlined,
  PercentageOutlined,
  LockOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const BranchHeadDetailsSection = ({ handleNumberKeyPress, loading }) => {
  return (
    <div className="bg-white p-8 rounded-xl border shadow-sm">
      <h3 className="text-lg font-bold text-[#10314a] mb-6 border-b pb-2 flex items-center gap-2">
        <UserOutlined /> Branch Head Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Form.Item
          label="Branch Head Name"
          name="adminName"
          rules={[
            { required: true, message: "Head name is required" },
            { min: 3, message: "Min 3 characters" },
            { max: 30, message: "Max 30 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter full name"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="adminContactNo"
          rules={[
            { required: true, message: "Contact number is required" },
            { pattern: /^\d{11}$/, message: "Must be exactly 11 digits" },
          ]}
        >
          <Input
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="03XXXXXXXXX"
            maxLength={11}
            onKeyPress={handleNumberKeyPress}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="adminEmail"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter valid email format" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="admin@domain.com"
          />
        </Form.Item>

        <Form.Item
          label="CNIC"
          name="adminCnic"
          rules={[
            { required: true, message: "CNIC is required" },
            { pattern: /^\d{13}$/, message: "CNIC must be 13 digits" },
          ]}
        >
          <Input
            prefix={<IdcardOutlined className="text-gray-400" />}
            placeholder="3520298765431"
            maxLength={13}
            onKeyPress={handleNumberKeyPress}
          />
        </Form.Item>

        <Form.Item
          label="Credit Limit"
          name="creditTrial"
          rules={[
            { required: true, message: "Credit limit is required" },
            { type: "number", min: 1, message: "Must be a valid number" },
          ]}
        >
          <InputNumber
            className="w-full"
            min={0}
            prefix={<DollarOutlined className="text-gray-400" />}
            placeholder="50000"
            onKeyPress={handleNumberKeyPress}
            parser={(value) => value.replace(/\D/g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Commission Slab"
          name="commissionSlab"
          rules={[
            { required: true, message: "Commission slab is required" },
            {
              type: "number",
              min: 0,
              max: 100,
              message: "Percentage cannot exceed 100",
            },
          ]}
        >
          <InputNumber
            className="w-full"
            min={0}
            maxLength={3}
            prefix={<PercentageOutlined className="text-gray-400" />}
            placeholder="10"
            addonAfter="%"
            onKeyPress={handleNumberKeyPress}
            parser={(value) => value.replace(/\D/g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="adminPassword"
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "Password must be at least 8 characters long" },
            { max: 30, message: "Password cannot exceed 30 characters" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
              message: "Need 1 Upper, 1 Lower & 1 Special Char",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Abc@1234"
          />
        </Form.Item>

        <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t">
          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            icon={<SaveOutlined />}
            className="px-8 h-10 font-bold bg-[#10314a] hover:!bg-[#13c2c2] border-none shadow-lg shadow-blue-900/20 rounded-lg transition-all duration-300"
          >
            Save Branch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchHeadDetailsSection;