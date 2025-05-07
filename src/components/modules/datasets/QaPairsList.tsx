import React, { FC, useState } from 'react';
import { MessageSquare, Tag, Calendar, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { QaPair } from '../../../utils/types';

interface QaPairsListProps {
  qaPairs: QaPair[];
  onEdit: (pair: QaPair) => void;
  onDelete: (pairId: string) => void;
}

const QaPairsList: FC<QaPairsListProps> = ({ qaPairs, onEdit, onDelete }) => {
  const [expandedPairs, setExpandedPairs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedPairs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 获取问答对的来源标签
  const getSourceTag = (sourceType: QaPair['sourceType']) => {
    switch (sourceType) {
      case 'manual':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          label: '手动创建'
        };
      case 'auto':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          label: '自动拆分'
        };
      case 'imported':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          label: '导入'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          label: '未知'
        };
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 构建问答对的显示树结构（父问题和子问题的关系）
  const buildQaPairsTree = () => {
    const parentPairs = qaPairs.filter(pair => !pair.parentId);
    const childPairsByParentId: Record<string, QaPair[]> = {};

    qaPairs.filter(pair => pair.parentId).forEach(pair => {
      if (pair.parentId) {
        if (!childPairsByParentId[pair.parentId]) {
          childPairsByParentId[pair.parentId] = [];
        }
        childPairsByParentId[pair.parentId].push(pair);
      }
    });

    return { parentPairs, childPairsByParentId };
  };

  const { parentPairs, childPairsByParentId } = buildQaPairsTree();

  const renderQaPair = (pair: QaPair, isChild = false) => {
    const sourceTag = getSourceTag(pair.sourceType);
    const hasChildren = childPairsByParentId[pair.id]?.length > 0;
    const isExpanded = expandedPairs[pair.id] || false;

    return (
      <React.Fragment key={pair.id}>
        <div
          className={`border rounded-lg mb-4 overflow-hidden bg-white shadow-sm transition-all ${
            isChild ? 'ml-8 border-gray-200' : 'border-gray-300'
          }`}
        >
          {/* 问题标题栏 */}
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <MessageSquare className="text-blue-500 mr-2" size={18} />
              <h3 className="font-medium text-gray-800">{pair.question}</h3>
            </div>
            <div className="flex space-x-2">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(pair.id)}
                  className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              )}
              <button
                onClick={() => onEdit(pair)}
                className="p-1 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => onDelete(pair.id)}
                className="p-1 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* 问答内容区 */}
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-gray-700 whitespace-pre-line">{pair.answer}</p>
            </div>

            {/* 元信息区 */}
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-0.5 rounded ${sourceTag.bg} ${sourceTag.text} text-xs`}>
                  {sourceTag.label}
                </span>
                
                {pair.tags && pair.tags.length > 0 && (
                  <div className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    <div className="flex flex-wrap gap-1">
                      {pair.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(pair.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 渲染子问题 */}
        {hasChildren && isExpanded && childPairsByParentId[pair.id].map(child => renderQaPair(child, true))}
      </React.Fragment>
    );
  };

  return (
    <div className="py-2">
      {parentPairs.length > 0 ? (
        parentPairs.map(pair => renderQaPair(pair))
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">当前数据集没有问答对，请添加问答内容</p>
        </div>
      )}
    </div>
  );
};

export default QaPairsList;
