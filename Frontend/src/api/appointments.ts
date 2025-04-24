import axios from "./axios";

const API_URL = "http://localhost:8000/appointments";

export const getAppointments = () => axios.get(API_URL);

export const createAppointment = (data: any) => axios.post(API_URL, data);
