import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, ConfigProvider } from "antd";
import { SaveOutlined, CalendarOutlined } from "@ant-design/icons";

const EditPackageModal = ({ visible, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onUpdate({ ...initialValues, ...values });
      form.resetFields();
    });
  };

  const hasField = (field) =>
    initialValues && initialValues.hasOwnProperty(field);
  const PriceInput = ({ label, name }) => (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required: true,
          message: "Price is required and must be a decimal number",
        },
        {
          type: "number",
          min: 0,
          message: "Price must be a positive number",
        },
      ]}
    >
      <InputNumber
        style={{ width: "100%" }}
        formatter={(v) => ` ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
        stringMode={false}
        step={1}
        onKeyPress={handleKeyPress}
        onPaste={handlePaste}
      />
    </Form.Item>
  );

  const handleKeyPress = (e) => {
    if ([8, 9, 37, 39, 46].includes(e.keyCode) || e.ctrlKey || e.metaKey) {
      return;
    }
    if (!/[0-9.]/.test(e.key)) {
      e.preventDefault();
    }
  };
  const handlePaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    if (!/^\d*\.?\d*$/.test(paste)) {
      e.preventDefault();
    }
  };

  const themeConfig = React.useMemo(
    () => ({
      token: { colorPrimary: "#13c2c2", borderRadius: 8 },
      components: { Button: { fontWeight: 600 } },
    }),
    [],
  );

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#13c2c2", borderRadius: 8 },
        components: { Button: { fontWeight: 600 } },
      }}
    >
      <Modal
        open={visible}
        title={
          <span className="text-[#10314a] font-bold text-lg">
            Update Package Details
          </span>
        }
        onCancel={onCancel}
        centered
        width={null}
        className="!w-[95%] xs:!w-[340px] sm:!w-[450px] md:!w-[600px]"
        styles={{
          body: { maxHeight: "70vh", overflowY: "auto", paddingRight: "10px" },
        }}
        footer={[
          <Button key="cancel" onClick={onCancel} className="hover:bg-gray-100">
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            className="bg-[#10314a] hover:!bg-[#0a2339]"
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="col-span-1 md:col-span-2 border-b mb-2 pb-2 text-[#13c2c2] font-semibold text-xs uppercase tracking-wide">
            Duration Settings
          </div>
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Duration is required" }]}
          >
            <Input prefix={<CalendarOutlined className="text-gray-400" />} />
          </Form.Item>

          {hasField("maxStay") && (
            <Form.Item
              label="Max Stay"
              name="maxStay"
              rules={[{ required: true, message: "Max Stay is required" }]}
            >
              <Input prefix={<CalendarOutlined className="text-gray-400" />} />
            </Form.Item>
          )}

          {(hasField("scholar") ||
            hasField("scholarPlus") ||
            hasField("scholarPro") ||
            hasField("price") ||
            hasField("name")) && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#10314a] font-semibold text-xs uppercase tracking-wide">
                Student Plan Pricing (RS)
              </div>

              {hasField("name") && (
                <Form.Item
                  label="Package Name"
                  name="name"
                  rules={[
                    { required: true, message: "Package Name is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
              )}

              {hasField("passportNo") && (
                <Form.Item
                  label="Passport Number"
                  name="passportNo"
                  rules={[
                    { required: true, message: "Passport number is required" },
                    {
                      pattern: /^[A-Z0-9]+$/i,
                      message: "Invalid passport format",
                    },
                  ]}
                >
                  <Input
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="e.g. AB123456"
                  />
                </Form.Item>
              )}

              {hasField("price") && <PriceInput label="Price" name="price" />}

              {hasField("scholar") && (
                <PriceInput label="Scholar (RS)" name="scholar" />
              )}
              {hasField("scholarPlus") && (
                <PriceInput label="Scholar Plus (RS)" name="scholarPlus" />
              )}
              {hasField("scholarPro") && (
                <PriceInput label="Scholar Pro (RS)" name="scholarPro" />
              )}
            </>
          )}

          {hasField("diamondSingle") && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#10314a] font-semibold text-xs uppercase tracking-wide">
                Diamond Plan Pricing (RS)
              </div>
              <PriceInput label="Diamond Single" name="diamondSingle" />
              <PriceInput label="Diamond Family" name="diamondFamily" />
            </>
          )}

          {hasField("goldSingle") && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#fbbf24] font-semibold text-xs uppercase tracking-wide">
                Gold Plan Pricing (RS)
              </div>
              <PriceInput label="Gold Single" name="goldSingle" />
              <PriceInput label="Gold Family" name="goldFamily" />
            </>
          )}

          {hasField("platinumSingle") && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#64748b] font-semibold text-xs uppercase tracking-wide">
                Platinum Plan Pricing (RS)
              </div>
              <PriceInput label="Platinum Single" name="platinumSingle" />
              <PriceInput label="Platinum Family" name="platinumFamily" />
            </>
          )}

          {hasField("goldPlusSingle") && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#fbbf24] font-semibold text-xs uppercase tracking-wide">
                Gold Plus Pricing (RS)
              </div>
              <PriceInput label="Gold Plus Single" name="goldPlusSingle" />
              <PriceInput label="Gold Plus Family" name="goldPlusFamily" />
            </>
          )}
          {hasField("titaniumSingle") && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#374151] font-semibold text-xs uppercase tracking-wide">
                Titanium Pricing (RS)
              </div>
              <PriceInput label="Titanium Single" name="titaniumSingle" />
              <PriceInput label="Titanium Family" name="titaniumFamily" />
            </>
          )}

          {hasField("singleCareSingle") && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#0891b2] font-semibold text-xs uppercase tracking-wide">
                Single Care Plan (RS)
              </div>
              <PriceInput
                label="Single Care (Individual)"
                name="singleCareSingle"
              />
              <PriceInput
                label="Single Care (Family)"
                name="singleCareFamily"
              />
            </>
          )}

          {hasField("singleCarePlusSingle") && (
            <>
              <div className="col-span-1 md:col-span-2 border-b mt-2 mb-2 pb-2 text-[#0e7490] font-semibold text-xs uppercase tracking-wide">
                Single Care Plus Plan (RS)
              </div>
              <PriceInput
                label="SC Plus (Individual)"
                name="singleCarePlusSingle"
              />
              <PriceInput
                label="SC Plus (Family)"
                name="singleCarePlusFamily"
              />
            </>
          )}
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default EditPackageModal;
