import React from "react";
import { Card, Badge, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  IdcardOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const AgentProfileDetails = ({ agentData }) => {
  const InfoCard = ({ icon, label, value, color = "#13c2c2" }) => (
    <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start gap-4">
        <div
          className="p-3 rounded-xl shadow-md"
          style={{ backgroundColor: `${color}15` }}
        >
          {React.cloneElement(icon, {
            className: "text-2xl",
            style: { color: color },
          })}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-base font-bold text-[#10314a] break-words">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <Card
        className="shadow-lg border-0 rounded-2xl overflow-hidden"
        style={{ borderTop: "4px solid #13c2c2" }}
      >
      
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <UserOutlined className="text-2xl text-[#13c2c2]" />
            <h2 className="text-2xl font-bold text-[#10314a] m-0">
              Agent Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              icon={<UserOutlined />}
              label="Agent Name"
              value={agentData?.agentName}
              color="#13c2c2"
            />
            <InfoCard
              icon={<TeamOutlined />}
              label="Agent Code"
              value={agentData?.agentCode}
              color="#52c41a"
            />
            <InfoCard
              icon={<MailOutlined />}
              label="Email"
              value={agentData?.agentEmail}
              color="#722ed1"
            />
            <InfoCard
              icon={<PhoneOutlined />}
              label="Mobile Number"
              value={agentData?.mobileNo}
              color="#1890ff"
            />
            <InfoCard
              icon={<IdcardOutlined />}
              label="CNIC"
              value={agentData?.agentCnic}
              color="#fa8c16"
            />
            <InfoCard
              icon={<EnvironmentOutlined />}
              label="City"
              value={agentData?.city}
              color="#eb2f96"
            />
            <InfoCard
              icon={<EnvironmentOutlined />}
              label="Address"
              value={agentData?.agentAddress}
              color="#faad14"
            />
            <InfoCard
              icon={<CalendarOutlined />}
              label="Date of Establishment"
              value={
                agentData?.dateOfEstablishment
                  ? new Date(agentData.dateOfEstablishment).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "-"
              }
              color="#13c2c2"
            />
            <InfoCard
              icon={<CalendarOutlined />}
              label="Date of Opening"
              value={
                agentData?.dateOfOpening
                  ? new Date(agentData.dateOfOpening).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "-"
              }
              color="#52c41a"
            />
          </div>
        </div>

        <Divider className="my-6" />

       
        <div>
          <div className="flex items-center gap-3 mb-4">
            <TeamOutlined className="text-2xl text-[#13c2c2]" />
            <h2 className="text-2xl font-bold text-[#10314a] m-0">
              Admin Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              icon={<UserOutlined />}
              label="Admin Name"
              value={agentData?.adminName}
              color="#13c2c2"
            />
            <InfoCard
              icon={<MailOutlined />}
              label="Admin Email"
              value={agentData?.adminEmail}
              color="#722ed1"
            />
          
          </div>
        </div>

     
        <div className="mt-6 flex justify-end">
          <Badge
            status="success"
            text={
              <span className="text-sm font-semibold text-gray-600">
                Active Agent
              </span>
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default AgentProfileDetails;
