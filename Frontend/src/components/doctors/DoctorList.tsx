import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../../api/doctors';
import { Doctor } from '../../api/types';
import Loading from '../common/Loading';
import { Search, Plus } from 'lucide-react';
import Button from '../common/Button';

interface DoctorListProps {
  onAddNew?: () => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ onAddNew }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDoctorClick = (doctorId: number) => {
    navigate(`/doctors/${doctorId}`);
  };

  if (loading) return <Loading message="Loading doctors..." />;

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
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
        <div className="form-control w-full sm:w-auto">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="input input-bordered"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-square">
              <Search size={20} />
            </button>
          </div>
        </div>
        {onAddNew && (
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={onAddNew}
          >
            Add New Doctor
          </Button>
        )}
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover cursor-pointer">
                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialty}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleDoctorClick(doctor.id)}
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

export default DoctorList;