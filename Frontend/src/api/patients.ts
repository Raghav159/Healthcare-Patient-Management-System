import axios from "./axios";

export const getPatients = async () => {
  const response = await axios.get("/patients");
  return response.data;
};
