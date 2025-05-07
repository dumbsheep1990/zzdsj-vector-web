import React, { FC, useState } from 'react';
import { X, Upload, AlertTriangle, Check, Loader } from 'lucide-react';
import { QaPair } from '../../../utils/types';

interface QaSplitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (qaPairs: Partial<QaPair>[]) => void;
  datasetId: string;
}

// 模拟自动拆分逻辑
const mockSplitQa = async (text: string): Promise<Partial<QaPair>[]> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 简单的模拟拆分逻辑，实际应用中应该使用NLP或AI服务来拆分
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const qaPairs: Partial<QaPair>[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // 简单判断是否是问题（以问号结尾）
    if (line.endsWith('?') || line.endsWith('？')) {
      const answer = i + 1 < lines.length ? lines[i + 1] : '暂无回答';
      qaPairs.push({
        question: line,
        answer,
        sourceType: 'auto',
        tags: ['自动拆分']
      });
      i++; // 跳过已使用的回答行
    }
  }
  
  return qaPairs;
};

const QaSplitDialog: FC<QaSplitDialogProps> = ({ isOpen, onClose, onSave, datasetId }) => {
  const [inputText, setInputText] = useState('');
  const [splitResults, setSplitResults] = useState<Partial<QaPair>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = async () => {
    if (!inputText.trim()) {
      setError('请输入问答文本内容');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const results = await mockSplitQa(inputText);
      setSplitResults(results);
    } catch (err) {
      setError('拆分问答失败，请重试');
      console.error('Split QA error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (splitResults.length === 0) {
      setError('没有可保存的问答对');
      return;
    }
    
    onSave(splitResults);
  };

  const handleReset = () => {
    setInputText('');
    setSplitResults([]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">自动拆分问答对</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
              <p className="text-sm text-blue-800">
                输入包含问答内容的文本，系统将自动拆分为多个问答对。为获得最佳效果，建议问题和回答各占一行，每个问题以问号结尾。
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-md p-4 mb-4 flex items-start">
                <AlertTriangle size={18} className="text-red-500 mr-2 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
                  输入文本内容
                </label>
                <textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={15}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                  placeholder="请输入需要拆分的问答文本内容..."
                  disabled={isProcessing}
                />
                
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={handleSplit}
                    disabled={isProcessing || !inputText.trim()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader size={16} className="mr-1.5 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-1.5" />
                        拆分问答
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isProcessing || (!inputText && splitResults.length === 0)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    重置
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    拆分结果 {splitResults.length > 0 && `(${splitResults.length}个问答对)`}
                  </label>
                  {splitResults.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSave}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      全部保存
                    </button>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-md h-[400px] overflow-y-auto bg-gray-50">
                  {isProcessing ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader size={24} className="text-blue-500 animate-spin mr-2" />
                      <span className="text-gray-600">正在拆分问答内容...</span>
                    </div>
                  ) : splitResults.length > 0 ? (
                    <div className="p-3 space-y-3">
                      {splitResults.map((pair, index) => (
                        <div key={index} className="border border-gray-200 rounded-md bg-white p-3">
                          <div className="font-medium text-gray-800 mb-2">问题 {index + 1}：{pair.question}</div>
                          <div className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
                            {pair.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      {inputText.trim() ? '点击"拆分问答"按钮开始处理' : '请先输入文本内容'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            关闭
          </button>
          {splitResults.length > 0 && (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
            >
              <Check size={16} className="mr-1.5" />
              保存全部问答对
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QaSplitDialog;
