import React from 'react';
import { useTranslation } from 'react-i18next';

const SalesOverview = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Sales Overview
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <p>Sales dashboard content will be implemented here.</p>
      </div>
    </div>
  );
};

export default SalesOverview;