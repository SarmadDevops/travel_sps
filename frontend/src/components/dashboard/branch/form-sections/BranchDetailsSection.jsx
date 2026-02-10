import React from "react";
import { Form, Input, DatePicker } from "antd";
import {
  BankOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const BranchDetailsSection = ({ handleNumberKeyPress }) => {
  return (
    <div className="bg-white p-8 rounded-xl border shadow-sm mb-6">
      <h3 className="text-lg font-bold text-[#10314a] mb-6 border-b pb-2 flex items-center gap-2">
        <EnvironmentOutlined /> Branch Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Form.Item
          label="Branch Name"
          name="branchName"
          rules={[
            { required: true, message: "Branch name is required" },
            { min: 3, message: "Min 3 characters required" },
            { max: 30, message: "Max 30 characters allowed" },
          ]}
        >
          <Input
            prefix={<BankOutlined className="text-gray-400" />}
            placeholder="Enter branch name"
          />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[
            { required: true, message: "City is required" },
            { min: 3, message: "Min 3 characters required" },
            { max: 50, message: "Max 50 characters allowed" },
          ]}
        >
          <Input
            prefix={<EnvironmentOutlined className="text-gray-400" />}
            placeholder="Enter city"
          />
        </Form.Item>

        <Form.Item
          label="Branch Phone"
          name="branchPhone"
          rules={[
            { required: true, message: "Branch phone is required" },
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
          label="Branch Official Email"
          name="branchOfficialEmail"
          rules={[
            { required: true, message: "Official email is required" },
            { type: "email", message: "Enter valid email format" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="branch@domain.com"
          />
        </Form.Item>

        <Form.Item
          label="Branch Address"
          name="branchAddress"
          className="md:col-span-2"
          rules={[{ required: true, message: "Address is required" }]}
        >
          <Input.TextArea rows={2} placeholder="Enter full branch address" />
        </Form.Item>

        <Form.Item
          label="Date of Opening"
          name="branchDateOfOpening"
          rules={[{ required: true, message: "Opening date is required" }]}
        >
          <DatePicker className="w-full" placeholder="Select opening date" />
        </Form.Item>
      </div>
    </div>
  );
};

export default BranchDetailsSection;