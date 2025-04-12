import axios from 'axios';
import { Doctor, DoctorCreate, DoctorUpdate } from './types';

const API_BASE_URL = 'http://localhost:8000';

// Get all doctors with optional specialty filter
export const getDoctors = async (params?: {
  specialty?: string;
  skip?: number;
  limit?: number;
}): Promise<Doctor[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctors`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Get a single doctor by ID
export const getDoctorById = async (id: number): Promise<Doctor> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor ${id}:`, error);
    throw error;
  }
};

// Create a new doctor
export const createDoctor = async (doctor: DoctorCreate): Promise<Doctor> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/doctors/`, doctor);
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

// Update an existing doctor
export const updateDoctor = async (id: number, doctor: DoctorUpdate): Promise<Doctor> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/doctors/${id}`, doctor);
    return response.data;
  } catch (error) {
    console.error(`Error updating doctor ${id}:`, error);
    throw error;
  }
};

// Delete a doctor
export const deleteDoctor = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/doctors/${id}`);
  } catch (error) {
    console.error(`Error deleting doctor ${id}:`, error);
    throw error;
  }
};