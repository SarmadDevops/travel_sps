import React, { useState } from "react";
import { Form, Button, message, ConfigProvider } from "antd";
import { BankOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { createBranchWithAdminApi } from "../../../api/branch";

import BranchDetailsSection from "./form-sections/BranchDetailsSection";
import BranchHeadDetailsSection from "./form-sections/BranchHeadDetailsSection";

const BranchForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const toggleForm = () => setIsFormExpanded(!isFormExpanded);

  const handleNumberKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.branchName,
        city: values.city,
        branchPhone: values.branchPhone,
        branchAddress: values.branchAddress,
        branchOfficialEmail: values.branchOfficialEmail,
        branchDateOfOpening: values.branchDateOfOpening
          ? values.branchDateOfOpening.format("YYYY-MM-DD")
          : null,

        adminName: values.adminName,
        adminEmail: values.adminEmail,
        adminPassword: values.adminPassword,
        adminContactNo: values.adminContactNo,
        adminCnic: values.adminCnic,

        creditTrial: values.creditTrial,
        commissionSlab: values.commissionSlab,
      };

      await createBranchWithAdminApi(payload);

      messageApi.success("Branch created successfully");
      form.resetFields();
      setIsFormExpanded(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {contextHolder}

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#e6fffb] p-3 rounded-xl">
            <BankOutlined className="text-[#13c2c2] text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#10314a]">
              Add New Branch
            </h3>
            <p className="text-gray-400 text-xs">
              {isFormExpanded
                ? "Fill branch & admin details"
                : "Click to expand"}
            </p>
          </div>
        </div>

        <Button
          type="primary"
          icon={isFormExpanded ? <CloseOutlined /> : <PlusOutlined />}
          onClick={toggleForm}
          size="middle"
          className={
            isFormExpanded
              ? "bg-black text-white hover:!bg-[#13c2c2] w-full sm:w-auto"
              : "bg-black hover:!bg-[#13c2c2] border-none transition-all duration-300 w-full sm:w-auto"
          }
        >
          {isFormExpanded ? "Close" : "Create Branch"}
        </Button>
      </div>

      {isFormExpanded && (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#13c2c2",
              borderRadius: 8,
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-4 animate-fade-in"
            autoComplete="off"
          >
            <BranchDetailsSection handleNumberKeyPress={handleNumberKeyPress} />

            <BranchHeadDetailsSection
              handleNumberKeyPress={handleNumberKeyPress}
              loading={loading}
            />
          </Form>
        </ConfigProvider>
      )}
    </div>
  );
};

export default BranchForm;
