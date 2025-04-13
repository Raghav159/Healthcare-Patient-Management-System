import axios from 'axios';
import { MedicalHistory, MedicalHistoryCreate, MedicalHistoryUpdate } from './types';

const API_BASE_URL = 'http://localhost:8000';

// Get all medical history entries for a specific patient
export const getPatientMedicalHistory = async (
  patientId: number,
  params?: {
    skip?: number;
    limit?: number;
  }
): Promise<MedicalHistory[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medical-histories/patient/${patientId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching medical history for patient ${patientId}:`, error);
    throw error;
  }
};

// Get a single medical history entry by ID
export const getMedicalHistoryById = async (id: number): Promise<MedicalHistory> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medical-histories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medical history ${id}:`, error);
    throw error;
  }
};

// Create a new medical history entry
export const createMedicalHistory = async (medicalHistory: MedicalHistoryCreate): Promise<MedicalHistory> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/medical-histories/`, medicalHistory);
    return response.data;
  } catch (error) {
    console.error('Error creating medical history entry:', error);
    throw error;
  }
};

// Update an existing medical history entry
export const updateMedicalHistory = async (
  id: number,
  medicalHistory: MedicalHistoryUpdate
): Promise<MedicalHistory> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/medical-histories/${id}`, medicalHistory);
    return response.data;
  } catch (error) {
    console.error(`Error updating medical history ${id}:`, error);
    throw error;
  }
};

// Delete a medical history entry
export const deleteMedicalHistory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/medical-histories/${id}`);
  } catch (error) {
    console.error(`Error deleting medical history ${id}:`, error);
    throw error;
  }
};