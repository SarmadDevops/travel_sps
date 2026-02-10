import React from "react";
import { Button, Card, Divider, Tag } from "antd"; 
import {
  PrinterOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const PolicyVerificationCard = ({ data }) => {

  if (!data) return null;

 
  const paymentStatus = data.paymentStatus || "UNPAID";
  const postStatus = data.postStatus || data.status || "PENDING";

  return (
    <div className="animate-fade-in w-full mt-6">
      <Card
        className="shadow-lg border-0 rounded-2xl overflow-hidden w-full"
        style={{ borderTop: "4px solid #13c2c2" }}
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl shadow-lg shrink-0">
                <FileTextOutlined className="text-2xl text-white" />
              </div>
              <div className="overflow-hidden min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#10314a] m-0 truncate">
                  {data.insuredName}
                </h2>
                <span className="text-sm text-gray-500 font-medium">Policy Search Result</span>
              </div>
            </div>
            
          
            <div className="flex gap-2 shrink-0 mt-1 sm:mt-0">
                <Tag color={paymentStatus === "PAID" ? "blue" : "red"} className="px-4 py-1 text-sm rounded-lg font-bold border-0 shadow-sm">
                    {paymentStatus}
                </Tag>
                <Tag color={postStatus === "POSTED" ? "green" : "volcano"} className="px-4 py-1 text-sm rounded-lg font-bold border-0 shadow-sm">
                    {postStatus}
                </Tag>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DetailBox label="Policy No" value={data.policyNumber || data.policyNo} />
          <DetailBox label="Plan" value={data.plan} />
          <DetailBox label="Policy Amount" value={data.policyAmount} />
          <DetailBox label="Producer" value={data.User?.name || "—"} />
          <DetailBox label="Agent" value={data.Agent?.agentName || "—"} />
          <DetailBox label="Branch" value={data.Branch?.name || "—"} />
          
          <DetailBox label="Issue Date" value={data.createdAt ? new Date(data.createdAt).toLocaleDateString() : data.issueDate} />
          <DetailBox label="Effective Date" value={data.dateFrom ? new Date(data.dateFrom).toLocaleDateString() : data.effectiveDate} />
          <DetailBox label="Expiry Date" value={data.dateTo ? new Date(data.dateTo).toLocaleDateString() : data.expiryDate} />
          
          <DetailBox label="Travel For" value={data.travelPolicyFor} />
          <DetailBox label="Country" value={data.countryToTravel} />
          <DetailBox label="Duration" value={`${data.durationDays || 0} Days`} />
          
          <DetailBox label="Passport No" value={data.passportNo} />
          <DetailBox label="CNIC" value={data.cnic} />
          <DetailBox label="Contact No" value={data.contactNo} />
          
          <DetailBox label="Beneficiary" value={data.beneficiaryName} />
          <DetailBox label="Relation" value={data.beneficiaryRelationship} />
          <DetailBox label="Covid Covered">
             <Tag color={data.covidCovered ? "green" : "red"} className="text-xs font-bold px-2 py-0.5 rounded">
               {data.covidCovered ? "YES" : "NO"}
             </Tag>
          </DetailBox>

          {data.spouseName && (
             <>
                <DetailBox label="Spouse Name" value={data.spouseName} isBlue />
                <DetailBox label="Spouse Passport" value={data.spousePassport} isBlue />
                <DetailBox label="Spouse CNIC" value={data.spouseCnic} isBlue />
             </>
          )}
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-200 shadow-md mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Premium Amount</p>
            <p className="text-xl sm:text-3xl font-bold text-emerald-700">
              PKR {Number(data.netPremium || data.policyAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Children Details */}
        {data.children && data.children.length > 0 && (
          <>
            <Divider className="my-6" orientation="left">
              <span className="text-lg font-bold text-gray-700">Children Details</span>
            </Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {data.children.map((child, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-[#10314a] text-base">Child {index + 1}</h4>
                    </div>
                    <div className="space-y-2">
                        <MiniDetail label="Name" value={child.name} color="text-purple-600" />
                        <MiniDetail label="DOB" value={child.dob} color="text-purple-600" />
                        <MiniDetail label="Passport" value={child.passportNo} color="text-purple-600" />
                    </div>
                </div>
                ))}
            </div>
          </>
        )}

        <Divider className="my-6" />
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex justify-end gap-3 min-w-max">
                <Button 
                    size="large" 
                    icon={<PrinterOutlined />} 
                    className="border-2 border-gray-300 text-gray-600 hover:!text-gray-800 hover:!border-gray-400 hover:!bg-gray-50 font-semibold px-8"
                >
                    Print
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
};


const DetailBox = ({ label, value, isBlue, children }) => (
  <div className={`bg-gradient-to-br ${isBlue ? 'from-blue-50 border-blue-200' : 'from-gray-50 border-gray-200'} to-white p-4 rounded-xl border hover:shadow-md transition-shadow`}>
    <p className={`text-xs font-semibold ${isBlue ? 'text-blue-600' : 'text-gray-500'} uppercase tracking-wide mb-1`}>{label}</p>
    {children ? children : <p className="text-base font-bold text-[#10314a] truncate">{value}</p>}
  </div>
);

const MiniDetail = ({ label, value, color }) => (
    <div>
        <p className={`text-xs font-semibold ${color} uppercase tracking-wide`}>{label}</p>
        <p className="text-sm font-bold text-[#10314a]">{value}</p>
    </div>
);

export default PolicyVerificationCard;