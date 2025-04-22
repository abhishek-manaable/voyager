import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const TimeSheet: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isJapan = country === 'jp';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Time Sheet ({isJapan ? 'Japan' : 'India'})
        </h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-5 h-5" />
              <span>{selectedDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-green-500">09:30</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">18:30</span>
              </div>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Clock In
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Time Records
              </h3>
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <div>Type</div>
                <div>Time</div>
                <div>Location</div>
                <div>Note</div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-4 py-2 text-gray-900 dark:text-white">
                  <div className="text-green-500">Clock In</div>
                  <div>09:30</div>
                  <div>Office</div>
                  <div>-</div>
                </div>
                <div className="grid grid-cols-4 gap-4 py-2 text-gray-900 dark:text-white">
                  <div className="text-red-500">Clock Out</div>
                  <div>18:30</div>
                  <div>Office</div>
                  <div>-</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Break Time
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <div>Type</div>
                <div>Duration</div>
                <div>Time</div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 py-2 text-gray-900 dark:text-white">
                  <div>Lunch Break</div>
                  <div>1h</div>
                  <div>12:00 - 13:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSheet;