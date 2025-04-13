// src/pages/AppointmentDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentById, deleteAppointment } from '../api/appointments';
import { Appointment } from '../api/types';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { Calendar, User, Stethoscope, Clock, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getAppointmentById(Number(id));
        setAppointment(data);
      } catch (error) {
        toast.error('Failed to load appointment');
        navigate('/appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(Number(id));
        toast.success('Appointment deleted successfully');
        navigate('/appointments');
      } catch (error) {
        toast.error('Failed to delete appointment');
      }
    }
  };

  if (loading) return <Loading />;
  if (!appointment) return <div className="text-center text-gray-500">Appointment not found.</div>;

  return (
    <div className="space-y-4">
      <Card>
        <div className="card-body">
          {editMode ? (
            <>
              <h2 className="card-title">Edit Appointment</h2>
              <AppointmentForm
                appointment={appointment}
                onSuccess={() => {
                  setEditMode(false);
                  navigate(0); // Refresh page
                }}
              />
              <Button className="btn-ghost mt-4" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <h2 className="card-title flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment #{appointment.id}
              </h2>
              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient: {appointment.patient?.name || 'Unknown'}
              </p>
              <p className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctor: {appointment.doctor?.name || 'Unknown'} ({appointment.doctor?.specialty})
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Date: {formatDate(appointment.dateTime, 'PPp')}
              </p>
              <p>
                Status: <span className={`badge badge-${appointment.status === 'Scheduled' ? 'primary' : appointment.status === 'Completed' ? 'success' : 'error'}`}>{appointment.status}</span>
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
    </div>
  );
};