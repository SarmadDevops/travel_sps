import React from "react";
import { Form, Input, Select } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import SectionHeader from "./SectionHeader";
import { PHONE_PATTERN } from "../underwriterConstants";

const { Option } = Select;

const ContactBeneficiaryDetails = () => {
  return (
    <div className="mt-8">
      <SectionHeader icon={<IdcardOutlined />} title="Contact & Beneficiary" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Contact Number"
          name="contact"
          rules={[
            { required: true, message: "Contact number required" },
            {
              pattern: PHONE_PATTERN,
              message: "Format: 03XXXXXXXXX (11 digits)",
            },
          ]}
        >
          <Input
            placeholder="03XXXXXXXXX"
            maxLength={11}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Beneficiary Name"
          name="beneficiary"
          rules={[
            { required: true, message: "Beneficiary Name is required" },
            { min: 3, message: "Must be at least 3 characters" },
            { max: 30, message: "Cannot exceed 30 characters" },
          ]}
        >
          <Input placeholder="Enter beneficiary name" />
        </Form.Item>
      </div>

      <Form.Item
        label="Beneficiary Relationship"
        name="beneficiaryRelationship"
        rules={[{ required: true, message: "Select relationship" }]}
      >
        <Select placeholder="Select relationship">
          <Option value="Wife">Wife</Option>
          <Option value="Husband">Husband</Option>
          <Option value="Son">Son</Option>
          <Option value="Daughter">Daughter</Option>
          <Option value="Father">Father</Option>
          <Option value="Mother">Mother</Option>
          <Option value="Brother">Brother</Option>
          <Option value="Sister">Sister</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: "Address is required" },
            { min: 3, message: "Must be at least 3 characters" },
            { max: 50, message: "Cannot exceed 50 characters" },
          ]}
        >
          <Input placeholder="Current residential address" />
        </Form.Item>
        <Form.Item label="UnderWriter Notes" name="underWriterNotes">
          <Input placeholder="UnderWriter Notes" />
        </Form.Item>
      </div>
    </div>
  );
};

export default ContactBeneficiaryDetails;
