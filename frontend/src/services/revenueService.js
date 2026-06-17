import axiosInstance from "./axiosInstance";

export const getRevenue = () =>
  axiosInstance.get("/api/revenue");

export const getRevenueTrend = () =>
  axiosInstance.get("/api/revenue/trend");

export const getRevenueByDoctor = () =>
  axiosInstance.get(
    "/api/revenue/doctor"
  );

  export const getMonthlyRevenue = () =>
  axiosInstance.get(
    "/api/revenue/monthly"
  );