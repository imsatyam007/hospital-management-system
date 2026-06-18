import axios from "axios";

const API_URL =
  "https://hospital-management-system-y2sv.onrender.com/api/auth";

export const login = async (username, password) => {

  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });

  console.log("Login response:", response.data);

  localStorage.setItem("token", response.data.token);

  // ✅ Strip "ROLE_" prefix before saving
  // "ROLE_ADMIN" → "ADMIN" so isAdmin() works correctly
  const role = response.data.role?.replace("ROLE_", "") || "ADMIN";
  localStorage.setItem("role", role);

  // ✅ Save username for sidebar display
  localStorage.setItem("username", response.data.username || username);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");       // ✅ also clear role on logout
  localStorage.removeItem("username");   // ✅ also clear username on logout
};

export const getToken = () => {
  return localStorage.getItem("token");
};
