import React, { useState } from "react";
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
import { createWorldWidePackageApi } from "../../../api/worldWidePackages";
const worldwideOptions = [
  { value: "7", label: "7 Days" },
  { value: "10", label: "10 Days" },
  { value: "15", label: "15 Days" },
  { value: "21", label: "21 Days" },
  { value: "31", label: "31 Days" },
  { value: "62", label: "62 Days" },
  { value: "92", label: "92 Days" },
  { value: "180", label: "180 Days" },
  { value: "365", label: "365 Days" },
  { value: "2 Years", label: "2 Years" },
  { value: "180-consecutive", label: "180 Days (Consecutive)" },
  { value: "365-consecutive", label: "365 Days (Consecutive)" },
  { value: "272-consecutive", label: "272 Days (Consecutive)" },
];

const WorldwideForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        duration: values.duration,
        maxStay: values.maxStay,
        platinumSingle: values.platinumSingle,
        platinumFamily: values.platinumFamily,
        goldPlusSingle: values.goldPlusSingle,
        goldPlusFamily: values.goldPlusFamily,
        titaniumSingle: values.titaniumSingle,
        titaniumFamily: values.titaniumFamily,
        notes: values.notes || "",
      };

      await createWorldWidePackageApi(payload);

      messageApi.success("World Wide package saved successfully!");
      if (onSuccess) {
        onSuccess(); 
      }
      form.resetFields();
    } catch (error) {
      messageApi.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          {/* --- Duration --- */}
          <div className="md:col-span-2 mb-4 border-b pb-2">
            <h3 className="text-[#10314a] font-semibold">Duration Details</h3>
          </div>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              placeholder="Select duration"
              suffixIcon={<CalendarOutlined />}
            >
              {/*  Mapped using the worldwideOptions list */}
              {worldwideOptions.map((option) => (
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
              placeholder="Select max stay"
              suffixIcon={<CalendarOutlined />}
            >
              {/*  Mapped using the worldwideOptions list */}
              {worldwideOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* --- Platinum Plan --- */}
          <div className="md:col-span-2 mt-4 mb-2">
            <h3 className="text-[#10314a] font-semibold flex items-center gap-2">
              <CrownOutlined className="text-[#10314a]" /> Platinum Plan
            </h3>
          </div>

          <Form.Item
            label="Single Price"
            name="platinumSingle"
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
              placeholder="0"
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Family Price"
            name="platinumFamily"
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
              placeholder="0"
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          {/* --- Gold Plus Plan --- */}
          <div className="md:col-span-2 mt-4 mb-2">
            <h3 className="text-[#10314a] font-semibold flex items-center gap-2">
              <StarOutlined className="text-yellow-500" /> Gold Plus Plan
            </h3>
          </div>

          <Form.Item
            label="Single Price"
            name="goldPlusSingle"
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
              placeholder="0"
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Family Price"
            name="goldPlusFamily"
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
              placeholder="0"
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          {/* --- Titanium Plan --- */}
          <div className="md:col-span-2 mt-4 mb-2">
            <h3 className="text-[#10314a] font-semibold flex items-center gap-2">
              ⚫ Titanium Plan
            </h3>
          </div>

          <Form.Item
            label="Single Price"
            name="titaniumSingle"
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
              placeholder="0"
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Family Price"
            name="titaniumFamily"
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
              placeholder="0"
              min={0}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          {/* --- Submit Button --- */}
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

export default WorldwideForm;