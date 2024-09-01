import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface AddCandidateModalData {
  name: string;
  email: string;
  phone: string;
  position_applied: string;
  experience_years: number;
  status: "applied" | "interviewed";
  notes: string;
}

interface AddCandidateModalProps {
  onClose: () => void;
  open: boolean;
}

const AddCandidateModal: FC<AddCandidateModalProps> = ({ onClose, open }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AddCandidateModalData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position_applied: '',
      experience_years: 0,
      status: 'applied',
      notes: '',
    },
  });

  const onSubmit: SubmitHandler<AddCandidateModalData> = async (data) => {
    if (!data.name.trim() ||
      !data.email ||
      !data.phone ||
      !data.position_applied.trim() ||
      !data.experience_years ||
      !data.status
    ) {
      return;
    }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="fixed p-4 w-9/12 bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md">
        <h2 className="text-2xl font-bold mb-4">Add Candidate</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { required: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="john.doe@company.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone', { required: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="123-45-678"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>

            <div>
              <label
                htmlFor="position_applied"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Position applied
              </label>
              <input
                type="text"
                id="position_applied"
                {...register('position_applied', { required: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Software Engineer"
                required
              />
            </div>

            <div>
              <label
                htmlFor="experience_years"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Experience years
              </label>
              <input
                type="number"
                id="experience_years"
                {...register('experience_years', { required: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="5"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <select
                id="status"
                {...register('status', { required: true })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="applied">Applied</option>
                <option value="interviewed">Interviewed</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label
                htmlFor="notes"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Notes
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
            </div>
          </div>

          <div className="flex gap-4 justify-space-between mt-4 sm:flex-col">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-nonefont-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
              disabled={isSubmitting}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
              Cancel
            </button>
          </div>
        </form>
      </div >
    </div>
  );
};

export { AddCandidateModal };
