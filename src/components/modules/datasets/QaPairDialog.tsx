import React, { FC, useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { QaPair } from '../../../utils/types';

interface QaPairDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (qaPair: Partial<QaPair>) => void;
  qaPair?: QaPair; // 如果提供则为编辑模式，否则为新建模式
  parentQaPair?: QaPair; // 如果提供则为创建子问题模式
}

const QaPairDialog: FC<QaPairDialogProps> = ({ isOpen, onClose, onSave, qaPair, parentQaPair }) => {
  const [formData, setFormData] = useState<Partial<QaPair>>({
    question: '',
    answer: '',
    tags: [],
    sourceType: 'manual',
    parentId: parentQaPair?.id
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (qaPair) {
      setFormData({
        ...qaPair
      });
    } else if (parentQaPair) {
      setFormData({
        question: '',
        answer: '',
        tags: [...(parentQaPair.tags || [])],
        sourceType: 'manual',
        parentId: parentQaPair.id
      });
    } else {
      setFormData({
        question: '',
        answer: '',
        tags: [],
        sourceType: 'manual'
      });
    }
  }, [qaPair, parentQaPair, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (!formData.question?.trim() || !formData.answer?.trim()) {
      alert('问题和回答不能为空');
      return;
    }
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {qaPair ? '编辑问答对' : parentQaPair ? '添加子问题' : '添加问答对'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {parentQaPair && (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">父问题：</p>
                <p className="text-gray-700">{parentQaPair.question}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                问题
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={formData.question || ''}
                onChange={handleChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="输入问题..."
                required
              />
            </div>

            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                回答
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer || ''}
                onChange={handleChange}
                rows={8}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="输入回答内容..."
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                标签
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-l-md p-2 border"
                  placeholder="添加标签..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </form>
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
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <Save size={16} className="mr-1.5" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default QaPairDialog;
