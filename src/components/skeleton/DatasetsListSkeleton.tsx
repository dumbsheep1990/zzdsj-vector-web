import React from 'react';
import { Database, BookOpen, Users, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';

interface DatasetsListSkeletonProps {
  rowCount?: number;
}

const DatasetsListSkeleton: React.FC<DatasetsListSkeletonProps> = ({ rowCount = 5 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">数据集名称</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">问答对数量</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">绑定助手</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">最后更新</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">状态</th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pr-8">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Array(rowCount).fill(0).map((_, index) => (
            <tr key={index} className="group transition-all duration-200">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full skeleton-pulse" />
                  <div className="ml-3">
                    <div className="skeleton-pulse h-4 w-32 mb-1 rounded"></div>
                    <div className="skeleton-pulse h-3 w-40 rounded"></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="skeleton-pulse w-7 h-7 rounded-md mr-2"></div>
                  <div className="skeleton-pulse h-4 w-8 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="skeleton-pulse w-7 h-7 rounded-md mr-2"></div>
                  <div className="skeleton-pulse h-4 w-16 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="skeleton-pulse w-7 h-7 rounded-md mr-2"></div>
                  <div className="skeleton-pulse h-4 w-24 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="skeleton-pulse h-6 w-16 rounded-md"></div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex space-x-3 justify-end items-center">
                  <div className="skeleton-pulse w-8 h-8 rounded-full"></div>
                  <div className="skeleton-pulse w-5 h-5 rounded-full"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetsListSkeleton;
