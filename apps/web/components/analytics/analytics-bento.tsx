export const AnalyticsBento = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
      <div className="relative z-10">
        <h3 className="text-2xl font-semibold text-white mb-4">Analytics Dashboard</h3>
        <p className="text-gray-300 mb-6">
          Monitor your API usage with real-time analytics and insights.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">1.2M</div>
            <div className="text-sm text-gray-400">Requests</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">45ms</div>
            <div className="text-sm text-gray-400">Latency</div>
          </div>
        </div>
      </div>
    </div>
  );
};
