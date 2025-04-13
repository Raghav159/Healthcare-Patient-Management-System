import React from 'react';
import { Doctor } from '../../api/types';
import Card from '../common/Card';
import { User } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: (doctorId: number) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(doctor.id);
    }
  };

  return (
    <Card className={`h-full ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}>
      <div className="flex items-start" onClick={handleClick}>
        <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-primary bg-opacity-10">
          <User className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral">{doctor.name}</h3>
          <p className="text-gray-600">Specialty: {doctor.specialty}</p>
          
          {doctor.appointments && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {doctor.appointments.length} appointment(s)
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DoctorCard;