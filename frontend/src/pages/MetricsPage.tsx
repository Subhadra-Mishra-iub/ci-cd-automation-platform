import React from 'react';

const MetricsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Metrics</h1>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Metrics</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">Performance monitoring interface coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;

