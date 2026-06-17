import axiosInstance from "./axiosInstance";

export const getDashboardStats = async () => {
  return await axiosInstance.get("/api/dashboard/stats");
};

export const getMonthlyPatients = async () => {
  return await axiosInstance.get("/api/dashboard/monthly-patients");
};

export const getMonthlyAppointments = async () => {
  return await axiosInstance.get("/api/dashboard/monthly-appointments");
};