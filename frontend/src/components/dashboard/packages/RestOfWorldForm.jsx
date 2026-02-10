import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  ConfigProvider,
  message,
  InputNumber,
  Select,
} from "antd";
import {
  SaveOutlined,
  CalendarOutlined,
  CrownOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { createRestOfWorldPackageApi } from "../../../api/restOfWorld";


const restOfWorldOptions = [
  { value: "7", label: "7 Days" },
  { value: "10", label: "10 Days" },
  { value: "15", label: "15 Days" },
  { value: "21", label: "21 Days" },
  { value: "31", label: "31 Days" },
  { value: "62", label: "62 Days" },
  { value: "92", label: "92 Days" },
  { value: "180", label: "180 Days" },
  { value: "365", label: "365 Days" },
];

const RestOfWorldForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createRestOfWorldPackageApi(values);

      message.success("Rest of World package created successfully!");
      if (onSuccess) {
        onSuccess(); 
      }
      form.resetFields();
    } catch (error) {
      message.error(error.message || "Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <ConfigProvider
        theme={{
          token: { colorPrimary: "#13c2c2", colorTextHeading: "#10314a" },
          components: {
            Input: { paddingBlock: 10 },
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
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              suffixIcon={<CalendarOutlined />}
              placeholder="Select duration"
            >
              {restOfWorldOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Max Stay"
            name="maxStay"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              suffixIcon={<CalendarOutlined />}
              placeholder="Select max stay"
            >
           
              {restOfWorldOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

       
          <div className="md:col-span-2 mt-4 mb-2">
            <h3 className="text-[#10314a] font-semibold flex items-center gap-2">
              <CrownOutlined /> Diamond Plan
            </h3>
          </div>

          <Form.Item
            label="Single Price"
            name="diamondSingle"
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
              controls={false}
              style={{ width: "100%" }}
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Family Price"
            name="diamondFamily"
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
              controls={false}
              style={{ width: "100%" }}
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "")}
            />
          </Form.Item>

      
          <div className="md:col-span-2 mt-4 mb-2">
            <h3 className="text-[#10314a] font-semibold flex items-center gap-2">
              <StarOutlined className="text-yellow-500" /> Gold Plan
            </h3>
          </div>

          <Form.Item
            label="Single Price"
            name="goldSingle"
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
              controls={false}
              style={{ width: "100%" }}
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Family Price"
            name="goldFamily"
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
              controls={false}
              style={{ width: "100%" }}
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/,/g, "")}
            />
          </Form.Item>

     
          <div className="md:col-span-2 mt-6 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={loading}
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

export default RestOfWorldForm;