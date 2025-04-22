import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Users, Briefcase } from 'lucide-react';
import { EmployeeProfile, Department, Office, Position } from '../../../../../types/hr';

interface BasicInfoProps {
  employee: EmployeeProfile;
  department?: Department;
  office?: Office;
  position?: Position;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  employee,
  department,
  office,
  position
}) => {
  const { t } = useTranslation();

  const infoItems = [
    {
      icon: Building2,
      label: 'Office',
      value: office?.name,
      subValue: office?.country
    },
    {
      icon: Users,
      label: 'Department',
      value: department?.nameEn,
      subValue: department?.nameJa
    },
    {
      icon: Briefcase,
      label: 'Position',
      value: position?.nameEn,
      subValue: position?.nameJa
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Employee Name and Status */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {employee.fullName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {employee.employeeCode}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join Date: {employee.joinDate.toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            employee.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : employee.status === 'leave'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
        </span>
      </div>

      {/* Organization Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Icon className="w-5 h-5 mr-2" />
                {item.label}
              </div>
              <div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {item.value || '-'}
                </div>
                {item.subValue && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.subValue}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reporting Line */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Reporting Line
        </h4>
        {employee.reportingTo ? (
          <div className="text-gray-900 dark:text-white">
            Reports to: {employee.reportingTo}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            No reporting line set
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfo;