import api from "./axios";

export const loginApi = async (payload) => {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    // ✅ clean error forward
    throw (
      error.response?.data || {
        message: "Server not responding",
      }
    );
  }
};

export const changePasswordApi = async (values) => {
  try {
    const response = await api.post("/auth/change-password", values);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Server not responding" };
  }
};
