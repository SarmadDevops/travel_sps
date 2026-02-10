import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import AgentProfileHeader from "../../../components/dashboard/agent/AgentProfileHeader";
import AgentProfileDetails from "../../../components/dashboard/agent/AgentProfileDetails";
import { getAgentByIdApi } from "../../../api/agent";

const AgentProfile = () => {
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);

      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const agentId = user?.agentId;

        if (!agentId) throw new Error("Agent ID not found for this user");

        const agent = await getAgentByIdApi(agentId);
        const mappedData = {
          agentName: agent.agentName,
          agentCode: agent.agentCode,
          agentEmail: agent.email,
          mobileNo: agent.mobileNo,
          agentCnic: agent.agentCnic,
          city: agent.city,
          agentAddress: agent.address,
          dateOfEstablishment: agent.dateOfEstablishment,
          dateOfOpening: agent.dateOfOpening,

          adminName: agent.User?.name || "—",
          adminEmail: agent.User?.email || "—",
          adminContactNo: agent.User?.contactNo || "—",
        };

        setAgentData(mappedData);
      } catch (error) {
        message.error(error.message || "Failed to load agent profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AgentProfileHeader agentData={agentData} />
      <AgentProfileDetails agentData={agentData} />
    </div>
  );
};

export default AgentProfile;
