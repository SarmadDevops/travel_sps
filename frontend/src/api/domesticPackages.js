import api from "./axios";

export const createDomesticPackageApi = async (payload) => {
  try {
    const response = await api.post("domestic-packages", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Server not responding",
      }
    );
  }
};


export const getAllDomesticPackages = async () => {
  try {
    const response = await api.get("/domestic-packages");
    return response.data; // []
  } catch (error) {
    console.error("Error fetching domestic packages:", error);

    // backend error
    if (error.response && error.response.data) throw error.response.data;

    // network / unknown
    throw { message: "Something went wrong while fetching domestic packages" };
  }
};

// Update a domestic package by ID
export const updateDomesticPackage = async (id, data) => {
  try {
    const res = await api.put(`/domestic-packages/${id}`, data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update domestic package");
  }
};

// You can add delete here as well if needed
export const deleteDomesticPackage = async (id) => {
  try {
    const res = await api.delete(`/domestic-packages/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete domestic package");
  }
};
