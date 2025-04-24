import axios from "./axios";

export const getMedicalHistories = () => axios.get("/api/medical-histories");

export const createMedicalHistory = (data: any) =>
  axios.post("/api/medical-histories", data);
