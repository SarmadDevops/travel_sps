import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, message, Card, Divider, Empty, Spin, Tag } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  updateBranchApi,
  deleteBranchApi,
  reactivateBranchApi,
} from "../../../api/branch";
import { getAllAgentsByBranchId } from "../../../api/agent";

import EditBranchModal from "./EditBranchModal";
import AgentTable from "../agent/AgentTable";

const { confirm } = Modal;

const BranchDetails = ({
  branchData: initialBranchData,
  branchId,
  initialShowAgents = false,
}) => {
  const navigate = useNavigate();
  const agentsTableRef = useRef(null);

  const [branchData, setBranchData] = useState(initialBranchData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAgents, setShowAgents] = useState(initialShowAgents);
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  useEffect(() => {
    setBranchData(initialBranchData);
  }, [initialBranchData]);

  if (!branchData) return <div className="p-6">Loading branch data...</div>;

  const fetchAgents = async () => {
    setLoadingAgents(true);
    try {
      const branchAgents = await getAllAgentsByBranchId(
        branchId || branchData.key || branchData.id || branchData._id,
      );
      setAgents(branchAgents);
    } catch (error) {
      message.error("Failed to load agents");
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    if (showAgents) fetchAgents();
  }, [showAgents]);

  useEffect(() => {
    if (showAgents && agentsTableRef.current) {
      setTimeout(() => {
        agentsTableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showAgents]);

  const handleReactivate = () => {
    confirm({
      title: "Activate Branch?",
      icon: <PlayCircleOutlined className="text-green-500" />,
      content: "Are you sure you want to re-activate this branch?",
      okText: "Activate",
      okType: "primary",
      async onOk() {
        try {
          const id =
            branchId || branchData.key || branchData.id || branchData._id;
          await reactivateBranchApi(id);

          setBranchData({
            ...branchData,
            isActive: true,
          });

          message.success("Branch activated successfully");
        } catch (error) {
          message.error(error.message || "Failed to activate branch");
        }
      },
    });
  };

  const handleDeleteBranch = () => {
    confirm({
      title: "Delete this Branch?",
      icon: <ExclamationCircleOutlined />,
      content: `This will mark ${branchData.branchName} as Inactive.`,
      okType: "danger",
      okText: "Delete",
      async onOk() {
        try {
          const id =
            branchId || branchData.key || branchData.id || branchData._id;
          await deleteBranchApi(id);

          setBranchData({ ...branchData, isActive: false });
          message.success("Branch deleted/inactive successfully");
        } catch (error) {
          message.error(error.message || "Failed to delete branch");
        }
      },
    });
  };

  const handleUpdateSave = async (updatedValues) => {
    try {
      const id = branchId || branchData.key || branchData.id || branchData._id;
      await updateBranchApi(id, updatedValues);
      message.success("Branch updated successfully");
      setIsEditModalOpen(false);
      setBranchData({ ...branchData, ...updatedValues });
    } catch (error) {
      message.error(error.message || "Failed to update branch");
    }
  };

  const handleViewAgent = (record) => {
    navigate(`/dashboard/agents/${record.id}`, {
      state: { agentData: record, branchData, showAgents },
    });
  };

  return (
    <div className="animate-fade-in">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-500 hover:!text-[#13c2c2] hover:!border-[#13c2c2]"
      >
        Back to Branches
      </Button>

      <Card
        className="shadow-lg border-0 rounded-2xl overflow-hidden"
        style={{ borderTop: "4px solid #13c2c2" }}
        title={
          <div className="flex items-center gap-4 py-2">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl shadow-lg">
              <TeamOutlined className="text-2xl text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#10314a] m-0">
                  {branchData.branchName}
                </h2>
                <Tag
                  icon={
                    branchData.isActive ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                  color={branchData.isActive ? "success" : "error"}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {branchData.isActive ? "Active" : "Inactive"}
                </Tag>
              </div>
              <p className="text-sm text-gray-500 m-0 mt-1">
                Branch Details Overview
              </p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DetailItem label="Admin Name" value={branchData.adminName} />
          <DetailItem label="Admin Email" value={branchData.adminEmail} />
          <DetailItem label="City" value={branchData.city} />
          <DetailItem label="Credit Limit" value={branchData.creditTrial} />
          <DetailItem label="Phone" value={branchData.branchPhone} />
          <DetailItem label="Address" value={branchData.branchAddress} />
          <DetailItem
            label="Official Email"
            value={branchData.branchOfficialEmail}
          />
          <DetailItem
            label="Commission"
            value={
              branchData.commissionSlab ? `${branchData.commissionSlab}%` : "0%"
            }
          />
          <DetailItem
            label="Date of Opening"
            value={new Date(
              branchData.branchDateOfOpening,
            ).toLocaleDateString()}
          />
          <DetailItem
            label="Admin Contact No"
            value={branchData.adminContactNo}
          />
          <DetailItem label="Admin CNIC" value={branchData.adminCnic || "-"} />
        </div>

        <Divider className="my-6" />

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            size="large"
            icon={<TeamOutlined />}
            onClick={() => setShowAgents(!showAgents)}
            className="border-2 border-cyan-500 text-cyan-600 hover:!bg-cyan-50 hover:!text-cyan-700 hover:!border-cyan-600 font-semibold"
          >
            {showAgents ? "Hide Agents" : "View Agents"}
          </Button>

          {/* 🔴 IF INACTIVE → ONLY SHOW REACTIVATE */}
          {!branchData.isActive && (
            <Button
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleReactivate}
              className="border-green-500 text-green-500 hover:!bg-green-50 hover:!text-green-600 hover:!border-green-600 font-semibold"
            >
              Reactivate Branch
            </Button>
          )}

          {/* 🟢 IF ACTIVE → SHOW EDIT & DELETE */}
          {branchData.isActive && (
            <>
              <Button
                size="large"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:!from-cyan-600 hover:!to-teal-600 border-0 font-semibold shadow-md"
              >
                Edit Branch
              </Button>

              <Button
                size="large"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteBranch}
                className="border-2 border-red-400 hover:!border-red-600 hover:!bg-red-50 font-semibold"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Agent Table */}
      {showAgents && (
        <div className="mt-6" ref={agentsTableRef}>
          {loadingAgents ? (
            <Spin />
          ) : agents.length > 0 ? (
            <AgentTable
              data={agents}
              onView={handleViewAgent}
              isBranchView={true}
              minWidth={600}
            />
          ) : (
            <Empty description="No Agents Assigned to this Branch" />
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditBranchModal
          visible={isEditModalOpen}
          initialValues={branchData}
          onCancel={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateSave}
        />
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-base font-bold text-[#10314a] break-words">{value}</p>
  </div>
);

export default BranchDetails;
