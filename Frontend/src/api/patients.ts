import axios from 'axios';
import { Patient, PatientCreate, PatientUpdate } from './types';

const API_BASE_URL = 'http://localhost:8000';

// Get all patients with optional filters
export const getPatients = async (params?: {
  name?: string;
  email?: string;
  skip?: number;
  limit?: number;
}): Promise<Patient[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patients`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Get a single patient by ID
export const getPatientById = async (id: number): Promise<Patient> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
};

// Create a new patient
export const createPatient = async (patient: PatientCreate): Promise<Patient> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/patients/`, patient);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Update an existing patient
export const updatePatient = async (id: number, patient: PatientUpdate): Promise<Patient> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/patients/${id}`, patient);
    return response.data;
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error);
    throw error;
  }
};

// Delete a patient
export const deletePatient = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/patients/${id}`);
  } catch (error) {
    console.error(`Error deleting patient ${id}:`, error);
    throw error;
  }
};