import axiosInstance
  from "./axiosInstance";

const BASE_URL =
  "/api/doctors";

export const getDoctors =
  () => {

    return axiosInstance.get(
      BASE_URL
    );
};

export const addDoctor =
  (doctor) => {

    return axiosInstance.post(

      BASE_URL,

      doctor
    );
};

export const updateDoctor =
  (id, doctor) => {

    return axiosInstance.put(

      `${BASE_URL}/${id}`,

      doctor
    );
};

export const deleteDoctor =
  (id) => {

    return axiosInstance.delete(

      `${BASE_URL}/${id}`
    );
};