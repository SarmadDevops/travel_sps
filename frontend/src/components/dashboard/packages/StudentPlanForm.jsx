import React, { useState } from "react";
import {
  Select,
  InputNumber,
  Card,
  Typography,
  Row,
  Col,
  ConfigProvider,
  message,
} from "antd";
import { ReadOutlined, CalendarOutlined } from "@ant-design/icons";
import { createStudentPackage } from "../../../api/studentPackage"; 

const { Title, Text } = Typography;


const studentOptions = [
  { value: "180", label: "180 Days" },
  { value: "365", label: "365 Days" },
  { value: "2 Years", label: "2 Years" },
];

const StudentPlanForm = ({ onSuccess }) => {
  const [duration, setDuration] = useState(null);
  const [scholar, setScholar] = useState(0);
  const [scholarPlus, setScholarPlus] = useState(0);
  const [scholarPro, setScholarPro] = useState(0);
  const [loading, setLoading] = useState(false);

  const themeConfig = {
    token: {
      colorPrimary: "#13c2c2",
      borderRadius: 6,
    },
    components: {
      InputNumber: {
        controlWidth: "100%",
        colorPrimaryHover: "#13c2c2",
      },
      Select: {
        controlWidth: "100%",
        colorPrimaryHover: "#13c2c2",
      },
    },
  };


  const handleSubmit = async () => {
    if (!duration) {
      message.error("Please select a duration");
      return;
    }

    const payload = {
      duration,
      scholar,
      scholarPlus,
      scholarPro,
    };

    try {
      setLoading(true);
      await createStudentPackage(payload);
      message.success("Student plan created successfully");
      setDuration(null);
      setScholar(0);
      setScholarPlus(0);
      setScholarPro(0);

      if (onSuccess) onSuccess();
    } catch (err) {
      message.error(err.message || "Failed to create student plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="p-4 bg-gray-50  flex justify-center">
        <Card
          className="w-full max-w-4xl shadow-xl border-0 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
     
          <div
            style={{
              background:
                "linear-gradient(to bottom, #1A3A5C 0%, #1F7B85 100%)",
              padding: "1.5rem",
            }}
          >
            <Title
              level={3}
              style={{
                color: "white",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <ReadOutlined /> Student Plan Management
            </Title>
            <Text className="text-blue-100 opacity-80">
              Manage pricing and duration for student insurance packages
            </Text>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <CalendarOutlined className="text-[#10314a]" />
                <Title level={5} style={{ margin: 0, fontWeight: "600" }}>
                  Duration Details
                </Title>
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Text className="block mb-2 text-[#10314a] font-semibold text-sm">
                    Duration
                  </Text>
                  <Select
                    size="large"
                    placeholder="Select duration"
                    value={duration}
                    onChange={setDuration}
                 
                    options={studentOptions} 
                  />
                </Col>
              </Row>
            </section>

        
            <section>
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <Title level={5} style={{ margin: 0, fontWeight: "600" }}>
                  Plans
                </Title>
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Text className="block mb-2 text-[#10314a] font-semibold text-sm">
                    Scholar
                  </Text>
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="0"
                    value={scholar}
                    onChange={setScholar}
                    min={0}
                    controls={false}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    formatter={(value) =>
                      `RS ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/RS\s?|(,*)/g, "")}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <Text className="block mb-2 text-[#10314a] font-semibold text-sm">
                    Scholar Plus
                  </Text>
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="0"
                    value={scholarPlus}
                    onChange={setScholarPlus}
                    min={0}
                    controls={false}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    formatter={(value) =>
                      `RS ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/RS\s?|(,*)/g, "")}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <Text className="block mb-2 text-[#10314a] font-semibold text-sm">
                    Scholar Pro
                  </Text>
                  <InputNumber
                    size="large"
                    className="w-full"
                    placeholder="0"
                    value={scholarPro}
                    onChange={setScholarPro}
                    min={0}
                    controls={false}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    formatter={(value) =>
                      `RS ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/RS\s?|(,*)/g, "")}
                  />
                </Col>
              </Row>
            </section>

     
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#10314a] text-white px-8 py-2 rounded-md hover:bg-[#13c2c2] transition-all font-semibold shadow-md active:scale-95"
              >
                {loading ? "Saving..." : "Save Plan"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default StudentPlanForm;