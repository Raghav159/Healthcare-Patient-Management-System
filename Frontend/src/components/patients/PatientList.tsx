// src/components/patients/PatientList.tsx
import { useState, useEffect } from 'react';
import { getPatients } from '../../api/patients';
import { Patient } from '../../api/types';
import { PatientCard } from './PatientCard';
import Loading from '../common/Loading';
import { toast } from 'react-toastify';

export const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    name?: string;
    email?: string;
  }>({});

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await getPatients(filters);
        setPatients(data);
      } catch (error) {
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Filter Patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                onChange={handleFilterChange}
                placeholder="Enter Name"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                onChange={handleFilterChange}
                placeholder="Enter Email"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : patients.length === 0 ? (
        <div className="text-center text-gray-500">No patients found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
};