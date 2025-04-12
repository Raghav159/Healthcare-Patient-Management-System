// src/pages/Doctors.tsx
import { useState } from 'react';
import DoctorList from '../components/doctors/DoctorList';
import DoctorForm from '../components/doctors/DoctorForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { UserPlus } from 'lucide-react';

export const Doctors: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>
      <DoctorList />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Doctor"
      >
        <DoctorForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};