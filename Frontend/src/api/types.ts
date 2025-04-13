// Base model interfaces for database entities
export interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    dob: string;
    medicalHistory?: MedicalHistory[];
    appointments?: Appointment[];
  }
  
  export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    appointments?: Appointment[];
  }
  
  export interface Appointment {
    id: number;
    patientId: number;
    patient?: Patient;
    doctorId: number;
    doctor?: Doctor;
    dateTime: string;
    status: string;
  }
  
  export interface MedicalHistory {
    id: number;
    patientId: number;
    patient?: Patient;
    diagnosis: string;
    treatment: string | null;
    date: string;
  }
  
  export interface User {
    id: number;
    email: string;
    password?: string;
    role: string;
    createdAt: string;
  }
  
  // Create/Update DTO interfaces for API requests
  export interface PatientCreate {
    name: string;
    email: string;
    phone: string | null;
    dob: string;
  }
  
  export interface PatientUpdate {
    name?: string;
    phone?: string;
    dob?: string;
  }
  
  export interface DoctorCreate {
    name: string;
    specialty: string;
  }
  
  export interface DoctorUpdate {
    name?: string;
    specialty?: string;
  }
  
  export interface AppointmentCreate {
    patientId: number;
    doctorId: number;
    dateTime: string;
    status?: string;
  }
  
  export interface AppointmentUpdate {
    dateTime?: string;
    status?: string;
  }
  
  export interface MedicalHistoryCreate {
    patientId: number;
    diagnosis: string;
    treatment?: string;
    date: string;
  }
  
  export interface MedicalHistoryUpdate {
    diagnosis?: string;
    treatment?: string;
    date?: string;
  }
  
  // Response interfaces for API responses
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: string;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }
  
  // Error interfaces
  export interface ApiError {
    message: string;
    code?: string;
    details?: any;
  }