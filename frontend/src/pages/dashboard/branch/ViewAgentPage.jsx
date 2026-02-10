import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AgentDetails from "../../../components/dashboard/agent/AgentDetails";
import { Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getAgentByIdApi } from "../../../api/agent";

const ViewAgentPage = () => {
  const { agentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [agentData, setAgentData] = useState(location.state?.agentData || null);
  const [loading, setLoading] = useState(false);
  const branchData = location.state?.branchData;

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!agentId) return;

      try {
        setLoading(true);
        const fetchedAgent = await getAgentByIdApi(agentId);
        setAgentData(fetchedAgent);
      } catch (error) {
        console.error("Error fetching agent:", error);
        message.error(error.message || "Failed to load agent details");
        if (!location.state?.agentData) {
          setAgentData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [agentId]);

  const handleBack = () => {
    if (branchData) {
      navigate(`/dashboard/branch-details/${branchData.key}`, {
        state: { branchData, showAgents: true },
      });
    } else {
      navigate(-1);
    }
  };

  if (loading && !agentData) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">Loading agent details...</p>
      </div>
    );
  }

  if (!agentData && !loading) {
    return (
      <div className="p-6 text-red-500 text-center">
        Error: Agent not found (Agent ID: {agentId})
      </div>
    );
  }

  return (
    <div className="p-6">
      <Spin spinning={loading}>
        <AgentDetails agentData={agentData} branchId={branchData?.key} />
      </Spin>
    </div>
  );
};

export default ViewAgentPage;
