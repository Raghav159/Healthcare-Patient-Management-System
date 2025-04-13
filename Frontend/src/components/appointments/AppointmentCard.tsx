// src/components/appointments/AppointmentCard.tsx
import { Appointment } from '../../api/types';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';
import { Calendar, User, Stethoscope, Clock } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="card-body">
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
        <div className="card-actions justify-end">
          <Link to={`/appointments/${appointment.id}`}>
            <Button className="btn-primary btn-sm">View Details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};