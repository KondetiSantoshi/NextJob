import React from 'react';

export const PageLoader: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
};
