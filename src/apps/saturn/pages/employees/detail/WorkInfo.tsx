import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Calendar, Clock } from 'lucide-react';
import { EmployeeProfile } from '../../../../../types/hr';

interface WorkInfoProps {
  employee: EmployeeProfile;
}

const WorkInfo: React.FC<WorkInfoProps> = ({ employee }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      {/* Employment Type */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
          <Briefcase className="w-5 h-5 mr-2" />
          Employment Type
        </div>
        <div className="text-gray-900 dark:text-white">
          {employee.workInfo.employmentType
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </div>
      </div>

      {/* Contract Information */}
      {employee.workInfo.employmentType === 'contract' && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
            <Calendar className="w-5 h-5 mr-2" />
            Contract End Date
          </div>
          <div className="text-gray-900 dark:text-white">
            {employee.workInfo.contractEndDate?.toLocaleDateString() || 'Not set'}
          </div>
        </div>
      )}

      {/* Visa Information */}
      {employee.workInfo.visaStatus && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Visa Information
          </h4>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Visa Type
            </div>
            <div className="text-gray-900 dark:text-white">
              {employee.workInfo.visaStatus.type}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Expiry Date
            </div>
            <div className="text-gray-900 dark:text-white">
              {employee.workInfo.visaStatus.expiryDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Work Schedule */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
          <Clock className="w-5 h-5 mr-2" />
          Work Schedule
        </div>
        <div className="text-gray-900 dark:text-white">
          Standard Office Hours
        </div>
      </div>
    </div>
  );
};

export default WorkInfo;