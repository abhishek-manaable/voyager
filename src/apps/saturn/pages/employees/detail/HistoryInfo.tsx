import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, Building2, Briefcase } from 'lucide-react';
import { EmployeeProfile } from '../../../../../types/hr';

interface HistoryInfoProps {
  employee: EmployeeProfile;
}

const HistoryInfo: React.FC<HistoryInfoProps> = ({ employee }) => {
  const { t } = useTranslation();

  // この部分は後ほど実装する履歴データに基づいて拡張する予定
  const mockHistory = [
    {
      type: 'department',
      icon: Building2,
      date: '2023-04-01',
      title: 'Department Change',
      from: 'Sales Department',
      to: 'Marketing Department'
    },
    {
      type: 'position',
      icon: Briefcase,
      date: '2023-01-01',
      title: 'Position Change',
      from: 'Sales Representative',
      to: 'Senior Sales Representative'
    }
  ];

  return (
    <div className="p-6">
      <div className="relative">
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
          aria-hidden="true"
        />

        <ul className="space-y-6">
          {mockHistory.map((event, index) => {
            const Icon = event.icon;
            return (
              <li key={index} className="relative pl-10">
                <div className="absolute left-0 top-1 p-2 bg-white dark:bg-gray-800 rounded-full border-2 border-primary-500">
                  <Icon className="w-4 h-4 text-primary-500" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {event.date}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      From: {event.from}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      To: {event.to}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HistoryInfo;