import React from "react";
import { Form, Radio, Select, Button, Space } from "antd";
import { FileProtectOutlined, SaveOutlined } from "@ant-design/icons";
import SectionHeader from "./SectionHeader";
import { PLAN_OPTIONS } from "../underwriterConstants";

const { Option } = Select;

const PlanSelectionSubmission = ({
  selectedPackage,
  calculatedPrices,
  submitting,
  handleSubmitPolicy,
  planRequired,
}) => {
  return (
    <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl p-6 md:p-8">
      <SectionHeader
        icon={<FileProtectOutlined />}
        title="Plan Selection & Submission"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div>
          <label className="block text-gray-700 font-bold mb-3">
            Select Plan Category <span className="text-red-500">*</span>
          </label>

          <Form.Item
            name="planRequired"
            rules={[{ required: true, message: "Please select a plan" }]}
            className="mb-0"
          >
            <Radio.Group className="flex flex-col gap-3 w-full">
              {(PLAN_OPTIONS[selectedPackage] || []).map((plan) => {
                const price = calculatedPrices[plan];

                const displayName =
                  plan === "goldPlus"
                    ? "Gold Plus"
                    : plan.charAt(0).toUpperCase() + plan.slice(1);

                return (
                  <Radio
                    key={plan}
                    value={plan}
                    className="bg-white border border-gray-200 p-4 rounded-lg flex items-center shadow-sm hover:border-[#13c2c2] transition-colors w-full"
                  >
                    <div className="flex justify-between items-center w-full pr-4 gap-6">
                      <span className="font-bold text-[#10314a]">
                        {displayName} Plan
                      </span>
                      {price !== undefined ? (
                        <span className="text-[#13c2c2] font-bold text-lg whitespace-nowrap">
                          PKR {price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>

          {Object.keys(calculatedPrices).length > 0 && (
            <p className="text-gray-700 font-semibold mt-4">
              Selected Plan Price:{" "}
              <span className="text-[#13c2c2] font-bold">
                {planRequired
                  ? `PKR ${
                      calculatedPrices[planRequired]?.toLocaleString() || "N/A"
                    }`
                  : "Please select a plan"}
              </span>
            </p>
          )}
        </div>

        {/* Two separate buttons */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Policy View <span className="text-red-500">*</span>
            </label>
            <Form.Item name="policyView" className="mb-0">
              <Select>
                <Option value="pdf">Download PDF</Option>
                <Option value="email">Send Email</Option>
              </Select>
            </Form.Item>
          </div>

          <Space direction="vertical" className="w-full" size="middle">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="large"
              loading={submitting}
              onClick={handleSubmitPolicy}
              block
              className="bg-[#13c2c2] border-[#13c2c2] hover:bg-[#0e9d9d]"
            >
              Submit Policy
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionSubmission;