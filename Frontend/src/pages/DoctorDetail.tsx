// src/pages/DoctorDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, deleteDoctor } from '../api/doctors';
import { Doctor } from '../api/types';
import DoctorForm from '../components/doctors/DoctorForm';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { Stethoscope, User, Trash2 } from 'lucide-react';

export const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getDoctorById(Number(id));
        setDoctor(data);
      } catch (error) {
        toast.error('Failed to load doctor');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(Number(id));
        toast.success('Doctor deleted successfully');
        navigate('/doctors');
      } catch (error) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  if (loading) return <Loading />;
  if (!doctor) return <div className="text-center text-gray-500">Doctor not found.</div>;

  return (
    <div className="space-y-4">
      <Card>
        <div className="card-body">
          {editMode ? (
            <>
              <h2 className="card-title">Edit Doctor</h2>
              <DoctorForm
                              doctor={doctor}
                              onSuccess={() => {
                                  setEditMode(false);
                                  navigate(0); // Refresh page
                              } } onCancel={function (): void {
                                  throw new Error('Function not implemented.');
                              } }              />
              <Button className="btn-ghost mt-4" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <h2 className="card-title flex items-center gap-2">
                <User className="h-5 w-5" />
                {doctor.name}
              </h2>
              <p className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Specialty: {doctor.specialty}
              </p>
              {doctor.appointments && (
                <p>Appointments: {doctor.appointments.length}</p>
              )}
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
    </div>
  );
};