import React from 'react';

const CustomerSuccessOverview: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Success Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Health Score Overview</h2>
          <p>Content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSuccessOverview;