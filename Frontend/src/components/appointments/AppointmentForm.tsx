// src/components/appointments/AppointmentForm.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createAppointment, updateAppointment } from '../../api/appointments';
import { getPatients } from '../../api/patients';
import { getDoctors } from '../../api/doctors';
import { Appointment, AppointmentCreate, Patient, Doctor } from '../../api/types';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import { Calendar, User, Stethoscope } from 'lucide-react';

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess?: () => void;
}

const schema = yup.object().shape({
  patientId: yup.number().required('Patient is required'),
  doctorId: yup.number().required('Doctor is required'),
  dateTime: yup.string().required('Date and time are required'),
  status: yup.string().oneOf(['Scheduled', 'Completed', 'Cancelled']).default('Scheduled'),
});

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AppointmentCreate & { status: "Scheduled" | "Completed" | "Cancelled" }>({
    resolver: yupResolver(schema),
    defaultValues: appointment
      ? {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          dateTime: formatDate(appointment.dateTime, "yyyy-MM-dd'T'HH:mm"),
          status: appointment.status as "Scheduled" | "Completed" | "Cancelled",
        }
      : { status: 'Scheduled' },
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, doctorData] = await Promise.all([getPatients(), getDoctors()]);
        setPatients(patientData);
        setDoctors(doctorData);
      } catch (error) {
        toast.error('Failed to load patients or doctors');
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: AppointmentCreate & { status: "Scheduled" | "Completed" | "Cancelled" }) => {
    setLoading(true);
    try {
      if (appointment) {
        await updateAppointment(appointment.id, data);
        toast.success('Appointment updated successfully');
      } else {
        await createAppointment(data);
        toast.success('Appointment created successfully');
      }
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <User className="h-4 w-4" /> Patient
          </span>
        </label>
        <select
          {...register('patientId')}
          className={`select select-bordered w-full ${errors.patientId ? 'select-error' : ''}`}
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.email})
            </option>
          ))}
        </select>
        {errors.patientId && <p className="text-error text-sm mt-1">{errors.patientId.message}</p>}
      </div>

      <div>
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Stethoscope className="h-4 w-4" /> Doctor
          </span>
        </label>
        <select
          {...register('doctorId')}
          className={`select select-bordered w-full ${errors.doctorId ? 'select-error' : ''}`}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} ({doctor.specialty})
            </option>
          ))}
        </select>
        {errors.doctorId && <p className="text-error text-sm mt-1">{errors.doctorId.message}</p>}
      </div>

      <div>
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Date & Time
          </span>
        </label>
        <input
          type="datetime-local"
          {...register('dateTime')}
          className={`input input-bordered w-full ${errors.dateTime ? 'input-error' : ''}`}
        />
        {errors.dateTime && <p className="text-error text-sm mt-1">{errors.dateTime.message}</p>}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Status</span>
        </label>
        <select
          {...register('status')}
          className={`select select-bordered w-full ${errors.status ? 'select-error' : ''}`}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {errors.status && <p className="text-error text-sm mt-1">{errors.status.message}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : appointment ? 'Update Appointment' : 'Create Appointment'}
        </Button>
        <Button type="button" className="btn-ghost" onClick={() => reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
};