import axios from 'axios';
import { Appointment, AppointmentCreate, AppointmentUpdate } from './types';

const API_BASE_URL = 'http://localhost:8000';

// Get all appointments with optional filters
export const getAppointments = async (params?: {
  patient_id?: number;
  doctor_id?: number;
  date?: string;
  skip?: number;
  limit?: number;
}): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (id: number): Promise<Appointment> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment ${id}:`, error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointment: AppointmentCreate): Promise<Appointment> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/appointments/`, appointment);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Update an existing appointment
export const updateAppointment = async (id: number, appointment: AppointmentUpdate): Promise<Appointment> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/appointments/${id}`, appointment);
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error);
    throw error;
  }
};

// Delete/cancel an appointment
export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/appointments/${id}`);
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error);
    throw error;
  }
};