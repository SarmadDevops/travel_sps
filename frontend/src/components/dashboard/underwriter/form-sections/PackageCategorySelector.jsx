import React from "react";
import { Form, Radio } from "antd";

const PackageCategorySelector = () => {
  return (
    <div className="mb-10">
      <h3 className="text-gray-600 font-bold mb-4 text-base">
        SELECT PACKAGE CATEGORY <span className="text-red-500">*</span>
      </h3>
      <Form.Item
        name="package"
        className="mb-0"
        rules={[{ required: true, message: "Please select a package" }]}
      >
        <Radio.Group className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["WORLDWIDE", "REST OF WORLD", "SCHENGEN", "STUDENT PLAN"].map(
              (pkg) => (
                <Radio.Button
                  key={pkg}
                  value={pkg.toLowerCase().replace(/ /g, "-")}
                  className="w-full text-center flex items-center justify-center !h-12 text-sm font-semibold"
                  style={{
                    borderColor: "#13c2c2",
                  }}
                >
                  {pkg}
                </Radio.Button>
              ),
            )}
          </div>
        </Radio.Group>
      </Form.Item>

      <style jsx global>{`
        .ant-radio-button-wrapper-checked {
          background: linear-gradient(
            135deg,
            #13c2c2 0%,
            #36cfc9 100%
          ) !important;
          border-color: #13c2c2 !important;
          box-shadow: 0 4px 12px rgba(19, 194, 194, 0.3) !important;
          color: #ffffff !important;
        }
        .ant-radio-button-wrapper-checked span {
          color: #ffffff !important;
          font-weight: 700 !important;
        }
        .ant-radio-button-wrapper-checked:hover {
          background: linear-gradient(
            135deg,
            #13c2c2 0%,
            #36cfc9 100%
          ) !important;
          border-color: #13c2c2 !important;
          box-shadow: 0 4px 12px rgba(19, 194, 194, 0.3) !important;
          color: #ffffff !important;
        }
        .ant-radio-button-wrapper-checked:hover span {
          color: #ffffff !important;
          font-weight: 700 !important;
        }
        .ant-radio-button-wrapper {
          color: #4b5563 !important;
        }
      `}</style>
    </div>
  );
};

export default PackageCategorySelector;
