import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Radio,
  Space,
  Typography,
  ConfigProvider,
  message, 
} from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const VerifyPolicyForm = ({ onSearch, loading }) => {
  const [form] = Form.useForm();
  const [viewMode, setViewMode] = React.useState("download");

  const onFinish = async (values) => {
    try {
      if (onSearch) {
        await onSearch(values);
      }
    } catch (error) {
      message.error(error.message || "Search failed");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#13c2c2", borderRadius: 8 },
        components: {
          Button: { fontWeight: 600, controlHeight: 45 },
          Input: { controlHeight: 45 },
        },
      }}
    >
      <div className="animate-fade-in">
        <div className="mb-6 flex items-center gap-4">
          <div className="bg-[#13c2c2] p-3 rounded-xl shadow-md shadow-teal-100">
            <SafetyCertificateOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: "#10314a" }}>
              Verify Policy
            </Title>
            <Text type="secondary">
              Search and manage your policy documents easily
            </Text>
          </div>
        </div>

        <Card
          className="shadow-sm border border-gray-100 rounded-xl overflow-hidden"
          bodyStyle={{ padding: "0" }}
        >
          <div className="p-8 bg-white border-b border-gray-100">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <Form.Item
                    label={
                      <span className="font-semibold text-[#10314a]">
                        Passport Number
                      </span>
                    }
                    name="passportNo"
                    className="mb-0"
                    rules={[
                      { required: true, message: "Passport Number is required" },
                      {
                        pattern: /^[A-Z0-9]{6,9}$/i,
                        message: "Invalid format (e.g. AB123456)",
                      },
                    ]}
                  >
                    <Input
                      prefix={<SearchOutlined className="text-gray-400" />}
                      placeholder="e.g. AB123456"
                      className="rounded-lg border-gray-300 hover:border-[#13c2c2] focus:shadow-md transition-all"
                      maxLength={9} 
                      style={{ textTransform: "uppercase" }} 
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="font-semibold text-[#10314a]">
                        Policy Number
                      </span>
                    }
                    name="policyNo"
                    className="mb-0"
                    rules={[
                      { required: true, message: "Policy Number is required" },
                      {
                        pattern: /^SPS-PK-\d{6}$/,
                        message: "Format must be SPS-PK-XXXXXX",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g. SPS-PK-772397"
                      className="rounded-lg border-gray-300 hover:border-[#13c2c2] focus:shadow-md transition-all"
                      maxLength={13} 
                    />
                  </Form.Item>
                </div>

                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<SearchOutlined />}
                  className="px-8 rounded-lg bg-[#10314a] hover:!bg-[#0a2339] border-none shadow-lg shadow-gray-200 mt-0 lg:mt-[29px]"
                >
                  Search Policy
                </Button>
              </div>
              <Text className="text-xs text-gray-400 mt-3 block italic">
                * Both fields are required to verify the policy.
              </Text>
            </Form>
          </div>

          <div className="p-8 bg-[#f8fafc]">
            <div className="mb-6 bg-white p-2 px-4 rounded-lg inline-block border border-gray-200 shadow-sm">
              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
              >
                <Space size="large">
                  <Radio value="download" className="font-medium text-gray-600">
                    <Space>
                      <FilePdfOutlined className="text-red-500" /> Download PDF
                    </Space>
                  </Radio>
                  <Radio value="viewer" className="font-medium text-gray-600">
                    <Space>
                      <EyeOutlined className="text-blue-500" /> View in Report Viewer
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default VerifyPolicyForm;