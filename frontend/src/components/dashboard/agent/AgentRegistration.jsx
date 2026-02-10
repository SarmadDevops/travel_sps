import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  ConfigProvider,
  DatePicker,
  Card,
  InputNumber, // ✅ Added InputNumber
} from "antd";
import {
  SaveOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  PlusOutlined,
  PercentageOutlined, // ✅ Added Icon
} from "@ant-design/icons";
import dayjs from "dayjs";
import AgentTable from "./AgentTable";
import { getAllAgents, createAgentApi } from "../../../api/agent";

const ResponsiveAgentForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [agents, setAgents] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

 
  const handleNumberKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

 
  const fetchAgents = async () => {
    setFetching(true);
    try {
      const data = await getAllAgents(); 
      const formatted = data.map((agent) => ({
        key: agent.id,
        agentCode: agent.agentCode,
        agentName: agent.agentName,
        email: agent.email,
        mobileNo: agent.mobileNo,
        agentCnic: agent.agentCnic,
        commissionSlab: agent.commissionSlab,
        isActive: agent.isActive,
      }));
      setAgents(formatted);
    } catch (err) {
      messageApi.error("Failed to fetch agents");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const columns = [
    {
      title: "Agent Code",
      dataIndex: "agentCode",
      key: "agentCode",
      align: "center",
    },
    { title: "Agent Name", dataIndex: "agentName" },
    { title: "Email", dataIndex: "email" },
    { title: "CNIC", dataIndex: "agentCnic" },
    { title: "Mobile", dataIndex: "mobileNo" },
  ];


  const onFinish = async (values) => {
    setLoading(true);

    const duplicate = agents.some((a) => a.agentCnic === values.agentCnic);
    if (duplicate) {
      messageApi.error("CNIC already exists");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        agentName: values.agentName,
        mobileNo: values.mobileNo,
        email: values.email,
        agentCnic: values.agentCnic,
        password: values.password,
        adminName: values.adminName,
        city: values.city,
        address: values.address,
        commissionSlab: values.commissionSlab,
        dateOfEstablishment: values.dateOfEstablishment.format("YYYY-MM-DD"),
        dateOfOpening: values.dateOfOpening.format("YYYY-MM-DD"),
      };

      await createAgentApi(payload);
      messageApi.success("Agent created successfully");
      form.resetFields();
      setShowForm(false);
      fetchAgents(); 
    } catch (err) {
      messageApi.error("Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2">
      {contextHolder}

   
      <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="bg-cyan-50 p-4 rounded-xl text-[#13C2C2] text-2xl">
            <BankOutlined />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#10314A]">
              Agent Management
            </h2>
            <p className="text-gray-400 text-sm">Create & manage agents</p>
          </div>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={`
            border-none transition-all duration-300
            ${showForm 
                ? "bg-black text-white hover:!bg-[#13c2c2]" 
                : "bg-[#10314A] hover:!bg-[#13c2c2]"}
          `}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Create Agent"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <ConfigProvider theme={{ token: { colorPrimary: "#13C2C2" } }}>
          <Card className="mb-6 rounded-xl shadow">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                dateOfEstablishment: dayjs(),
                dateOfOpening: dayjs(),
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Agent Name */}
              <Form.Item
                label="Agent Name"
                name="agentName"
                rules={[
                  { required: true, message: "Please enter agent name" },
                  {
                    min: 3,
                    message: "Agent name must be at least 3 characters",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter agent name"
                />
              </Form.Item>

              {/* ✅ Mobile Number: Strict Control */}
              <Form.Item
                label="Mobile"
                name="mobileNo"
                rules={[
                  { required: true, message: "Please enter mobile number" },
                  {
                    pattern: /^03[0-9]{9}$/,
                    message:
                      "Mobile must be 11 digits starting with 03 (e.g., 03001234567)",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="03001234567"
                  maxLength={11} // Limit typing
                  onKeyPress={handleNumberKeyPress} // Only Numbers
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter email" />
              </Form.Item>

              {/* ✅ CNIC: Strict Control */}
              <Form.Item
                label="CNIC"
                name="agentCnic"
                rules={[
                  { required: true, message: "Please enter CNIC" },
                  {
                    pattern: /^[0-9]{13}$/,
                    message: "CNIC must be exactly 13 digits without dashes",
                  },
                ]}
              >
                <Input 
                  placeholder="1234512345671" 
                  maxLength={13} // Limit typing
                  onKeyPress={handleNumberKeyPress} // Only Numbers
                />
              </Form.Item>

              {/* City */}
              <Form.Item
                label="City"
                name="city"
                rules={[
                  { required: true, message: "Please enter city" },
                  { min: 3, message: "City must be at least 3 characters" },
                ]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="Enter city (e.g., Lahore)"
                />
              </Form.Item>

              {/* ✅ COMMISSION SLAB: New Field */}
              <Form.Item
                label="Commission Slab"
                name="commissionSlab"
                rules={[
                  { required: true, message: "Commission slab is required" },
                  { type: "number", min: 0, max: 100, message: "Must be 0-100%" },
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  maxLength={3} // Stops typing after 3 digits
                  prefix={<PercentageOutlined />}
                  placeholder="10"
                  addonAfter="%"
                  onKeyPress={handleNumberKeyPress} // Numeric only
                />
              </Form.Item>

              {/* Address */}
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter address" },
                  { min: 10, message: "Address must be at least 10 characters" },
                ]}
                className="md:col-span-2"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter complete address"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  {
                    max: 30,
                    message: "Password must not exceed 30 characters",
                  },
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              {/* Admin Name */}
              <Form.Item
                label="Admin Name"
                name="adminName"
                rules={[
                  { required: true, message: "Please enter admin name" },
                  {
                    min: 3,
                    message: "Admin name must be at least 3 characters",
                  },
                ]}
              >
                <Input placeholder="Enter admin name" />
              </Form.Item>

              {/* Date of Establishment */}
              <Form.Item
                label="Date of Establishment"
                name="dateOfEstablishment"
                rules={[
                  {
                    required: true,
                    message: "Please select date of establishment",
                  },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              {/* Date of Opening */}
              <Form.Item
                label="Date of Opening"
                name="dateOfOpening"
                rules={[
                  { required: true, message: "Please select date of opening" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <div className="md:col-span-2 text-right">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  // ✅ Updated Save Button Hover
                  className="bg-[#10314A] hover:!bg-[#13c2c2] border-none"
                >
                  Save Agent
                </Button>
              </div>
            </Form>
          </Card>
        </ConfigProvider>
      )}

      {/* Table */}
      <AgentTable columns={columns} data={agents} loading={fetching} />
    </div>
  );
};

export default ResponsiveAgentForm;