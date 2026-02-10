import api from "./axios";

export const createWorldWidePackageApi = async (payload) => {
  try {
    const response = await api.post("/world-wide-packages", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Server not responding",
      }
    );
  }
};



export const getAllWorldWidePackages = async () => {
  try {
    const response = await api.get("/world-wide-packages");
    return response.data.packages; 
  } catch (error) {
    console.error("Error fetching World Wide Packages:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch World Wide Packages");
  }
};

// --- UPDATE a World Wide package by ID ---
export const updateWorldWidePackage = async (id, data) => {
  try {
    const res = await api.put(`/world-wide-packages/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update World Wide package" };
  }
};

// --- DELETE a World Wide package by ID ---
export const deleteWorldWidePackage = async (id) => {
  try {
    const res = await api.delete(`/world-wide-packages/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete World Wide package" };
  }
};