import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import { Department } from '../../../../types/hr';

interface DepartmentModalProps {
  department: Department | null;
  departments: Department[];
  onClose: () => void;
}

interface DepartmentFormData {
  code: string;
  nameJa: string;
  nameEn: string;
  parentId?: string;
  order: number;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  department,
  departments,
  onClose
}) => {
  const { t } = useTranslation();
  const { addDepartment, updateDepartment } = useHRStore();
  const { register, handleSubmit, formState: { errors } } = useForm<DepartmentFormData>({
    defaultValues: department || {
      code: '',
      nameJa: '',
      nameEn: '',
      parentId: '',
      order: departments.length
    }
  });

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (department) {
        await updateDepartment(department.id, {
          ...data,
          parentId: data.parentId || null
        });
      } else {
        await addDepartment({
          ...data,
          parentId: data.parentId || null,
          isActive: true
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  // 循環参照を防ぐため、選択可能な親部署をフィルタリング
  const availableParents = departments.filter(dept => 
    !department || (dept.id !== department.id && !isDescendant(dept, department.id, departments))
  );

  // 部署が指定された部署の子孫かどうかをチェック
  const isDescendant = (dept: Department, targetId: string, allDepts: Department[]): boolean => {
    if (!dept.parentId) return false;
    if (dept.parentId === targetId) return true;
    const parent = allDepts.find(d => d.id === dept.parentId);
    return parent ? isDescendant(parent, targetId, allDepts) : false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {department ? 'Edit Department' : 'Add Department'}
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
              Department Code
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
              Department Name (Japanese)
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
              Department Name (English)
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
              Parent Department
            </label>
            <select
              {...register('parentId')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">No Parent</option>
              {availableParents.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.nameEn} ({dept.nameJa})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Order
            </label>
            <input
              type="number"
              {...register('order', { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              {department ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;