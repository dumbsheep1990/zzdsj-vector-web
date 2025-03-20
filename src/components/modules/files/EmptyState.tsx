import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = 'u6ca1u6709u6587u4ef6u6216u6587u4ef6u5939' }) => {
  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden transition-all duration-300">
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
