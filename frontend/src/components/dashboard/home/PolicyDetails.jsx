import React, { useState, useEffect } from "react";
import { Button, Card, Divider, message, Tag, Grid } from "antd";
import {
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  updatePolicyStatusAndPaymentApi,
  updatePolicyStatusApi,
} from "../../../api/underWriting";
import dayjs from "dayjs";

import { generatePolicyPDF } from "../../../utils/pdfGenerator";
import { getAllSchengenPackages } from "../../../api/schengenPackage";
import { getAllWorldWidePackages } from "../../../api/worldWidePackages";
import { getAllRestOfWorldPackages } from "../../../api/restOfWorld";
import { getAllStudentPackages } from "../../../api/studentPackage";

import SuperAdminNotesModal from "./SuperAdminNotesModal";

const PACKAGE_API_MAP = {
  SCHENGEN: getAllSchengenPackages,
  WORLDWIDE: getAllWorldWidePackages,
  REST_OF_WORLD: getAllRestOfWorldPackages,
  STUDENT_PLAN: getAllStudentPackages,
};

const DetailBox = ({
  label,
  value,
  color = "gray",
  className = "",
  onEdit,
}) => (
  <div
    className={`relative bg-gradient-to-br from-${color}-50 to-white p-4 rounded-xl border border-${color}-200 hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex justify-between items-start mb-1">
      <p
        className={`text-xs font-semibold text-${color}-600 uppercase tracking-wide`}
      >
        {label}
      </p>
      {onEdit && (
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          className="text-[#13c2c2] hover:bg-cyan-50"
          onClick={onEdit}
        />
      )}
    </div>

    <p className="text-base font-bold text-[#10314a] whitespace-pre-wrap break-words">
      {value || "—"}
    </p>
  </div>
);

const PolicyDetails = ({ data: policyData, readOnly = false }) => {
  const [status, setStatus] = useState(
    policyData?.postStatus || policyData?.status || "PENDING",
  );
  const [paymentStatus, setPaymentStatus] = useState(
    policyData?.paymentStatus || "UNPAID",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [superAdminNotes, setSuperAdminNotes] = useState(
    policyData?.superAdminNotes || "",
  );

  // Update state when policyData prop changes (e.g., after refresh/refetch)
  useEffect(() => {
    if (policyData) {
      setStatus(policyData.postStatus || policyData.status || "PENDING");
      setPaymentStatus(policyData.paymentStatus || "UNPAID");
      setSuperAdminNotes(policyData.superAdminNotes || "");
    }
  }, [policyData]);

  if (!policyData) return <div className="p-6">Loading policy details...</div>;

  const handlePrint = async () => {
    setGeneratingPDF(true);
    try {
      const rawPkgType = policyData.packageType || "";
      const pkgKey = rawPkgType.toUpperCase().replace(/-/g, "_");
      const apiFn = PACKAGE_API_MAP[pkgKey];
      let packagesData = [];

      if (apiFn) {
        try {
          const res = await apiFn();
          packagesData = res?.packages || res || [];
        } catch (error) {
          console.warn("Error fetching packages", error);
        }
      }

      const formValues = {
        insuredName: policyData.insuredName,
        dob: policyData.dob,
        passport: policyData.passportNo,
        cnic: policyData.cnic,
        contact: policyData.contactNo,
        address: policyData.address,
        beneficiary: policyData.beneficiaryName,
        beneficiaryRelationship: policyData.beneficiaryRelationship,
        country: policyData.countryToTravel,
        planType: (policyData.policyType || "").toLowerCase(),
        planRequired: policyData.plan,
        dateFrom: policyData.dateFrom,
        days: policyData.durationDays,
        agentId: policyData.Agent?.agentName || "Direct",
        spouseName: policyData.spouseName,
        spousePassport: policyData.spousePassport,
        spouseCnic: policyData.spouseCnic,
        spouseDob: policyData.spouseDob,
      };

      if (policyData.children?.length) {
        policyData.children.forEach((child, index) => {
          const num = index + 1;
          formValues[`child${num}Name`] = child.name;
          formValues[`child${num}Passport`] = child.passportNo;
          formValues[`child${num}Age`] = child.dob
            ? dayjs().diff(dayjs(child.dob), "year")
            : child.age || "0";
        });
      }

      await generatePolicyPDF({
        formValues,
        selectedPrice: policyData.policyAmount,
        policyNumber: policyData.policyNumber || policyData.policyNo,
        packagesData,
        policyStatus: status,
        paymentStatus: paymentStatus,
        isPrintAction: true,
      });
      message.success("PDF Downloaded");
    } catch (error) {
      message.error("PDF Failed");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handlePostAndPay = async () => {
    try {
      await updatePolicyStatusAndPaymentApi(policyData.id, {
        postStatus: "POSTED",
      });
      setStatus("POSTED");
      setPaymentStatus("PAID");
      message.success("Policy Posted & Paid");
    } catch (error) {
      message.error("Update Failed");
    }
  };

  const cancelPolicy = async () => {
    try {
      if (status === "CANCELLED") return message.warning("Already Cancelled");
      await updatePolicyStatusApi(policyData.id, { postStatus: "CANCELLED" });
      setStatus("CANCELLED");
      message.success("Policy Cancelled");
    } catch (error) {
      message.error("Cancel Failed");
    }
  };

  return (
    <div className="animate-fade-in w-full">
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
                  {policyData.insuredName}
                </h2>
                <span className="text-sm text-gray-500 font-medium">
                  Policy Details Overview
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Tag
                color={paymentStatus === "PAID" ? "blue" : "red"}
                className="px-4 py-1 text-sm font-bold"
              >
                {paymentStatus}
              </Tag>
              <Tag
                color={
                  status === "POSTED"
                    ? "green"
                    : status === "CANCELLED"
                      ? "red"
                      : "volcano"
                }
                className="px-4 py-1 text-sm font-bold"
              >
                {status}
              </Tag>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DetailBox
            label="Policy No"
            value={policyData.policyNumber || policyData.policyNo}
          />
          <DetailBox label="Plan" value={policyData.plan} />
          <DetailBox label="Policy Amount" value={policyData.policyAmount} />
          <DetailBox label="Producer" value={policyData.User?.name} />
          <DetailBox label="Agent" value={policyData.Agent?.agentName} />
          <DetailBox label="Branch" value={policyData.Branch?.name} />
          <DetailBox
            label="Issue Date"
            value={
              policyData.createdAt
                ? new Date(policyData.createdAt).toLocaleDateString()
                : policyData.issueDate
            }
          />
          <DetailBox
            label="Effective Date"
            value={
              policyData.dateFrom
                ? new Date(policyData.dateFrom).toLocaleDateString()
                : policyData.effectiveDate
            }
          />
          <DetailBox
            label="Expiry Date"
            value={
              policyData.dateTo
                ? new Date(policyData.dateTo).toLocaleDateString()
                : policyData.expiryDate
            }
          />
          <DetailBox label="Travel For" value={policyData.travelPolicyFor} />
          <DetailBox label="Country" value={policyData.countryToTravel} />
          <DetailBox
            label="Duration"
            value={`${policyData.durationDays} Days`}
          />
          <DetailBox label="Passport No" value={policyData.passportNo} />
          <DetailBox label="CNIC" value={policyData.cnic} />
          <DetailBox label="Contact No" value={policyData.contactNo} />
          <DetailBox label="Beneficiary" value={policyData.beneficiaryName} />
          <DetailBox
            label="Relation"
            value={policyData.beneficiaryRelationship}
          />

          {/*  COVID COVERED (Moved Here) */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Covid Covered
            </p>
            <Tag
              color={policyData.covidCovered ? "green" : "red"}
              className="text-sm font-bold px-3 py-1 rounded-lg mt-1"
            >
              {policyData.covidCovered ? "YES" : "NO"}
            </Tag>
          </div>

          {policyData.spouseName && (
            <>
              <DetailBox
                label="Spouse Name"
                value={policyData.spouseName}
                color="blue"
              />
              <DetailBox
                label="Spouse Passport"
                value={policyData.spousePassport}
                color="blue"
              />
              <DetailBox
                label="Spouse CNIC"
                value={policyData.spouseCnic}
                color="blue"
              />
            </>
          )}

          {/*  FULL WIDTH SECTIONS FOR NOTES */}

          <DetailBox
            label="UnderWriter Notes"
            value={policyData.underWriterNotes}
            className="col-span-1 sm:col-span-2 lg:col-span-3"
          />

          {/*  SUPER ADMIN NOTES (Editable & Flexible) */}
          <DetailBox
            label="Super Admin Notes"
            value={superAdminNotes}
            className="col-span-1 sm:col-span-2 lg:col-span-3 bg-cyan-50 border-cyan-200" // Highlighted slightly
            onEdit={!readOnly ? () => setIsModalOpen(true) : null}
          />
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-200 shadow-md mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
              Premium Amount
            </p>
            <p className="text-xl sm:text-3xl font-bold text-emerald-700">
              PKR{" "}
              {Number(
                policyData.netPremium || policyData.policyAmount || 0,
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Children Details Section */}
        {policyData.children?.length > 0 && (
          <>
            <Divider className="my-6" orientation="left">
              <span className="text-lg font-bold text-gray-700">
                Children Details
              </span>
            </Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {policyData.children.map((child, index) => (
                <div
                  key={index}
                  className="bg-purple-50 p-5 rounded-xl border border-purple-200"
                >
                  <h4 className="font-bold text-[#10314a] mb-2">
                    Child {index + 1}
                  </h4>
                  <p className="text-sm">
                    Name: <b>{child.name}</b>
                  </p>
                  <p className="text-sm">
                    Passport: <b>{child.passportNo}</b>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <Divider className="my-6" />

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            size="large"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            loading={generatingPDF}
          >
            Print
          </Button>
          {status !== "CANCELLED" && (
            <Button
              size="large"
              danger
              icon={<CloseCircleOutlined />}
              onClick={cancelPolicy}
            >
              Cancel Policy
            </Button>
          )}
          {!readOnly && status !== "CANCELLED" && (
            <Button
              size="large"
              type="primary"
              className="bg-[#13c2c2] hover:bg-teal-600"
              icon={<CheckCircleOutlined />}
              onClick={handlePostAndPay}
            >
              Post & Mark Paid
            </Button>
          )}
        </div>
      </Card>

      <SuperAdminNotesModal
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        policyId={policyData.id}
        initialNotes={superAdminNotes}
        onSuccess={(updatedNotes) => setSuperAdminNotes(updatedNotes)}
      />
    </div>
  );
};

export default PolicyDetails;
