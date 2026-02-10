import React from "react";
import { Form, Input, DatePicker } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SectionHeader from "./SectionHeader";
import { CNIC_PATTERN, PASSPORT_PATTERN } from "../underwriterConstants";

const InsuredPersonDetails = () => {
  return (
    <div>
      <SectionHeader icon={<UserOutlined />} title="Insured Person Details" />

      <Form.Item
        label="Full Name"
        name="insuredName"
        rules={[
          { required: true, message: "Full Name is required" },
          { min: 3, message: "Name must be at least 3 chars" },
          { max: 30, message: "Name cannot exceed 30 chars" },
        ]}
      >
        <Input
          placeholder="Enter full name as per passport"
          prefix={<UserOutlined />}
        />
      </Form.Item>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: "DOB is required" }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Date To (Expiry)" name="dateTo">
          <Input
            disabled
            placeholder="Auto Calculated"
            className="bg-gray-50"
          />
        </Form.Item>
      </div>

      <Form.Item
        label="CNIC Number"
        name="cnic"
        rules={[
          { required: true, message: "CNIC is required" },
          { pattern: CNIC_PATTERN, message: "Format: 13 digits (no dashes)" },
        ]}
      >
        <Input placeholder="4220112345671" maxLength={13} />
      </Form.Item>

      <Form.Item
        label="Passport Number"
        name="passport"
        rules={[
          { required: true, message: "Passport is required" },
          {
            pattern: PASSPORT_PATTERN,
            message: "Alphanumeric only (e.g., AA123456)",
          },
        ]}
      >
        <Input
          placeholder="AA123456"
          maxLength={9}
          style={{ textTransform: "uppercase" }}
          onChange={(e) => {
            const uppercaseValue = e.target.value.toUpperCase();
            e.target.value = uppercaseValue;
          }}
        />
      </Form.Item>
    </div>
  );
};

export default InsuredPersonDetails;
