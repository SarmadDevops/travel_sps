import api from "./axios"; // import the axios instance

// CREATE AGENT
export const createAgentApi = async (agentData) => {
  try {
    const response = await api.post("/agents", agentData);
    return response.data;
  } catch (error) {
    //  send backend message directly
    throw error.response?.data?.message || "Failed to create agent";
  }
};



// Fetch all agents
export const getAllAgents = async () => {
  try {
    const response = await api.get("/agents"); 
    return response.data.agents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error; // propagate the error
  }
};

// Fetch all agents by branchId
export const getAllAgentsByBranchId = async (branchId) => {
  try {
    const response = await api.get(`/agents/branch/${branchId}`);
    return response.data.agents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error; // propagate the error
  }
};

export const getAgentByIdApi = async (agentId) => {
  try {
    const response = await api.get(`/agents/${agentId}`);
    return response.data.agent;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to load agent profile"
    );
  }
};
// Update agent
export const updateAgentApi = async (id, payload) => {
  try {
    const res = await api.put(`/agents/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw error;
  }
};

export const reactivateAgentApi = async (agentId) => {
  try {
    const response = await api.put(`/agents/${agentId}/reactivate`, {});
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to reactivate agent";
    throw new Error(message);
  }
};
// Delete agent
export const deleteAgentApi = async (id) => {
  try {
    const res = await api.delete(`/agents/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw error;
  }
};
