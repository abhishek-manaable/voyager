import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Calendar,
  GripVertical
} from 'lucide-react';
import { useHackathonStore } from '../../../../store/hackathon';
import { useAuth } from '../../../../contexts/AuthContext';
import { UserRole } from '../../../../types/auth';
import { VotingCriteria } from '../../../../types/hackathon';

const VotingSettings: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { settings, updateSettings } = useHackathonStore();

  const [startDate, setStartDate] = useState(
    settings?.startDate.toISOString().split('T')[0] || ''
  );
  const [endDate, setEndDate] = useState(
    settings?.endDate.toISOString().split('T')[0] || ''
  );
  const [isActive, setIsActive] = useState(settings?.isActive || false);
  const [showResults, setShowResults] = useState(settings?.showResults || false);
  const [criteria, setCriteria] = useState<VotingCriteria[]>(
    settings?.criteria || []
  );
  const [error, setError] = useState<string | null>(null);

  // 管理者権限チェック
  if (authUser?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only administrators can access the settings page.
          </p>
        </div>
      </div>
    );
  }

  const handleAddCriteria = () => {
    setCriteria([
      ...criteria,
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        maxPoints: 5
      }
    ]);
  };

  const handleRemoveCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleCriteriaChange = (
    id: string,
    field: keyof VotingCriteria,
    value: string | number
  ) => {
    setCriteria(
      criteria.map(c =>
        c.id === id
          ? { ...c, [field]: value }
          : c
      )
    );
  };

  const handleSave = async () => {
    try {
      // バリデーション
      if (!startDate || !endDate) {
        setError('Please set both start and end dates.');
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setError('End date must be after start date.');
        return;
      }

      if (criteria.some(c => !c.name || !c.description)) {
        setError('All criteria must have a name and description.');
        return;
      }

      await updateSettings({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        showResults,
        criteria
      });

      navigate('/neptune/hackathon');
    } catch (error) {
      setError('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Voting Settings
        </h1>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Voting Period */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-primary-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Voting Period
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900 dark:text-white">
              Voting is active
            </span>
          </label>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showResults}
              onChange={(e) => setShowResults(e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900 dark:text-white">
              Show voting results
            </span>
          </label>
        </div>
      </div>

      {/* Voting Criteria */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Voting Criteria
          </h2>
          <button
            onClick={handleAddCriteria}
            className="flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Criteria
          </button>
        </div>

        <div className="space-y-4">
          {criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-shrink-0 mt-2">
                <GripVertical className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    value={criterion.name}
                    onChange={(e) => handleCriteriaChange(criterion.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    value={criterion.description}
                    onChange={(e) => handleCriteriaChange(criterion.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={criterion.maxPoints}
                    onChange={(e) => handleCriteriaChange(criterion.id, 'maxPoints', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemoveCriteria(criterion.id)}
                className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingSettings;