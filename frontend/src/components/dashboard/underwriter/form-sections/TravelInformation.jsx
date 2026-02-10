import React from "react";
import { Form, Select, DatePicker, Radio } from "antd";
import { GlobalOutlined, CalendarOutlined } from "@ant-design/icons";
import SectionHeader from "./SectionHeader";
import { getDurationOptions } from "../underwriterConstants";

const { Option } = Select;

const TravelInformation = ({ agents, loadingAgents, selectedPackage }) => {
  return (
    <div>
      <SectionHeader icon={<GlobalOutlined />} title="Travel Information" />

      <Form.Item
        label="Travel Policy For"
        name="policyFor"
        rules={[{ required: true, message: "Required" }]}
      >
        <Select placeholder="Select Nationality">
          <Option value="pakistani">Pakistani National</Option>
          <Option value="foreigner">Foreigner</Option>
        </Select>
      </Form.Item>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Form.Item
            label="Date From"
            name="dateFrom"
            rules={[{ required: true, message: "Start date required" }]}
          >
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Duration"
            name="days"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Duration">
              {getDurationOptions(selectedPackage).map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <Form.Item
        label="Country to Travel"
        name="country"
        rules={[{ required: true, message: "Destination required" }]}
      >
        <Select showSearch placeholder="Select Destination">
          <Option value="germany">Germany</Option>
          <Option value="france">France</Option>
          <Option value="italy">Italy</Option>
          <Option value="spain">Spain</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Agent Name" name="agentId" rules={[{ required: false }]}>
        <Select
          showSearch
          allowClear
          loading={loadingAgents}
          placeholder="Select agent (Optional)"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {agents.map((agent) => (
            <Option key={agent.id} value={agent.id}>
              {agent.agentName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Covid 19 Cover">
        <Radio.Group disabled>
          <Radio value="covered" className="border p-3 rounded-lg bg-gray-50">
            Yes, Covered
          </Radio>
        </Radio.Group>
      </Form.Item>
    </div>
  );
};

export default TravelInformation;