import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import { Office } from '../../../../types/hr';

interface OfficeModalProps {
  office: Office | null;
  onClose: () => void;
}

interface OfficeFormData {
  name: string;
  country: 'JP' | 'IN';
  timezone: string;
  address: string;
}

const OfficeModal: React.FC<OfficeModalProps> = ({ office, onClose }) => {
  const { t } = useTranslation();
  const { addOffice, updateOffice } = useHRStore();
  const { register, handleSubmit, formState: { errors } } = useForm<OfficeFormData>({
    defaultValues: office || {
      name: '',
      country: 'JP',
      timezone: 'Asia/Tokyo',
      address: ''
    }
  });

  const onSubmit = async (data: OfficeFormData) => {
    try {
      if (office) {
        await updateOffice(office.id, { ...data });
      } else {
        await addOffice({ ...data, isActive: true });
      }
      onClose();
    } catch (error) {
      console.error('Error saving office:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {office ? 'Edit Office' : 'Add Office'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Office Name
            </label>
            <input
              {...register('name', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <select
              {...register('country')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="JP">Japan</option>
              <option value="IN">India</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timezone
            </label>
            <select
              {...register('timezone')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              {...register('address', { required: true })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              {office ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficeModal;