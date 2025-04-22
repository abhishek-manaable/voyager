import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  Award,
  History,
  Edit2
} from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import { useAuth } from '../../../../contexts/AuthContext';
import BasicInfo from './detail/BasicInfo';
import PersonalInfo from './detail/PersonalInfo';
import WorkInfo from './detail/WorkInfo';
import SkillsInfo from './detail/SkillsInfo';
import CertificationsInfo from './detail/CertificationsInfo';
import HistoryInfo from './detail/HistoryInfo';
import EmployeeModal from './EmployeeModal';

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'personal', label: 'Personal Info', icon: Building2 },
  { id: 'work', label: 'Work Info', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'history', label: 'History', icon: History },
];

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { employees, departments, offices, positions } = useHRStore();
  const { authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const employee = employees.find(e => e.id === id);
  if (!employee) return null;

  const department = departments.find(d => d.id === employee.departmentId);
  const office = offices.find(o => o.id === employee.officeId);
  const position = positions.find(p => p.id === employee.positionId);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfo employee={employee} department={department} office={office} position={position} />;
      case 'personal':
        return <PersonalInfo employee={employee} />;
      case 'work':
        return <WorkInfo employee={employee} />;
      case 'skills':
        return <SkillsInfo employee={employee} />;
      case 'certifications':
        return <CertificationsInfo employee={employee} />;
      case 'history':
        return <HistoryInfo employee={employee} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/saturn/employees')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {employee.employeeCode}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {department?.nameEn} • {office?.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {renderTabContent()}
      </div>

      {isEditModalOpen && (
        <EmployeeModal
          employee={employee}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDetail;