import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import { Position } from '../../../../types/hr';

interface PositionModalProps {
  position: Position | null;
  onClose: () => void;
}

interface PositionFormData {
  code: string;
  nameJa: string;
  nameEn: string;
  level: number;
  isActive: boolean;
}

const PositionModal: React.FC<PositionModalProps> = ({
  position,
  onClose
}) => {
  const { t } = useTranslation();
  const { addPosition, updatePosition } = useHRStore();
  const { register, handleSubmit, formState: { errors } } = useForm<PositionFormData>({
    defaultValues: position || {
      code: '',
      nameJa: '',
      nameEn: '',
      level: 1,
      isActive: true
    }
  });

  const onSubmit = async (data: PositionFormData) => {
    try {
      if (position) {
        await updatePosition(position.id, data);
      } else {
        await addPosition(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {position ? 'Edit Position' : 'Add Position'}
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
              Position Code
            </label>
            <input
              {...register('code', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position Name (Japanese)
            </label>
            <input
              {...register('nameJa', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.nameJa && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position Name (English)
            </label>
            <input
              {...register('nameEn', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.nameEn && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level
            </label>
            <input
              type="number"
              min="1"
              max="10"
              {...register('level', { required: true, min: 1, max: 10 })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.level && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid level (1-10)</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900 dark:text-white">
              Active
            </label>
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
              {position ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PositionModal;