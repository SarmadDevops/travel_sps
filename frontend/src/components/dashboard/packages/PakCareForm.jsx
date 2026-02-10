import React from "react";
import {
  Form,
  InputNumber,
  Button,
  ConfigProvider,
  message,
  Select,
} from "antd";
import {
  SaveOutlined,
  CalendarOutlined,
  CrownOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { createPakCarePackageApi } from "../../../api/pakCarePackages";

const PakCareForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const payload = {
        duration: values.duration,
        singleCare: values.singleCare,
        familyCare: values.familyCare,
        singleCarePlus: values.singleCarePlus,
        familyCarePlus: values.familyCarePlus,
      };

      await createPakCarePackageApi(payload);

      messageApi.success("PakCare package saved successfully!");
      if (onSuccess) {
        onSuccess(); 
      }
      form.resetFields();
    } catch (error) {
      messageApi.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      {contextHolder}

      <ConfigProvider
        theme={{
          token: { colorPrimary: "#13c2c2", colorTextHeading: "#10314a" },
          components: {
            InputNumber: { paddingBlock: 10 },
            Button: { fontWeight: 600 },
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
        >
         
          <div className="md:col-span-2 mb-4 border-b pb-2">
            <h3 className="text-[#10314a] font-semibold">Duration Details</h3>
          </div>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select duration"
              suffixIcon={<CalendarOutlined />}
            >
              <Select.Option value="5 Days">5 Days</Select.Option>
              <Select.Option value="7 Days">7 Days</Select.Option>
              <Select.Option value="10 Days">10 Days</Select.Option>
              <Select.Option value="15 Days">15 Days</Select.Option>
              <Select.Option value="21 Days">21 Days</Select.Option>
            </Select>
          </Form.Item>

       
          <div className="md:col-span-2 mt-4 mb-2">
            <h3 className="text-[#10314a] font-semibold flex items-center gap-2">
              <CrownOutlined className="text-[#10314a]" /> Single Care Plan
            </h3>
          </div>

          <Form.Item
            label="Single Price"
            name="singleCare"
            rules={[
              { required: true, message: "Required" },
              {
                type: "number",
                min: 0,
                message: "Price must be a positive number",
              },
            ]}
          >
            <InputNumber
              prefix="RS"
              style={{ width: "100%" }}
              placeholder="0"
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Family Price"
            name="familyCare"
            rules={[
              { required: true, message: "Required" },
              {
                type: "number",
                min: 0,
                message: "Price must be a positive number",
              },
            ]}
          >
            <InputNumber
              prefix="RS"
              style={{ width: "100%" }}
              placeholder="0"
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

       
          <div className="md:col-span-2 mt-4 mb-2">
            <h3 className="text-[#10314a] font-semibold flex items-center gap-2">
              <StarOutlined className="text-yellow-500" /> Single Care Plus Plan
            </h3>
          </div>

          <Form.Item
            label="Single Price"
            name="singleCarePlus"
            rules={[
              { required: true, message: "Required" },
              {
                type: "number",
                min: 0,
                message: "Price must be a positive number",
              },
            ]}
          >
            <InputNumber
              prefix="RS"
              style={{ width: "100%" }}
              placeholder="0"
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Family Price"
            name="familyCarePlus"
            rules={[
              { required: true, message: "Required" },
              {
                type: "number",
                min: 0,
                message: "Price must be a positive number",
              },
            ]}
          >
            <InputNumber
              prefix="RS"
              style={{ width: "100%" }}
              placeholder="0"
              min={0}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

       
          <div className="md:col-span-2 mt-6 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              className="bg-[#10314a] hover:!bg-[#0a2339] min-w-[150px]"
            >
              Save Package
            </Button>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default PakCareForm;
