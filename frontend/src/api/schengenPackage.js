import api from "./axios";

export const createSchengenPackageApi = async (payload) => {
  try {
    const response = await api.post("/schengen", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Server not responding",
      }
    );
  }
};



export const getAllSchengenPackages = async () => {
  try {
    const response = await api.get("/schengen");
    return response.data; 
  } catch (error) {
    console.error("Error fetching Schengen packages:", error);

    
    if (error.response && error.response.data) {
      throw error.response.data;
    }

    // network / unknown error
    throw { message: "Something went wrong while fetching packages" };
  }
};

// --- UPDATE a Schengen package by ID ---
export const updateSchengenPackage = async (id, data) => {
  try {
    const res = await api.put(`/schengen/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update Schengen package" };
  }
};

// --- DELETE a Schengen package by ID ---
export const deleteSchengenPackage = async (id) => {
  try {
    const res = await api.delete(`/schengen/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete Schengen package" };
  }
};