import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const EditAgentModal = ({ visible, initialValues = {}, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        agentEmail: initialValues.email,
        agentMobileNo: initialValues.mobileNo,
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      setTimeout(() => {
        onUpdate(values); 
        setLoading(false);
      }, 600);
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  return (
    <Modal
      open={visible}
      centered
      destroyOnClose
      width={window.innerWidth < 768 ? "95%" : 420}
      title={
        <div className="flex items-center gap-2">
          <EditOutlined className="text-[#13c2c2]" />
          <span className="font-semibold text-[#10314a]">
            Update Contact Details
          </span>
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
          icon={<SaveOutlined />}
          className="bg-[#10314a] hover:!bg-[#13c2c2] border-none"
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark="optional"
      >
      
        <Form.Item
          label="Email Address"
          name="agentEmail"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="contact@agency.com"
          />
        </Form.Item>

      
        <Form.Item
          label="Mobile Number"
          name="agentMobileNo"
          rules={[
            { required: true, message: "Mobile number is required" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const cleaned = value.replace(/[-\s]/g, "");
                if (/^03\d{9}$/.test(cleaned)) return Promise.resolve();
                return Promise.reject(
                  new Error("Enter valid 11-digit number starting with 03")
                );
              },
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="03XXXXXXXXX"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAgentModal;
