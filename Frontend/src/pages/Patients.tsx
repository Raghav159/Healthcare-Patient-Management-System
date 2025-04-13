// src/pages/Patients.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash, Eye } from 'lucide-react';
import { getPatients, deletePatient } from '@/api/patients';
import { format } from 'date-fns';
import { Patient } from '@/api/types';

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['patients', page, searchTerm],
    queryFn: () =>
      getPatients({
        name: searchTerm || undefined,
        skip: page * limit,
        limit,
      }),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        refetch();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          <p className="text-sm text-gray-600">Manage patient records</p>
        </div>
        <Link to="/patients/new" className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Link>
      </div>

      {/* Search and filter */}
      <div className="card bg-base-100 mb-6 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-square">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Patients list */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <p>Error loading patients. Please try again.</p>
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No patients found.</p>
              <Link to="/patients/new" className="btn btn-primary">
                Add Your First Patient
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Date of Birth</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((patient: Patient) => (
                      <tr key={patient.id}>
                        <td>
                          <Link
                            to={`/patients/${patient.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {patient.name}
                          </Link>
                        </td>
                        <td>{patient.email}</td>
                        <td>{patient.phone || 'N/A'}</td>
                        <td>{format(new Date(patient.dob), 'MMM dd, yyyy')}</td>
                        <td>
                          <div className="flex space-x-2">
                            <Link
                              to={`/patients/${patient.id}`}
                              className="btn btn-sm btn-circle btn-ghost text-blue-600"
                              title="View"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              to={`/patients/${patient.id}/edit`}
                              className="btn btn-sm btn-circle btn-ghost text-amber-600"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(patient.id)}
                              className="btn btn-sm btn-circle btn-ghost text-red-600"
                              title="Delete"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Showing {data?.length} of {data?.length} patients
                </div>
                <div className="join">
                  <button
                    className="join-item btn"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </button>
                  <button className="join-item btn btn-active">{page + 1}</button>
                  <button
                    className="join-item btn"
                    disabled={(data?.length || 0) < limit}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;