import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Plus } from 'lucide-react';

const TimeOff: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const isJapan = country === 'jp';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Time Off ({isJapan ? 'Japan' : 'India'})
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <Plus className="w-4 h-4 mr-2" />
            Request Time Off
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Paid Leave Balance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Annual Leave
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                15 days
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Used: 5 days
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Carried Over
              </div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                3 days
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Expires: March 31, 2024
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Requests
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              <div>Type</div>
              <div>Date</div>
              <div>Duration</div>
              <div>Status</div>
              <div>Approver</div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-4 py-2 text-gray-900 dark:text-white">
                <div>Paid Leave</div>
                <div>Dec 25, 2023</div>
                <div>1 day</div>
                <div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Approved
                  </span>
                </div>
                <div>John Doe</div>
              </div>
              <div className="grid grid-cols-5 gap-4 py-2 text-gray-900 dark:text-white">
                <div>Paid Leave</div>
                <div>Dec 29-30, 2023</div>
                <div>2 days</div>
                <div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Pending
                  </span>
                </div>
                <div>John Doe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Leave History
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div>Type</div>
            <div>Date</div>
            <div>Duration</div>
            <div>Status</div>
            <div>Approver</div>
            <div>Comment</div>
          </div>
          <div className="space-y-2">
            {/* Leave history items will be mapped here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOff;