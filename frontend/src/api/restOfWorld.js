import api from "./axios";
export const createRestOfWorldPackageApi = async (payload) => {
  try {
    const response = await api.post("/rest-of-world-packages", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Server not responding",
      }
    );
  }
};



export const getAllRestOfWorldPackages = async () => {
  try {
    const response = await api.get("/rest-of-world-packages");
    return response.data.packages;
  } catch (error) {
    console.error("Error fetching Rest of World Packages:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch Rest of World Packages");
  }
};



// --- UPDATE a Rest of World package by ID ---
export const updateRestOfWorldPackage = async (id, data) => {
  try {
    const res = await api.put(`/rest-of-world-packages/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update package" };
  }
};

// --- DELETE a Rest of World package by ID ---
export const deleteRestOfWorldPackage = async (id) => {
  try {
    const res = await api.delete(`/rest-of-world-packages/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete package" };
  }
};