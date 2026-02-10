import api from "./axios"; // interceptor wala axios instance

// Create Branch with Admin (SUPER_ADMIN only)
export const createBranchWithAdminApi = async (data) => {
  try {
    const response = await api.post("/branch", data);
    return response.data;
  } catch (error) {
    
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create branch";
    throw new Error(message);
  }
};


export const getAllBranchesApi = async () => {
  try {
    const response = await api.get("/branch");
    return response.data; 
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch branches";

    throw new Error(message);
  }
};
export const getBranchByIdApi = async (branchId) => {
  try {
    const response = await api.get(`/branch/${branchId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch branch"
    );
  }
};


export const updateBranchApi = async (branchId, data) => {
  try {
    const response = await api.put(`/branch/${branchId}`, data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update branch";
    throw new Error(message);
  }
};

export const reactivateBranchApi = async (branchId) => {
  try {
    const response = await api.put(
      `/branch/branches/${branchId}/reactivate`,
      {} // body empty
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to reactivate branch";
    throw new Error(message);
  }
};

export const deleteBranchApi = async (branchId) => {
  try {
    const response = await api.delete(`/branch/${branchId}`);
    return response.data; // { success: true, message: "..." }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete branch";
    throw new Error(message);
  }
};

// GET FINANCIAL INFO FOR LOGGED-IN BRANCH
export const getMyBranchFinancialApi = async () => {
  try {
    const response = await api.get("/branch/my-financials");
    return response.data; // { success: true, data: {...} }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch branch financial info";
    throw new Error(message);
  }
};