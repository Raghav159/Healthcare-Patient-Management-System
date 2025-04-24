import axios from "./axios";

export const getDoctors = async () => {
  const response = await axios.get("/doctors");
  return response.data;
};
