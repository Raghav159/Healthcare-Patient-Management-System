// src/pages/PatientDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, deletePatient } from '../api/patients';
import { Patient } from '../api/types';
import PatientForm from '../components/patients/PatientForm';
import { MedicalHistoryList } from '../components/medicalHistory/MedicalHistoryList';
import { MedicalHistoryForm } from '../components/medicalHistory/MedicalHistoryForm';
import AppointmentList from '../components/appointments/AppointmentList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Calendar, Trash2, FilePlus } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getPatientById(Number(id));
        setPatient(data);
      } catch (error) {
        toast.error('Failed to load patient');
        navigate('/patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(Number(id));
        toast.success('Patient deleted successfully');
        navigate('/patients');
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  if (loading) return <Loading />;
  if (!patient) return <div className="text-center text-gray-500">Patient not found.</div>;

  return (
    <div className="space-y-4">
      <Card>
        <div className="card-body">
          {editMode ? (
            <>
              <h2 className="card-title">Edit Patient</h2>
              <PatientForm
                patient={patient}
                onSuccess={() => {
                  setEditMode(false);
                  navigate(0); // Refresh page
                }}
                onSubmit={async (values) => {
                  try {
                    const response = await fetch(`/api/patients/${patient.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(values)
                    });
                    return response.json();
                  } catch (error) {
                    console.error('Failed to update patient:', error);
                    throw error;
                  }
                }}
              />
              <Button className="btn-ghost mt-4" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <h2 className="card-title flex items-center gap-2">
                <User className="h-5 w-5" />
                {patient.name}
              </h2>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email: {patient.email}
              </p>
              {patient.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone: {patient.phone}
                </p>
              )}
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                DOB: {formatDate(patient.dob, 'PP')}
              </p>
              <div className="card-actions justify-end gap-2">
                <Button className="btn-primary" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
                <Button className="btn-error" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <Card>
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Medical History</h2>
            <Button
              className="btn-primary"
              onClick={() => setIsMedicalHistoryModalOpen(true)}
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>
          <MedicalHistoryList patientId={patient.id} />
        </div>
      </Card>

      <Card>
        <div className="card-body">
          <h2 className="card-title">Appointments</h2>
          <AppointmentList />
        </div>
      </Card>

      <Modal
        isOpen={isMedicalHistoryModalOpen}
        onClose={() => setIsMedicalHistoryModalOpen(false)}
        title="Add Medical History"
      >
        <MedicalHistoryForm
          patientId={patient.id}
          onSuccess={() => setIsMedicalHistoryModalOpen(false)}
        />
      </Modal>
    </div>
  );
};