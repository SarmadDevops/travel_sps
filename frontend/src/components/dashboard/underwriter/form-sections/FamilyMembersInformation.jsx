import React from "react";
import { Form, Input, DatePicker, Divider, Select, Radio } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import SectionHeader from "./SectionHeader";
import { CNIC_PATTERN, PASSPORT_PATTERN } from "../underwriterConstants";

const { Option } = Select;

const FamilyMembersInformation = ({
  planType,
  numberOfChildren,
  setNumberOfChildren,
  form,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-10">
        <h3 className="text-[#10314a] font-bold mb-4 text-lg">
          Select Coverage Type <span className="text-red-500">*</span>
        </h3>
        <Form.Item name="planType" className="mb-0">
          <Radio.Group buttonStyle="solid" size="large">
            <Radio.Button value="single" className="w-40 h-12">
              Single
            </Radio.Button>
            <Radio.Button value="family" className="w-40 h-12">
              Family
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>

      {planType === "family" && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
          <SectionHeader
            icon={<TeamOutlined />}
            title="Family Members Information"
          />

          <div className="mb-6">
            <h4 className="text-[#10314a] font-bold mb-4">Spouse Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Spouse Name"
                name="spouseName"
                rules={[
                  { required: true, message: "Required" },
                  { min: 3, message: "Min 3 characters" },
                  { max: 30, message: "Max 30 characters" },
                ]}
              >
                <Input placeholder="Enter spouse name" />
              </Form.Item>
              <Form.Item
                label="Spouse Passport"
                name="spousePassport"
                rules={[
                  { required: true, message: "Required" },
                  {
                    pattern: PASSPORT_PATTERN,
                    message: "Alphanumeric only (e.g., AA123456)",
                  },
                ]}
              >
                <Input
                  placeholder="AA123456"
                  maxLength={9}
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => {
                    const uppercaseValue = e.target.value.toUpperCase();
                    e.target.value = uppercaseValue;
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Spouse CNIC"
                name="spouseCnic"
                rules={[
                  { required: true, message: "Required" },
                  {
                    pattern: CNIC_PATTERN,
                    message: "Format: 13 digits (no dashes)",
                  },
                ]}
              >
                <Input placeholder="4220112345671" maxLength={13} />
              </Form.Item>
              <Form.Item
                label="Spouse DOB"
                name="spouseDob"
                rules={[{ required: true, message: "Required" }]}
              >
                <DatePicker format="DD/MM/YYYY" className="w-full" />
              </Form.Item>
            </div>
          </div>

          <Divider />

          <div>
            <h4 className="text-[#10314a] font-bold mb-4">Children Details</h4>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Number of Children (Max 3)
              </label>
              <Select
                value={numberOfChildren}
                onChange={(value) => {
                  setNumberOfChildren(value);
                  for (let i = value + 1; i <= 3; i++) {
                    form.setFieldsValue({
                      [`child${i}Name`]: undefined,
                      [`child${i}Age`]: undefined,
                      [`child${i}Passport`]: undefined,
                    });
                  }
                }}
                className="w-full md:w-48"
              >
                <Option value={0}>No Children</Option>
                <Option value={1}>1 Child</Option>
                <Option value={2}>2 Children</Option>
                <Option value={3}>3 Children</Option>
              </Select>
            </div>
            {Array.from({ length: numberOfChildren }, (_, index) => {
              const num = index + 1;
              return (
                <div key={num} className="mb-4 p-4 bg-white rounded-lg">
                  <p className="font-semibold text-gray-700 mb-3">
                    Child {num}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                      label="Name"
                      name={`child${num}Name`}
                      rules={[
                        { required: true, message: "Required" },
                        { min: 3, message: "Min 3 characters" },
                        { max: 30, message: "Max 30 characters" },
                      ]}
                    >
                      <Input placeholder="Child name" />
                    </Form.Item>
                    <Form.Item
                      label="Age (years)"
                      name={`child${num}Age`}
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Select placeholder="Select age">
                        {Array.from({ length: 18 }, (_, i) => i).map((age) => (
                          <Option key={age} value={age}>
                            {age} {age === 1 ? "Year" : "Years"}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Passport"
                      name={`child${num}Passport`}
                      rules={[
                        {
                          pattern: PASSPORT_PATTERN,
                          message: "Alphanumeric only (e.g., AA123456)",
                        },
                      ]}
                    >
                      <Input
                        placeholder="AA123456"
                        maxLength={9}
                        style={{ textTransform: "uppercase" }}
                        onChange={(e) => {
                          const uppercaseValue = e.target.value.toUpperCase();
                          e.target.value = uppercaseValue;
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default FamilyMembersInformation;
