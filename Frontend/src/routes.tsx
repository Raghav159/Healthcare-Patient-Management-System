import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';
import { Doctors } from './pages/Doctors';
import { DoctorDetail } from './pages/DoctorDetail';
import { Appointments } from './pages/Appointments';
import { AppointmentDetail } from './pages/AppointmentDetail';
import { MedicalHistoryPage } from './pages/MedicalHistory';
import { NotFound } from './pages/NotFound';
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
        <Route path="medical-history" element={<MedicalHistoryPage />} />
        <Route path="medical-history/:patientId" element={<MedicalHistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

// // src/routes.tsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import Dashboard from '@/pages/Dashboard';
// import Patients from '@/pages/Patients';
// import {PatientDetail} from '@/pages/PatientDetail';
// import {Doctors} from '@/pages/Doctors';
// import {DoctorDetail} from '@/pages/DoctorDetail';
// import {Appointments} from '@/pages/Appointments';
// import {AppointmentDetail} from '@/pages/AppointmentDetail';
// import {MedicalHistoryPage} from '@/pages/MedicalHistory';
// import {NotFound} from '@/pages/NotFound';

// const AppRoutes: React.FC = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/patients"
//         element={isAuthenticated ? <Patients /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/patients/:id"
//         element={isAuthenticated ? <PatientDetail /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/doctors"
//         element={isAuthenticated ? <Doctors /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/doctors/:id"
//         element={isAuthenticated ? <DoctorDetail /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/appointments"
//         element={isAuthenticated ? <Appointments /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/appointments/:id"
//         element={isAuthenticated ? <AppointmentDetail /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/medical-histories"
//         element={isAuthenticated ? <MedicalHistoryPage /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/medical-histories/:patientId"
//         element={isAuthenticated ? <MedicalHistoryPage /> : <Navigate to="/login" />}
//       />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AppRoutes;