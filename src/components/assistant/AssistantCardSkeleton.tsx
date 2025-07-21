import React from 'react';
import { motion } from 'framer-motion';

interface AssistantCardSkeletonProps {
  className?: string;
}

const AssistantCardSkeleton: React.FC<AssistantCardSkeletonProps> = ({ className }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              {/* Name skeleton */}
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              {/* Status skeleton */}
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          {/* Switch skeleton */}
          <div className="w-8 h-5 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
        </div>

        {/* Model info skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>

        {/* Capabilities skeleton */}
        <div className="flex flex-wrap gap-1.5">
          <div className="h-6 bg-gray-200 rounded-md animate-pulse w-16"></div>
          <div className="h-6 bg-gray-200 rounded-md animate-pulse w-20"></div>
          <div className="h-6 bg-gray-200 rounded-md animate-pulse w-14"></div>
        </div>

        {/* Knowledge base skeleton */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <div className="h-6 bg-gray-200 rounded-md animate-pulse w-20"></div>
            <div className="h-6 bg-gray-200 rounded-md animate-pulse w-16"></div>
          </div>
        </div>
      </div>

      {/* Footer Actions skeleton */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex space-x-2">
          <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AssistantCardSkeleton;