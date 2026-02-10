import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, InputNumber, ConfigProvider } from 'antd';
import {
  SaveOutlined,
  BankOutlined,
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  FileTextOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const EditBranchModal = ({ visible, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
   
      const updatedValues = {
        ...initialValues,
        branchDateOfOpening: initialValues.branchDateOfOpening ? dayjs(initialValues.branchDateOfOpening) : null,
      };
      form.setFieldsValue(updatedValues);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // convert date back to string if needed
      const updatedValues = {
        ...values,
        branchDateOfOpening: values.branchDateOfOpening ? values.branchDateOfOpening.toISOString() : null,
      };
      onUpdate(updatedValues);
      form.resetFields();
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#13c2c2', borderRadius: 8 },
        components: { Button: { fontWeight: 600 } },
      }}
    >
      <Modal
        open={visible}
        title={<span className="text-[#10314a] font-bold text-lg">Update Branch Details</span>}
        onCancel={onCancel}
        centered
        width={700}
        footer={[
          <Button key="cancel" onClick={onCancel} className="hover:bg-gray-100">Cancel</Button>,
          <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleSubmit} className="bg-[#10314a] hover:!bg-[#0a2339]">
            Save Changes
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" className="mt-4">
          {/* Branch Info */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Branch Name" name="branchName" rules={[{ required: true }]}>
              <Input prefix={<BankOutlined className="text-gray-400" />} />
            </Form.Item>
            <Form.Item label="City" name="city" rules={[{ required: true }]}>
              <Input prefix={<EnvironmentOutlined className="text-gray-400" />} />
            </Form.Item>
            <Form.Item label="Credit Limit" name="creditTrial" rules={[{ required: true }]}>
              <InputNumber prefix={<FileTextOutlined />} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Phone" name="branchPhone">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item label="Address" name="branchAddress">
              <Input prefix={<EnvironmentOutlined />} />
            </Form.Item>
            <Form.Item label="Official Email" name="branchOfficialEmail">
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item label="Commission" name="commissionSlab">
              <Input prefix={<FileTextOutlined />} />
            </Form.Item>
            <Form.Item label="Date of Opening" name="branchDateOfOpening">
              <DatePicker style={{ width: '100%' }} prefix={<CalendarOutlined />} />
            </Form.Item>
          </div>

          {/* Admin Info */}
          <div className="border-t border-gray-100 my-4 pt-2">
            <p className="text-xs text-[#13c2c2] font-bold uppercase mb-3">Admin Credentials</p>
            <Form.Item label="Admin Name" name="adminName" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item label="Admin Email" name="adminEmail" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item label="Admin Contact No" name="adminContactNo">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item label="Admin CNIC" name="adminCnic">
              <Input prefix={<IdcardOutlined />} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default EditBranchModal;
