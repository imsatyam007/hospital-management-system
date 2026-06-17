import axiosInstance
  from "./axiosInstance";

const BASE_URL =
  "/api/patients";

export const getPatients =
  () => {

    return axiosInstance.get(
      BASE_URL
    );
};

export const addPatient =
  (patient) => {

    return axiosInstance.post(

      BASE_URL,

      patient
    );
};

export const updatePatient =
  (id, patient) => {

    return axiosInstance.put(

      `${BASE_URL}/${id}`,

      patient
    );
};

export const deletePatient =
  (id) => {

    return axiosInstance.delete(

      `${BASE_URL}/${id}`
    );
};