import api from "./axios";

// ---------------- CREATE ----------------
export const createStudentPackage = async (payload) => {
  try {
    const response = await api.post("/student-packages", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Server not responding" };
  }
};

// ---------------- GET ALL ----------------
export const getAllStudentPackages = async () => {
  try {
    const response = await api.get("/student-packages");
    return response.data; // { packages }
  } catch (error) {
    console.error("Error fetching student packages:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch student packages"
    );
  }
};

// ---------------- UPDATE ----------------
export const updateStudentPackage = async (id, data) => {
  try {
    const res = await api.put(`/student-packages/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to update student package",
    };
  }
};

// ---------------- DELETE ----------------
export const deleteStudentPackage = async (id) => {
  try {
    const res = await api.delete(`/student-packages/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Failed to delete student package",
    };
  }
};
