import React, { useState, useEffect } from "react";
import { Button, Card, Divider, Modal, message, Tag } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EditAgentModal from "./EditAgentModal";

import {
  deleteAgentApi,
  updateAgentApi,
  reactivateAgentApi,
} from "../../../api/agent";

const { confirm } = Modal;

const AgentDetails = ({ agentData: initialAgentData }) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [agentData, setAgentData] = useState(initialAgentData);

  useEffect(() => {
    setAgentData(initialAgentData);
  }, [initialAgentData]);

  const handleReactivate = () => {
    confirm({
      title: "Activate Agent?",
      icon: <PlayCircleOutlined className="text-green-500" />,
      content: `Are you sure you want to re-activate ${agentData.agentName}?`,
      okText: "Activate",
      okType: "primary",
      async onOk() {
        try {
          await reactivateAgentApi(agentData.id || agentData.key);

          setAgentData({
            ...agentData,
            isActive: true,
          });

          message.success("Agent activated successfully");
        } catch (error) {
          message.error(error.message || "Failed to activate agent");
        }
      },
    });
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Agent?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete/deactivate ${agentData.agentName}.`,
      okType: "danger",
      okText: "Delete",
      async onOk() {
        try {
          await deleteAgentApi(agentData.id || agentData.key);
          setAgentData({ ...agentData, isActive: false });
          message.success("Agent deleted successfully");
        } catch (error) {
          message.error(error.message || "Failed to delete agent");
        }
      },
    });
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-500 hover:text-[#10314a]"
      >
        Back
      </Button>

      <Card
        className="shadow-lg border-0 rounded-2xl overflow-hidden"
        style={{ borderTop: "4px solid #13c2c2" }}
        title={
          <div className="flex items-center gap-4 py-2">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl shadow-lg">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#10314a] m-0">
                  {agentData.agentName}
                </h2>
                <Tag
                  icon={
                    agentData.isActive ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                  color={agentData.isActive ? "success" : "error"}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {agentData.isActive ? "Active" : "Inactive"}
                </Tag>
              </div>
              <p className="text-sm text-gray-500 m-0 mt-1">
                Agent Code:{" "}
                <span className="font-mono text-gray-700">
                  {agentData.agentCode}
                </span>
              </p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DetailItem label="Email" value={agentData.email} />
          <DetailItem
            label="Mobile No"
            value={agentData.mobileNo || agentData.agentPhone}
          />
          <DetailItem label="CNIC" value={agentData.agentCnic} />
          <DetailItem label="City" value={agentData.city} />
          <DetailItem
            label="Address"
            value={agentData.address || agentData.agentAddress}
          />
          <DetailItem
            label="Date of Establishment"
            value={
              agentData.dateOfEstablishment
                ? new Date(agentData.dateOfEstablishment).toLocaleDateString()
                : "-"
            }
          />
          <DetailItem
            label="Commission"
            value={
              agentData.commissionSlab ? `${agentData.commissionSlab}%` : "0%"
            }
          />
        </div>

        <Divider />
        <div className="flex flex-wrap justify-end gap-3">
          {!agentData.isActive && (
            <Button
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleReactivate}
              className="border-green-500 text-green-500 hover:!bg-green-50 hover:!text-green-600 hover:!border-green-600 font-semibold"
            >
              Reactivate Agent
            </Button>
          )}

          {agentData.isActive && (
            <>
              <Button
                size="large"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 border-0 font-semibold shadow-md"
              >
                Edit Agent
              </Button>

              <Button
                size="large"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                className="border-2 border-red-400 font-semibold"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </Card>

      <EditAgentModal
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdate={async (updatedValues) => {
          try {
            const apiPayload = {
              email: updatedValues.agentEmail,
              mobileNo: updatedValues.agentMobileNo,
            };

            await updateAgentApi(agentData.id || agentData.key, apiPayload);
            setAgentData({
              ...agentData,
              email: updatedValues.agentEmail,
              mobileNo: updatedValues.agentMobileNo,
            });
            setIsEditModalOpen(false);
            message.success("Agent updated successfully");
          } catch (error) {
            message.error(error.message || "Failed to update agent");
          }
        }}
        initialValues={agentData}
      />
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-base font-semibold text-[#10314a] break-words">
      {value || "-"}
    </p>
  </div>
);

export default AgentDetails;
