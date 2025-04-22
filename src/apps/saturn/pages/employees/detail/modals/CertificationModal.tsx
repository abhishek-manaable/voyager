import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useHRStore } from '../../../../../../store/hr';

interface CertificationModalProps {
  employeeId: string;
  certification: {
    name: string;
    acquiredDate: Date;
    expiryDate?: Date;
    verificationUrl?: string;
  } | null;
  onClose: () => void;
}

interface CertificationFormData {
  name: string;
  acquiredDate: string;
  expiryDate?: string;
  verificationUrl?: string;
}

const CertificationModal: React.FC<CertificationModalProps> = ({
  employeeId,
  certification,
  onClose
}) => {
  const { t } = useTranslation();
  const { updateEmployee } = useHRStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CertificationFormData>({
    defaultValues: certification
      ? {
          ...certification,
          acquiredDate: certification.acquiredDate.toISOString().split('T')[0],
          expiryDate: certification.expiryDate?.toISOString().split('T')[0],
        }
      : {
          name: '',
          acquiredDate: '',
        }
  });

  const onSubmit = async (data: CertificationFormData) => {
    try {
      const certificationData = {
        ...data,
        acquiredDate: new Date(data.acquiredDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      };

      await updateEmployee(employeeId, {
        certifications: certification
          ? // Update existing certification
            employee.certifications.map(c =>
              c.name === certification.name
                ? certificationData
                : c
            )
          : // Add new certification
            [...employee.certifications, certificationData]
      });
      onClose();
    } catch (error) {
      console.error('Error saving certification:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {certification ? 'Edit Certification' : 'Add Certification'}
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
              Certification Name
            </label>
            <input
              {...register('name', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Acquired Date
            </label>
            <input
              type="date"
              {...register('acquiredDate', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.acquiredDate && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              {...register('expiryDate')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verification URL
            </label>
            <input
              type="url"
              {...register('verificationUrl')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
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
              {certification ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;