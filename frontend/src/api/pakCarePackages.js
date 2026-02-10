import api from "./axios";
export const createPakCarePackageApi = async (payload) => {
  try {
    const response = await api.post("/pakcare", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Server not responding" };
  }
};



export const getAllPakCarePackages = async () => {
  try {
    const response = await api.get("/pakcare");
    // backend returns array
    return response.data; 
  } catch (error) {
    console.error("Error fetching domestic packages:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch domestic packages");
  }
};

// --- UPDATE a PakCare package by ID ---
export const updatePakCarePackage = async (id, data) => {
  try {
    const res = await api.put(`/pakcare/${id}`, data); // centralized api for PUT
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update PakCare package" };
  }
};

// --- DELETE a PakCare package by ID ---
export const deletePakCarePackage = async (id) => {
  try {
    const res = await api.delete(`/pakcare/${id}`); // centralized api for DELETE
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete PakCare package" };
  }
};