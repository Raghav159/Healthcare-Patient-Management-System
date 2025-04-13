// src/components/medicalHistory/MedicalHistoryList.tsx
import { useState, useEffect } from 'react';
import { getPatientMedicalHistory } from '../../api/medicalHistory';
import { MedicalHistory } from '../../api/types';
import Card from '../common/Card';
import Loading from '../common/Loading';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/dateUtils';
import { FileText, Calendar } from 'lucide-react';

interface MedicalHistoryListProps {
  patientId: number;
}

export const MedicalHistoryList: React.FC<MedicalHistoryListProps> = ({ patientId }) => {
  const [history, setHistory] = useState<MedicalHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getPatientMedicalHistory(patientId);
        setHistory(data);
      } catch (error) {
        toast.error('Failed to load medical history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  return (
    <div className="space-y-4">
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