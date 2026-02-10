import React from "react";
import {
  Card,
  Form,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  message,
  Space,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  PrinterOutlined,
  ExportOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const ReportForm = ({ setReportURL, setDateRange }) => {
  const [form] = Form.useForm();
  const userRole = localStorage.getItem("userRole") || "SUPER_ADMIN";
  const isBranchAdmin = userRole === "ADMIN";
  const isAgent = userRole === "AGENT";

  const onFinish = (values) => {
    if (!values.fromDate || !values.toDate)
      return message.error("Select dates!");

    const fromDate = values.fromDate.format("YYYY-MM-DD");
    const toDate = values.toDate.format("YYYY-MM-DD");

    // Set date range for PDF generation
    if (setDateRange) {
      setDateRange({ from: fromDate, to: toDate });
    }

    let apiPath = ""; // default API path

    if (userRole === "SUPER_ADMIN") {
      apiPath = "/super-admin";
    } else if (userRole === "ADMIN") {
      apiPath = "/admin";
    } else if (userRole === "AGENT") {
      apiPath = "/admin";
    } else {
      return message.error("You are not authorized to generate reports");
    }

    // Build query params
    const params = new URLSearchParams({
      fromDate,
      toDate,
      agentName: values.agent || "",
      adminName: values.parentAgent || "",
    });

    const base = import.meta.env.VITE_API_BASE_URL || "/api";
    const apiURL = `${base}/under-writing${apiPath}?${params.toString()}`;
    setReportURL(apiURL);

    message.success("Report URL built!");
  };

  const handleReset = () => {
    form.resetFields();
    message.info("Form reset");
  };

  const getHeading = () => {
    if (isAgent) return "All Your Policies";
    if (isBranchAdmin)
      return "All Your Branch policies (combine all agent policies)";
    return "Show All Branch Policies";
  };

  return (
    <Card
      title={
        <Space>
          <PrinterOutlined />
          Policy Reports
        </Space>
      }
      className="mb-4"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Section 1: Date Range - Shown to all roles */}
        <div className="mb-4">
          <Text strong className="block mb-2 text-lg">
            {getHeading()}
          </Text>
          <Row gutter={24}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="From Date"
                name="fromDate"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="To Date"
                name="toDate"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Section 2 & 3: Additional filters - Hidden for Agent */}
        {!isAgent && (
          <Row gutter={24}>
            {/* Section 2: Specific Branch Policies - Only for Super Admin */}
            {!isBranchAdmin && (
              <Col xs={24} lg={12}>
                <Text strong className="block mb-2 text-lg">
                  Only specific Branch Policies
                </Text>
                <Form.Item label="Parent Admin" name="parentAgent">
                  <Select
                    placeholder="Type or select Admin"
                    showSearch
                    mode="tags"
                    tokenSeparators={[","]}
                    className="w-full"
                  >
                    <Option value="Admin1">Admin1</Option>
                    <Option value="Admin2">Admin2</Option>
                  </Select>
                </Form.Item>
              </Col>
            )}

            {/* Section 3: Branch Agent Policies - For Super Admin and Branch Admin */}
            <Col xs={24} lg={isBranchAdmin ? 24 : 12}>
              <Text strong className="block mb-2 text-lg">
                {isBranchAdmin
                  ? "Specific agent policies"
                  : "Branch Agent Policies"}
              </Text>
              <Form.Item label="Agent" name="agent">
                <Select
                  placeholder="Type or select Agent"
                  showSearch
                  mode="tags"
                  tokenSeparators={[","]}
                  className="w-full"
                >
                  <Option value="Agent1">Agent1</Option>
                  <Option value="Agent2">Agent2</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            icon={<PrinterOutlined />}
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#13c2c2", borderColor: "#13c2c2" }}
          >
            Generate
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ReportForm;
