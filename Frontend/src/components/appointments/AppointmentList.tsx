import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments } from '../../api/appointments';
import { Appointment } from '../../api/types';
import Loading from '../common/Loading';
import { formatDateTime } from '../../utils/dateUtils';
import { getStatusBadgeClass } from '../../utils/formatters';
import { Search, Plus, Calendar } from 'lucide-react';
import Button from '../common/Button';

interface AppointmentListProps {
  patientId?: number;
  doctorId?: number;
  onAddNew?: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  patientId, 
  doctorId, 
  onAddNew 
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (patientId) params.patient_id = patientId;
        if (doctorId) params.doctor_id = doctorId;
        if (dateFilter) params.date = dateFilter;
        
        const data = await getAppointments(params);
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch appointments. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId, doctorId, dateFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = appointment.patient?.name.toLowerCase() || '';
    const doctorName = appointment.doctor?.name.toLowerCase() || '';
    const status = appointment.status.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      patientName.includes(searchLower) ||
      doctorName.includes(searchLower) ||
      status.includes(searchLower)
    );
  });

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/appointments/${appointmentId}`);
  };

  if (loading) return <Loading message="Loading appointments..." />;

  if (error) {
    return (
      <div className="alert alert-error">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-4">
        <div className="flex flex-col sm:flex-row w-full gap-3">
          <div className="form-control flex-1">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search appointments..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn btn-square">
                <Search size={20} />
              </button>
            </div>
          </div>
          
          <div className="form-control">
            <div className="input-group">
              <input
                type="date"
                className="input input-bordered"
                value={dateFilter}
                onChange={handleDateFilterChange}
              />
              <button className="btn btn-square">
                <Calendar size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {onAddNew && (
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={onAddNew}
            className="w-full sm:w-auto"
          >
            New Appointment
          </Button>
        )}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover cursor-pointer">
                  <td>{appointment.id}</td>
                  <td>{appointment.patient?.name || `Patient #${appointment.patientId}`}</td>
                  <td>{appointment.doctor?.name || `Doctor #${appointment.doctorId}`}</td>
                  <td>{formatDateTime(appointment.dateTime)}</td>
                  <td>
                    <span className={getStatusBadgeClass(appointment.status)}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleAppointmentClick(appointment.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;