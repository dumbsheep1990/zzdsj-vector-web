import React, { FC, useState, useEffect } from 'react';
import { BookOpen, Database, Users, Calendar, Plus, FileText, MessageSquare, Link, Unlink } from 'lucide-react';
import { QaDataset, QaPair, AssistantItem } from '../../../utils/types';
import QaPairsList from './QaPairsList';
import { getDatasetQaPairs } from '../../../utils/mockQaData';

interface DatasetDetailPanelProps {
  dataset: QaDataset;
  onClose: () => void;
  onCreatePair: () => void;
  onEditPair: (pair: QaPair) => void;
  onDeletePair: (pairId: string) => void;
  onLinkAssistant: () => void;
  onSplitQa: () => void;
}

const DatasetDetailPanel: FC<DatasetDetailPanelProps> = ({
  dataset,
  onClose,
  onCreatePair,
  onEditPair,
  onDeletePair,
  onLinkAssistant,
  onSplitQa
}) => {
  const [activeTab, setActiveTab] = useState('问答内容');
  const [qaPairs, setQaPairs] = useState<QaPair[]>([]);

  // 获取数据集的问答对
  useEffect(() => {
    if (dataset) {
      const pairs = getDatasetQaPairs(dataset.id);
      setQaPairs(pairs);
    }
  }, [dataset]);

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
    <div className="h-full flex flex-col overflow-hidden">
      {/* 头部区域 */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm">
              <BookOpen size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{dataset.name}</h2>
              <p className="text-sm text-gray-500">{dataset.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 数据集概览信息 */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-50">
              <Database size={16} className="text-blue-600" />
            </div>
            <div className="ml-2">
              <div className="text-xs text-gray-500">问答数量</div>
              <div className="font-medium">{dataset.pairsCount}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-50">
              <Users size={16} className="text-green-600" />
            </div>
            <div className="ml-2">
              <div className="text-xs text-gray-500">绑定助手</div>
              <div className="font-medium">
                {dataset.linkedAssistants?.length || 0}个
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-purple-50">
              <Calendar size={16} className="text-purple-600" />
            </div>
            <div className="ml-2">
              <div className="text-xs text-gray-500">更新时间</div>
              <div className="font-medium">{formatDate(dataset.updatedAt).substring(0, 10)}</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-3 mt-4">
          <button
            onClick={onCreatePair}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-1" />
            添加问答
          </button>
          <button
            onClick={onSplitQa}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MessageSquare size={16} className="mr-1" />
            拆分问答
          </button>
          <button
            onClick={onLinkAssistant}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {dataset.linkedAssistants && dataset.linkedAssistants.length > 0 ? (
              <>
                <Unlink size={16} className="mr-1" />
                管理绑定
              </>
            ) : (
              <>
                <Link size={16} className="mr-1" />
                绑定助手
              </>
            )}
          </button>
        </div>

        {/* 标签切换栏 */}
        <div className="flex border-b border-gray-200 mt-6">
          <button
            className={`py-2 px-4 border-b-2 text-sm font-medium ${
              activeTab === '问答内容'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('问答内容')}
          >
            问答内容
          </button>
          <button
            className={`py-2 px-4 border-b-2 text-sm font-medium ${
              activeTab === '绑定助手'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('绑定助手')}
          >
            绑定助手
          </button>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === '问答内容' && (
          <>
            {qaPairs.length > 0 ? (
              <QaPairsList
                qaPairs={qaPairs}
                onEdit={onEditPair}
                onDelete={onDeletePair}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <FileText size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">当前数据集暂无问答对</p>
                <button
                  onClick={onCreatePair}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-1.5" />
                  添加问答对
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === '绑定助手' && (
          <div className="space-y-6">
            {dataset.linkedAssistants && dataset.linkedAssistants.length > 0 ? (
              <>
                <h3 className="text-lg font-medium text-gray-900">已绑定的助手</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataset.linkedAssistants.map(assistant => (
                    <div
                      key={assistant.id}
                      className="border rounded-lg p-4 flex items-center bg-white shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                        {assistant.avatar ? (
                          <img
                            src={assistant.avatar}
                            alt={assistant.name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <Users size={20} className="text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{assistant.name}</h4>
                        <p className="text-sm text-gray-500">已绑定数据集</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Users size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">当前数据集未绑定任何助手</p>
                <button
                  onClick={onLinkAssistant}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Link size={16} className="mr-1.5" />
                  绑定助手
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetDetailPanel;
