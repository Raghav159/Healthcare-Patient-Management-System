// src/components/patients/PatientCard.tsx
import { Patient } from '../../api/types';
import Card from '../common/Card';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="card-body">
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
        <div className="card-actions justify-end">
          <Link to={`/patients/${patient.id}`}>
            <Button className="btn-primary btn-sm">View Details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};