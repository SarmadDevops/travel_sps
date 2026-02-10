import api from "./axios"; //  common axios instance


// CREATE POLICY (ADMIN)

export const createPolicyApi = async (policyData) => {
  try {
    const response = await api.post("/under-writing", policyData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create policy"
    );
  }
};


// GET BRANCH POLICIES (ADMIN)

export const getBranchPoliciesApi = async () => {
  try {
    const response = await api.get("/under-writing/branch");
    return response.data.policies;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch branch policies"
    );
  }
};
// get monthly business statistics for dashboard for admin
export const getMonthlyBusinessApi = async () => {
  try {
    const response = await api.get(
      "/under-writing/dashboard/monthly-business"
    );
    return response.data.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch monthly business"
    );
  }
};

export const getAllMonthlyBusinessApi = async () => {
  try {
    const response = await api.get(
      "/under-writing/dashboard/monthly-business/all"
    );
    return response.data.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch all monthly business"
    );
  }
};

export const getAgentMonthlyBusinessApi = async () => {
  try {
    const response = await api.get(
      "/under-writing/agent/dashboard/monthly-business"
    );
    return response.data.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch agent monthly business"
    );
  }
};


// GET ALL POLICIES (SUPER ADMIN)

export const getAllPoliciesApi = async () => {
  try {
    const response = await api.get("/under-writing");
    return response.data.policies;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch policies"
    );
  }
};


// GET POLICIES BY AGENT

export const getPoliciesByAgentApi = async (agentId) => {
  try {
    const response = await api.get(`/under-writing/agent/${agentId}`);
    return response.data.policies;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch agent policies"
    );
  }
};


// SUPER ADMIN → GET ALL UNPAID POLICIES
export const getAllUnpaidPoliciesApi = async () => {
  try {
    const response = await api.get("/under-writing/unpaid");
    return response.data.policies;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch unpaid policies"
    );
  }
};


// ADMIN → GET BRANCH UNPAID POLICIES
export const getBranchUnpaidPoliciesApi = async () => {
  try {
    const response = await api.get("/under-writing/branch/unpaid");
    return response.data.policies;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch branch unpaid policies"
    );
  }
};

export const getMyPoliciesApi = async () => {
  try {
    const response = await api.get("/under-writing/my-policies");
    return response.data.policies;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch policies"
    );
  }
};

export const getBranchPolicyAnalyticsApi = async () => {
  try {
    const response = await api.get("/under-writing/branch/analytics");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch branch analytics"
    );
  }
};



//  Get All Policies Analytics
export const getAllPoliciesAnalyticsApi = async () => {
  try {
    const response = await api.get("/under-writing/all/analytics");
    return response.data; // { totalPolicies, paidPolicies, unpaidPolicies, ... }
  } catch (error) {
    console.error("getAllPoliciesAnalyticsApi ERROR 👉", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch all policies analytics"
    );
  }
};


//  Get Agent Policies Analytics
export const getAgentPolicyAnalyticsApi = async () => {
  try {
    const response = await api.get("/under-writing/my-policies/analytics");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch agent analytics"
    );
  }
};


export const searchPolicyByPassportAndPolicyNumber = async ({
  passportNo,
  policyNumber,
}) => {
  const response = await api.get("/under-writing/policy/search",
    {
      params: {
        passportNo,
        policyNumber,
      },
    }
  );

  return response.data;
};


export const updatePolicyStatusAndPaymentApi = async (policyId, payload) => {
  try {
    const response = await api.put(
      `/under-writing/${policyId}/status`,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update policy status and payment"
    );
  }
};
export const updatePolicyApi = async (policyId, payload) => {
  try {
    const response = await api.put(
      `/under-writing/${policyId}`,
      payload
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update policy"
    );
  }
};

// UPDATE POLICY STATUS (POSTED / UNPOSTED )
export const updatePolicyStatusApi = async (policyId, payload) => {
  try {
    const response = await api.put(
      `/under-writing/${policyId}/status`,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update policy status"
    );
  }
};

export const getPolicyByIdApi = async (policyId) => {
  try {
    const response = await api.get(
      `/under-writing/${policyId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch policy"
    );
  }
};


// // MARK POLICY AS PAID (SUPER ADMIN)
// export const markPolicyPaidApi = async (policyId) => {
//   try {
//     const response = await api.put(
//       `/under-writing/${policyId}/pay`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message || "Failed to mark policy as paid"
//     );
//   }
// };
