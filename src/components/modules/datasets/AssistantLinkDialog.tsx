import React, { FC, useState, useEffect } from 'react';
import { X, Check, Users, Search } from 'lucide-react';
import { QaDataset, AssistantItem } from '../../../utils/types';
import { mockAssistants } from '../../../utils/mockQaData';

interface AssistantLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkedAssistants: AssistantItem[]) => void;
  dataset: QaDataset;
}

const AssistantLinkDialog: FC<AssistantLinkDialogProps> = ({ isOpen, onClose, onSave, dataset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssistants, setSelectedAssistants] = useState<AssistantItem[]>([]);
  const [availableAssistants, setAvailableAssistants] = useState<AssistantItem[]>([]);

  // 初始化选中的助手
  useEffect(() => {
    if (dataset.linkedAssistants) {
      setSelectedAssistants([...dataset.linkedAssistants]);
    } else {
      setSelectedAssistants([]);
    }
    
    // 获取可用的助手列表
    setAvailableAssistants(mockAssistants);
  }, [dataset, isOpen]);

  // 过滤助手列表
  const filteredAssistants = availableAssistants.filter(assistant => 
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 检查助手是否已选中
  const isAssistantSelected = (assistantId: string) => {
    return selectedAssistants.some(a => a.id === assistantId);
  };

  // 选择或取消选择助手
  const toggleAssistant = (assistant: AssistantItem) => {
    if (isAssistantSelected(assistant.id)) {
      setSelectedAssistants(selectedAssistants.filter(a => a.id !== assistant.id));
    } else {
      setSelectedAssistants([...selectedAssistants, assistant]);
    }
  };

  // 保存更改
  const handleSave = () => {
    onSave(selectedAssistants);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">绑定助手</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="搜索助手..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selectedAssistants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">已选择的助手</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedAssistants.map(assistant => (
                  <div 
                    key={assistant.id}
                    className="flex items-center p-3 rounded-md border border-blue-200 bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      {assistant.avatar ? (
                        <img src={assistant.avatar} alt={assistant.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <Users size={16} className="text-blue-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800 flex-1">{assistant.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleAssistant(assistant)}
                      className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 className="text-sm font-medium text-gray-700 mb-3">可用助手</h3>
          {filteredAssistants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredAssistants.map(assistant => (
                <div 
                  key={assistant.id}
                  className={`flex items-center p-3 rounded-md border ${
                    isAssistantSelected(assistant.id) 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                  } cursor-pointer transition-colors`}
                  onClick={() => toggleAssistant(assistant)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    {assistant.avatar ? (
                      <img src={assistant.avatar} alt={assistant.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <Users size={16} className="text-gray-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800 flex-1">{assistant.name}</span>
                  {isAssistantSelected(assistant.id) && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">未找到匹配的助手</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <Check size={16} className="mr-1.5" />
            保存绑定
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantLinkDialog;
