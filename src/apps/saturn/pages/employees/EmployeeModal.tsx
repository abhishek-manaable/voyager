import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import { useAuthStore } from '../../../../store/auth';
import { EmployeeProfile } from '../../../../types/hr';
import { AuthUser } from '../../../../types/auth';

interface EmployeeModalProps {
  employee?: EmployeeProfile;
  onClose: () => void;
}

interface EmployeeFormData {
  userId: string;
  employeeCode: string;
  fullName: string;
  officeId: string;
  departmentId: string;
  positionId: string;
  reportingTo?: string;
  joinDate: string;
  status: 'active' | 'leave' | 'retired';
  personalInfo: {
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    nationality: string;
    address: string;
    phone: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  workInfo: {
    employmentType: 'full-time' | 'contract' | 'part-time';
    contractEndDate?: string;
    visaStatus?: {
      type: string;
      expiryDate: string;
    };
  };
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose }) => {
  const { t } = useTranslation();
  const { offices, departments, positions, employees, addEmployee, updateEmployee } = useHRStore();
  const [step, setStep] = useState(1);
  const [availableUsers, setAvailableUsers] = useState<AuthUser[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EmployeeFormData>({
    defaultValues: employee ? {
      ...employee,
      joinDate: employee.joinDate.toISOString().split('T')[0],
      personalInfo: {
        ...employee.personalInfo,
        dateOfBirth: employee.personalInfo.dateOfBirth.toISOString().split('T')[0],
      },
      workInfo: {
        ...employee.workInfo,
        contractEndDate: employee.workInfo.contractEndDate?.toISOString().split('T')[0],
        visaStatus: employee.workInfo.visaStatus ? {
          ...employee.workInfo.visaStatus,
          expiryDate: employee.workInfo.visaStatus.expiryDate.toISOString().split('T')[0],
        } : undefined,
      },
    } : {
      userId: '',
      employeeCode: '',
      fullName: '',
      officeId: '',
      departmentId: '',
      positionId: '',
      joinDate: '',
      status: 'active',
      personalInfo: {
        dateOfBirth: '',
        gender: 'male',
        nationality: '',
        address: '',
        phone: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
        },
      },
      workInfo: {
        employmentType: 'full-time',
      },
    }
  });

  const employmentType = watch('workInfo.employmentType');
  const selectedUserId = watch('userId');

  // 既存の社員に紐付けられていないユーザーを取得
  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const allUsers = await useAuthStore.getState().getAllUsers();
        const usedUserIds = employees.map(emp => emp.userId);
        const available = allUsers.filter(user => 
          !usedUserIds.includes(user.uid) || user.uid === employee?.userId
        );
        setAvailableUsers(available);
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    };

    if (!employee) {
      fetchAvailableUsers();
    }
  }, [employee, employees]);

  // 選択されたユーザーの情報を自動入力
  useEffect(() => {
    if (selectedUserId && !employee) {
      const selectedUser = availableUsers.find(u => u.uid === selectedUserId);
      if (selectedUser) {
        setValue('employeeCode', selectedUser.email.split('@')[0].toUpperCase());
        setValue('fullName', selectedUser.displayName || '');
      }
    }
  }, [selectedUserId, availableUsers, employee, setValue]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const employeeData = {
        ...data,
        joinDate: new Date(data.joinDate + 'T00:00:00Z'),
        personalInfo: {
          ...data.personalInfo,
          dateOfBirth: new Date(data.personalInfo.dateOfBirth + 'T00:00:00Z'),
        },
        workInfo: {
          ...data.workInfo,
          contractEndDate: data.workInfo.contractEndDate 
            ? new Date(data.workInfo.contractEndDate + 'T00:00:00Z')
            : undefined,
          visaStatus: data.workInfo.visaStatus?.type
            ? {
                type: data.workInfo.visaStatus.type,
                expiryDate: new Date(data.workInfo.visaStatus.expiryDate + 'T00:00:00Z'),
              }
            : undefined,
        },
        skills: [],
        certifications: [],
      };

      if (employee) {
        await updateEmployee(employee.id, employeeData);
      } else {
        await addEmployee(employeeData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Basic Information
        return (
          <div className="space-y-4">
            {!employee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Voyager User
                </label>
                <select
                  {...register('userId', { required: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select User</option>
                  {availableUsers.map(user => (
                    <option key={user.uid} value={user.uid}>
                      {user.displayName} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.userId && (
                  <p className="text-red-500 text-sm mt-1">Please select a user</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                {...register('fullName', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employee Code
              </label>
              <input
                {...register('employeeCode', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                readOnly={!!selectedUserId}
              />
              {errors.employeeCode && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Office
              </label>
              <select
                {...register('officeId', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select Office</option>
                {offices.map(office => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
              {errors.officeId && (
                <p className="text-red-500 text-sm mt-1">Please select an office</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                {...register('departmentId', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nameEn} ({dept.nameJa})
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-red-500 text-sm mt-1">Please select a department</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <select
                {...register('positionId', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select Position</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.nameEn} ({pos.nameJa})
                  </option>
                ))}
              </select>
              {errors.positionId && (
                <p className="text-red-500 text-sm mt-1">Please select a position</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Join Date
              </label>
              <input
                type="date"
                {...register('joinDate', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.joinDate && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="active">Active</option>
                <option value="leave">On Leave</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
        );

      case 2: // Personal Information
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                {...register('personalInfo.dateOfBirth', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.personalInfo?.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                {...register('personalInfo.gender')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nationality
              </label>
              <input
                {...register('personalInfo.nationality', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.personalInfo?.nationality && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                {...register('personalInfo.address', { required: true })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.personalInfo?.address && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                {...register('personalInfo.phone', { required: true })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.personalInfo?.phone && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Emergency Contact
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  {...register('personalInfo.emergencyContact.name', { required: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.personalInfo?.emergencyContact?.name && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship
                </label>
                <input
                  {...register('personalInfo.emergencyContact.relationship', { required: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.personalInfo?.emergencyContact?.relationship && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  {...register('personalInfo.emergencyContact.phone', { required: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.personalInfo?.emergencyContact?.phone && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Work Information
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employment Type
              </label>
              <select
                {...register('workInfo.employmentType')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="full-time">Full Time</option>
                <option value="contract">Contract</option>
                <option value="part-time">Part Time</option>
              </select>
            </div>

            {employmentType === 'contract' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract End Date
                </label>
                <input
                  type="date"
                  {...register('workInfo.contractEndDate')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reporting To
              </label>
              <select
                {...register('reportingTo')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select Manager</option>
                {employees
                  .filter(emp => emp.id !== employee?.id)
                  .map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeCode})
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Visa Information
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Visa Type
                </label>
                <input
                  {...register('workInfo.visaStatus.type')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Visa Expiry Date
                </label>
                <input
                  type="date"
                  {...register('workInfo.visaStatus.expiryDate')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {employee ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStepContent()}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => step > 1 && setStep(step - 1)}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              Previous
            </button>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  {employee ? 'Update' : 'Create'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;