import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DoctorCreate, DoctorUpdate, Doctor } from '../../api/types';
import Button from '../common/Button';
import { createDoctor, updateDoctor } from '../../api/doctors';

interface DoctorFormProps {
  doctor?: Doctor;
  onSuccess: (doctor: Doctor) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  doctor,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!doctor;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorCreate>({
    defaultValues: doctor ? {
      name: doctor.name,
      specialty: doctor.specialty,
    } : undefined,
  });

  const onSubmit = async (data: DoctorCreate) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      let result: Doctor;
      
      if (isEditing && doctor) {
        const updateData: DoctorUpdate = {
          name: data.name,
          specialty: data.specialty,
        };
        result = await updateDoctor(doctor.id, updateData);
      } else {
        result = await createDoctor(data);
      }
      
      onSuccess(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to ${isEditing ? 'update' : 'create'} doctor: ${message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="alert alert-error">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Specialty</span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${errors.specialty ? 'input-error' : ''}`}
          {...register('specialty', { required: 'Specialty is required' })}
        />
        {errors.specialty && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.specialty.message}</span>
          </label>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {isEditing ? 'Update' : 'Create'} Doctor
        </Button>
      </div>
    </form>
  );
};

export default DoctorForm;