import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createMedicalHistory, updateMedicalHistory } from '../../api/medicalHistory';
import { MedicalHistory, MedicalHistoryCreate } from '../../api/types';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { useState } from 'react';

interface MedicalHistoryFormProps {
  medicalHistory?: MedicalHistory;
  patientId: number;
  onSuccess?: () => void;
}

const schema = yup.object().shape({
    diagnosis: yup.string().required('Diagnosis is required').trim(),
    treatment: yup.string().nullable().optional(), // Allow null or undefined
    date: yup.string().required('Date is required'), // Relaxed date validation
    patientId: yup.number().required('Patient ID is required').positive().integer(),
  }).required();

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  medicalHistory,
  patientId,
  onSuccess,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MedicalHistoryCreate>({
    resolver: yupResolver(schema),
    defaultValues: medicalHistory
      ? {
          patientId,
          diagnosis: medicalHistory.diagnosis,
          treatment: medicalHistory.treatment || undefined,
          date: formatDate(medicalHistory.date, 'yyyy-MM-dd'),
        }
      : { patientId },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<MedicalHistoryCreate> = async (data) => {
    setLoading(true);
    try {
      if (medicalHistory) {
        await updateMedicalHistory(medicalHistory.id, data);
        toast.success('Medical history updated successfully');
      } else {
        await createMedicalHistory(data);
        toast.success('Medical history created successfully');
      }
      reset({ patientId });
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving medical history:', error);
      toast.error(error.message || 'Failed to save medical history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('patientId')} />

      <div>
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <FileText className="h-4 w-4" /> Diagnosis
          </span>
        </label>
        <textarea
          {...register('diagnosis')}
          className={`textarea textarea-bordered w-full ${errors.diagnosis ? 'textarea-error' : ''}`}
          placeholder="Enter diagnosis"
        />
        {errors.diagnosis && <p className="text-error text-sm mt-1">{errors.diagnosis.message}</p>}
      </div>

      <div>
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <FileText className="h-4 w-4" /> Treatment
          </span>
        </label>
        <textarea
          {...register('treatment')}
          className={`textarea textarea-bordered w-full ${errors.treatment ? 'textarea-error' : ''}`}
          placeholder="Enter treatment (optional)"
        />
        {errors.treatment && <p className="text-error text-sm mt-1">{errors.treatment.message}</p>}
      </div>

      <div>
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Date
          </span>
        </label>
        <input
          type="date"
          {...register('date')}
          className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
        />
        {errors.date && <p className="text-error text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : medicalHistory ? 'Update Record' : 'Create Record'}
        </Button>
        <Button type="button" className="btn-ghost" onClick={() => reset({ patientId })}>
          Reset
        </Button>
      </div>
    </form>
  );
};