import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Building2, Briefcase } from 'lucide-react';
import { useHRStore } from '../../../store/hr';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { employees, departments, offices } = useHRStore();

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const activeDepartments = departments.filter(dept => dept.isActive);
  const activeOffices = offices.filter(office => office.isActive);

  const metrics = [
    {
      icon: Users,
      label: 'Active Employees',
      value: activeEmployees.length,
      change: '+5% from last month'
    },
    {
      icon: Building2,
      label: 'Departments',
      value: activeDepartments.length,
      change: 'No change'
    },
    {
      icon: Briefcase,
      label: 'Offices',
      value: activeOffices.length,
      change: 'No change'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        HR Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
              </div>
              <metric.icon className="w-8 h-8 text-primary-500" />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {/* Activity items will be implemented here */}
            <p className="text-gray-500 dark:text-gray-400">
              Recent activities will be displayed here
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {/* Event items will be implemented here */}
            <p className="text-gray-500 dark:text-gray-400">
              Upcoming events will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;