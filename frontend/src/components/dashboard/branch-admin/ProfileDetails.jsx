import React from "react";
import { Card, Badge, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BankOutlined,
  CalendarOutlined,
  IdcardOutlined,
  DollarOutlined,
  PercentageOutlined,
} from "@ant-design/icons";

const ProfileDetails = ({ branchData }) => {
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
            <BankOutlined className="text-2xl text-[#13c2c2]" />
            <h2 className="text-2xl font-bold text-[#10314a] m-0">
              Branch Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              icon={<BankOutlined />}
              label="Branch Name"
              value={branchData?.branchName}
              color="#13c2c2"
            />
            <InfoCard
              icon={<EnvironmentOutlined />}
              label="City"
              value={branchData?.city}
              color="#52c41a"
            />
            <InfoCard
              icon={<PhoneOutlined />}
              label="Phone"
              value={branchData?.branchPhone}
              color="#1890ff"
            />
            <InfoCard
              icon={<MailOutlined />}
              label="Official Email"
              value={branchData?.branchOfficialEmail}
              color="#722ed1"
            />
            <InfoCard
              icon={<EnvironmentOutlined />}
              label="Address"
              value={branchData?.branchAddress}
              color="#fa8c16"
            />
            <InfoCard
              icon={<CalendarOutlined />}
              label="Date of Opening"
              value={
                branchData?.branchDateOfOpening
                  ? new Date(branchData.branchDateOfOpening).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "-"
              }
              color="#eb2f96"
            />
          </div>
        </div>

        <Divider className="my-6" />

    
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <UserOutlined className="text-2xl text-[#13c2c2]" />
            <h2 className="text-2xl font-bold text-[#10314a] m-0">
              Admin Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              icon={<UserOutlined />}
              label="Admin Name"
              value={branchData?.adminName}
              color="#13c2c2"
            />
            <InfoCard
              icon={<MailOutlined />}
              label="Admin Email"
              value={branchData?.adminEmail}
              color="#722ed1"
            />
            <InfoCard
              icon={<PhoneOutlined />}
              label="Admin Contact"
              value={branchData?.adminContactNo}
              color="#1890ff"
            />
            <InfoCard
              icon={<IdcardOutlined />}
              label="Admin CNIC"
              value={branchData?.adminCnic}
              color="#fa8c16"
            />
          </div>
        </div>

        <Divider className="my-6" />

        <div>
          <div className="flex items-center gap-3 mb-4">
            <DollarOutlined className="text-2xl text-[#13c2c2]" />
            <h2 className="text-2xl font-bold text-[#10314a] m-0">
              Financial Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <InfoCard
              icon={<DollarOutlined />}
              label="Credit Limit"
              value={branchData?.creditTrial}
              color="#52c41a"
            />
            <InfoCard
              icon={<PercentageOutlined />}
              label="Commission Slab"
              value={branchData?.commissionSlab}
              color="#eb2f96"
            />
          </div>
        </div>

      
        <div className="mt-6 flex justify-end">
          <Badge
            status="success"
            text={
              <span className="text-sm font-semibold text-gray-600">
                Active Branch
              </span>
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default ProfileDetails;
