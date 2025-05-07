import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyDatasetsStateProps {
  onCreateNew?: () => void;
}

const EmptyDatasetsState: React.FC<EmptyDatasetsStateProps> = ({ onCreateNew }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
          <BookOpen size={40} className="text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无问答数据集</h3>
        <p className="text-gray-500 mb-8 max-w-md">
          您目前没有任何问答数据集。创建数据集后，您可以添加问答对并将其绑定到助手中。
        </p>
        
        <button 
          onClick={onCreateNew}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
        >
          <Plus size={18} className="mr-1.5" />
          <span>创建数据集</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyDatasetsState;
