import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PatientCreate, PatientUpdate, Patient } from '../../api/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';

interface PatientFormProps {
  patient?: Patient;
  onSuccess?: () => void;
  initialValues?: Patient;
  onSubmit: (values: PatientCreate | PatientUpdate) => Promise<any>;
  isEditing?: boolean;
}

const PatientSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().nullable(),
  dob: Yup.date().required('Date of birth is required'),
});

const PatientForm: React.FC<PatientFormProps> = ({ 
  initialValues, 
  onSubmit, 
  isEditing = false 
}) => {
  const navigate = useNavigate();
  
  const defaultValues: PatientCreate = {
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    dob: initialValues?.dob || format(new Date(), 'yyyy-MM-dd'),
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={PatientSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        try {
          await onSubmit(values);
          navigate('/patients');
        } catch (error) {
          console.error('Error submitting form:', error);
          setStatus({ error: 'Failed to save patient. Please try again.' });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, values, status, errors, touched }) => (
        <Form className="space-y-6">
          {status?.error && (
            <div className="alert alert-error">
              <p>{status.error}</p>
            </div>
          )}

          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text">Full Name*</span>
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              className={`input input-bordered w-full ${
                errors.name && touched.name ? 'input-error' : ''
              }`}
            />
            <ErrorMessage name="name" component="div" className="text-error text-sm mt-1" />
          </div>

          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email Address*</span>
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              disabled={isEditing}
              className={`input input-bordered w-full ${
                errors.email && touched.email ? 'input-error' : ''
              }`}
            />
            <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
            {isEditing && (
              <div className="text-xs text-gray-500 mt-1">
                Email cannot be changed once a patient is created.
              </div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="phone" className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <Field
              id="phone"
              name="phone"
              type="text"
              className="input input-bordered w-full"
            />
            <ErrorMessage name="phone" component="div" className="text-error text-sm mt-1" />
          </div>

          <div className="form-control">
            <label htmlFor="dob" className="label">
              <span className="label-text">Date of Birth*</span>
            </label>
            <DatePicker
              selected={values.dob ? new Date(values.dob) : null}
              onChange={(date) => {
                if (date) {
                  setFieldValue('dob', format(date, 'yyyy-MM-dd'));
                }
              }}
              dateFormat="MMMM d, yyyy"
              className={`input input-bordered w-full ${
                errors.dob && touched.dob ? 'input-error' : ''
              }`}
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select"
            />
            <ErrorMessage name="dob" component="div" className="text-error text-sm mt-1" />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/patients')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                'Save Patient'
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PatientForm;