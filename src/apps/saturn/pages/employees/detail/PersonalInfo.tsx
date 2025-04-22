import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, User, Phone as EmergencyPhone } from 'lucide-react';
import { EmployeeProfile } from '../../../../../types/hr';

interface PersonalInfoProps {
  employee: EmployeeProfile;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ employee }) => {
  const { t } = useTranslation();

  const personalDetails = [
    {
      icon: User,
      label: 'Gender',
      value: employee.personalInfo.gender.charAt(0).toUpperCase() + 
             employee.personalInfo.gender.slice(1)
    },
    {
      icon: MapPin,
      label: 'Nationality',
      value: employee.personalInfo.nationality
    },
    {
      icon: Phone,
      label: 'Phone',
      value: employee.personalInfo.phone
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Basic Personal Info */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personalDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Icon className="w-5 h-5 mr-2" />
                  {detail.label}
                </div>
                <div className="text-gray-900 dark:text-white">
                  {detail.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date of Birth */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Date of Birth
        </h4>
        <div className="text-gray-900 dark:text-white">
          {employee.personalInfo.dateOfBirth.toLocaleDateString()}
        </div>
      </div>

      {/* Address */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Address
        </h4>
        <div className="text-gray-900 dark:text-white">
          {employee.personalInfo.address}
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Emergency Contact
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
            <div className="text-gray-900 dark:text-white">
              {employee.personalInfo.emergencyContact.name}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Relationship
            </div>
            <div className="text-gray-900 dark:text-white">
              {employee.personalInfo.emergencyContact.relationship}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
            <div className="text-gray-900 dark:text-white">
              {employee.personalInfo.emergencyContact.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;