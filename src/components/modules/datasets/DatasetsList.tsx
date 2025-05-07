import React, { FC } from 'react';
import { Database, BookOpen, Users, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';
import { QaDataset } from '../../../utils/types';

interface DatasetsListProps {
  datasets: QaDataset[];
  selectedItem: QaDataset | null;
  setSelectedItem: (item: QaDataset | null) => void;
}

const DatasetsList: FC<DatasetsListProps> = ({ datasets, selectedItem, setSelectedItem }) => {
  // 获取数据集状态显示样式
  const getStatusStyles = (status: QaDataset['status']) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-green-100',
          border: 'border-green-200',
          text: 'text-green-700',
          dot: 'bg-green-500'
        };
      case 'processing':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          dot: 'bg-yellow-500'
        };
      case 'inactive':
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-700',
          dot: 'bg-gray-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-700',
          dot: 'bg-gray-500'
        };
    }
  };

  // 获取状态文字
  const getStatusText = (status: QaDataset['status']) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'processing':
        return '处理中';
      case 'inactive':
        return '未启用';
      default:
        return '未知';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          {datasets.map((dataset) => {
            const statusStyles = getStatusStyles(dataset.status);
            return (
              <tr
                key={dataset.id}
                className={`group transition-all duration-200 cursor-pointer ${
                  selectedItem?.id === dataset.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-50/30 border-l-2 border-l-blue-500'
                    : 'hover:bg-gray-50/80'
                }`}
                onClick={() => setSelectedItem(dataset)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm">
                      <BookOpen size={16} className="text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">{dataset.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-blue-50 w-7 h-7 rounded-md flex items-center justify-center mr-2">
                      <Database size={14} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{dataset.pairsCount}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-50 w-7 h-7 rounded-md flex items-center justify-center mr-2">
                      <Users size={14} className="text-indigo-500" />
                    </div>
                    <span className="text-sm text-gray-700">
                      {dataset.linkedAssistants && dataset.linkedAssistants.length > 0
                        ? `${dataset.linkedAssistants.length}个助手`
                        : '未绑定'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 w-7 h-7 rounded-md flex items-center justify-center mr-2">
                      <Clock size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-600">{formatDate(dataset.updatedAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusStyles.bg} ${statusStyles.text} border ${statusStyles.border}`}
                  >
                    <span className={`w-1.5 h-1.5 ${statusStyles.dot} rounded-full mr-1.5`}></span>
                    {getStatusText(dataset.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex space-x-3 justify-end items-center">
                    <button className="text-gray-400 hover:text-blue-600 bg-transparent hover:bg-blue-50 rounded-full p-1.5 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetsList;
