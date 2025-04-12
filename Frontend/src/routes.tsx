import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';
import {Doctors} from './pages/Doctors';
import {DoctorDetail} from './pages/DoctorDetail';
import {Appointments} from './pages/Appointments';
import {AppointmentDetail} from './pages/AppointmentDetail';
import {MedicalHistory} from './pages/MedicalHistory';
import {NotFound} from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout children={undefined} />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<DoctorDetail />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/:id" element={<AppointmentDetail />} />
        <Route path="medical-history" element={<MedicalHistory />} />
        <Route path="medical-history/:patientId" element={<MedicalHistory />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;