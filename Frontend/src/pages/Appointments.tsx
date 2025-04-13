// src/pages/Appointments.tsx
import { useState } from 'react';
import AppointmentList from '../components/appointments/AppointmentList';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { CalendarPlus } from 'lucide-react';

export const Appointments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>
      <AppointmentList />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Appointment"
      >
        <AppointmentForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};