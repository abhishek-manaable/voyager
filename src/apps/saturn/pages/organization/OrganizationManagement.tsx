import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Users, Briefcase } from 'lucide-react';
import { useHRStore } from '../../../../store/hr';
import OfficeList from './OfficeList';
import DepartmentList from './DepartmentList';
import PositionList from './PositionList';

const OrganizationManagement: React.FC = () => {
  const { t } = useTranslation();
  const { offices, departments, positions, initialize } = useHRStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  const tabs = [
    {
      icon: Building2,
      label: 'Offices',
      path: '/saturn/organization/offices',
      count: offices.length
    },
    {
      icon: Users,
      label: 'Departments',
      path: '/saturn/organization/departments',
      count: departments.length
    },
    {
      icon: Briefcase,
      label: 'Positions',
      path: '/saturn/organization/positions',
      count: positions.length
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <a
              key={tab.path}
              href={tab.path}
              className="group inline-flex items-center px-1 py-4 border-b-2 border-transparent font-medium text-sm hover:text-primary-600 hover:border-primary-600"
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </a>
          ))}
        </nav>
      </div>

      <Routes>
        <Route path="/offices" element={<OfficeList />} />
        <Route path="/departments" element={<DepartmentList />} />
        <Route path="/positions" element={<PositionList />} />
      </Routes>
    </div>
  );
};

export default OrganizationManagement;