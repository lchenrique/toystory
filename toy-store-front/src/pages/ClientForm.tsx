import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import clientService from '../services/clientService';

interface ClientFormData {
  name: string;
  email: string;
  birthDate: string;
}

const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ClientFormData>();

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const clientData = {
        name: data.name,
        email: data.email,
        birthDate: new Date(data.birthDate)
      };

      await clientService.createClient(clientData);
      setSuccessMessage('Client created successfully!');

      // Reset form
      reset();

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/clients');
      }, 1500);

    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.response?.data?.message || 'Failed to create client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
          <p className="text-gray-600 mt-1">Create a new client record</p>
        </div>
        <button
          onClick={handleCancel}
          className="btn-secondary"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Clients
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { 
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="form-input"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="form-input"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Birth Date Field */}
            <div>
              <label htmlFor="birthDate" className="form-label">
                Date of Birth *
              </label>
              <input
                type="date"
                id="birthDate"
                {...register('birthDate', { 
                  required: 'Date of birth is required',
                  validate: {
                    notFuture: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      return selectedDate <= today || 'Date of birth cannot be in the future';
                    },
                    notTooOld: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      const age = today.getFullYear() - selectedDate.getFullYear();
                      return age <= 120 || 'Please enter a valid date of birth';
                    }
                  }
                })}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthDate && (
                <p className="form-error">{errors.birthDate.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Client
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;