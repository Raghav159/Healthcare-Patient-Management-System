import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../api/appointments';
import { getPatients } from '../api/patients';
import { getDoctors } from '../api/doctors';
import { Appointment, Patient, Doctor } from '../api/types';
import { formatDateTime } from '../utils/dateUtils';
import { 
  Users, UserRound, Calendar, Clock, ActivitySquare, 
  CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [doctorCount, setDoctorCount] = useState<number>(0);
  const [appointmentStats, setAppointmentStats] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch today's appointments
        const appointments = await getAppointments({ date: today });
        setTodayAppointments(appointments);
        
        // Count appointment statuses
        const stats = appointments.reduce((acc, curr) => {
          acc.total++;
          if (curr.status.toLowerCase() === 'completed') acc.completed++;
          else if (curr.status.toLowerCase() === 'cancelled') acc.cancelled++;
          else if (curr.status.toLowerCase() === 'scheduled') acc.scheduled++;
          return acc;
        }, { scheduled: 0, completed: 0, cancelled: 0, total: 0 });
        
        // Fetch patient count (limit 1 just to get count)
        const patients = await getPatients({ limit: 100 });
        setPatientCount(patients.length);
        
        // Fetch doctor count
        const doctors = await getDoctors({ limit: 100 });
        setDoctorCount(doctors.length);
        
        setAppointmentStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = {
    labels: ['Scheduled', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          appointmentStats.scheduled,
          appointmentStats.completed,
          appointmentStats.cancelled
        ],
        backgroundColor: [
          '#3abff8',  // info (blue) for scheduled
          '#16a34a',  // success (green) for completed
          '#ef4444',  // error (red) for cancelled
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample data for specialties distribution
  const specialtyData = {
    labels: ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'],
    datasets: [
      {
        label: 'Doctors by Specialty',
        data: [4, 3, 2, 5, 3],
        backgroundColor: '#4f46e5',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body flex flex-row items-center">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
              <Users className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="card-title text-xl">{patientCount}</h2>
              <p className="text-gray-500">Total Patients</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body flex flex-row items-center">
            <div className="bg-secondary bg-opacity-10 p-3 rounded-full mr-4">
              <UserRound className="text-secondary" size={24} />
            </div>
            <div>
              <h2 className="card-title text-xl">{doctorCount}</h2>
              <p className="text-gray-500">Total Doctors</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body flex flex-row items-center">
            <div className="bg-accent bg-opacity-10 p-3 rounded-full mr-4">
              <Calendar className="text-accent" size={24} />
            </div>
            <div>
              <h2 className="card-title text-xl">{appointmentStats.total}</h2>
              <p className="text-gray-500">Today's Appointments</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg">Appointment Status</h2>
            <div className="h-64 flex items-center justify-center">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg">Doctors by Specialty</h2>
            <div className="h-64 flex items-center justify-center">
              <Bar 
                data={specialtyData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Appointments */}
      <div className="card bg-base-100 shadow-md mb-8">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-lg">Today's Appointments</h2>
            <Link to="/appointments" className="btn btn-sm btn-primary">View All</Link>
          </div>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto mb-2" size={32} />
              <p>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-gray-500" />
                          {formatDateTime(appointment.dateTime).split(',')[1]}
                        </div>
                      </td>
                      <td>
                        <Link to={`/patients/${appointment.patientId}`} className="font-medium hover:text-primary">
                          {appointment.patient?.name}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/doctors/${appointment.doctorId}`} className="hover:text-primary">
                          Dr. {appointment.doctor?.name}
                        </Link>
                      </td>
                      <td>
                        <span className={`badge ${
                          appointment.status === 'Scheduled' ? 'badge-info' : 
                          appointment.status === 'Completed' ? 'badge-success' : 
                          appointment.status === 'Cancelled' ? 'badge-error' : 
                          'badge-warning'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/appointments/new" className="btn btn-outline">
              <Calendar className="mr-2" size={18} />
              New Appointment
            </Link>
            <Link to="/patients/new" className="btn btn-outline">
              <UserRound className="mr-2" size={18} />
              Add Patient
            </Link>
            <Link to="/doctors/new" className="btn btn-outline">
              <ActivitySquare className="mr-2" size={18} />
              Add Doctor
            </Link>
            <Link to="/medical-history/new" className="btn btn-outline">
              <Clock className="mr-2" size={18} />
              Add Medical Record
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;