// src/pages/MedicalHistory.tsx
import { useState, useEffect } from 'react';
import { getPatientMedicalHistory } from '../api/medicalHistory';
import MedicalHistory from '../api/types';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateUtils';
import { FileText, Calendar, User } from 'lucide-react';

export const MedicalHistory: React.FC = () => {
  const [history, setHistory] = useState<MedicalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState<number | undefined>();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Fetch all history for a specific patient or placeholder for admin view
        const data = patientId ? await getPatientMedicalHistory(patientId) : [];
        setHistory(data);
      } catch (error) {
        toast.error('Failed to load medical history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  const handlePatientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientId(e.target.value ? Number(e.target.value) : undefined);
  };

  return (
    <div className="space-y-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Filter Medical History</h2>
          <div>
            <label className="label">Patient ID</label>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              onChange={handlePatientIdChange}
              placeholder="Enter Patient ID"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500">No medical history found.</div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Record #{record.id}
                </h2>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient: {record.patient?.name || 'Unknown'}
                </p>
                <p className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Diagnosis: {record.diagnosis}
                </p>
                {record.treatment && (
                  <p className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Treatment: {record.treatment}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date: {formatDate(record.date, 'PP')}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};