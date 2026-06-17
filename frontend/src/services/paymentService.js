import axiosInstance from "./axiosInstance";

export const getPayments = () =>
  axiosInstance.get("/api/payments");

export const createOrder = (billId) =>
  axiosInstance.post(
    `/api/payments/create-order/${billId}`
  );

  export const createAppointmentOrder = () =>
  axiosInstance.post(
    "/api/payments/appointment-order"
  );

export const verifyPayment = (data) =>
  axiosInstance.post(
    "/api/payments/verify",
    data
  );

  export const resendInvoice = (billId) =>
  axiosInstance.post(`/api/bills/${billId}/email`);