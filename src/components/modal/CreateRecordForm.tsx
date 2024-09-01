import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import './CreateRecordForm.css';

interface FormData {
  name: string;
  email: string;
  // Другие поля формы
}

interface CreateRecordFormProps {
  onClose: () => void;
  open: boolean;
}

const CreateRecordForm: React.FC<CreateRecordFormProps> = ({ onClose, open }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({});

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="form-popup">
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h2>Create New Record</h2>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register('name')}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register('email')}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          Submit
        </button>
        <button type="button" onClick={onClose} className="cancel-button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export { CreateRecordForm };
