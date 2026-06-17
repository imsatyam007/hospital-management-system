import axiosInstance
  from "./axiosInstance";

const BASE_URL =
  "/api/appointments";

export const getAppointments =
  () => {

    return axiosInstance.get(
      BASE_URL
    );
};

export const addAppointment =
  (appointment) => {

    return axiosInstance.post(

      BASE_URL,

      appointment
    );
};

export const deleteAppointment =
  (id) => {

    return axiosInstance.delete(

      `${BASE_URL}/${id}`
    );
};