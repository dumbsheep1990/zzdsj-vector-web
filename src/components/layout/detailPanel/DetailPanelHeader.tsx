import React from 'react';
import { Share2, Download, X, Tag, Search } from 'lucide-react';

interface DetailPanelHeaderProps {
  title?: string;
  selectedItem: any;
  onClose: () => void;
  activeSection?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DetailPanelHeader: React.FC<DetailPanelHeaderProps> = ({
  selectedItem,
  onClose,
  activeSection,
  activeTab,
  setActiveTab
}) => {
  // 获取标题图标
  const getTitleIcon = () => {
    if (selectedItem && 'keyword' in selectedItem) {
      return <Tag size={18} className="text-indigo-500 mr-2" />;
    } else if (selectedItem && 'query' in selectedItem) {
      return <Search size={18} className="text-indigo-500 mr-2" />;
    } else {
      return null;
    }
  };

  // 获取标题
  const getTitle = () => {
    if (!selectedItem) return '';

    if ('name' in selectedItem) {
      return selectedItem.name;
    } else if ('keyword' in selectedItem) {
      return selectedItem.keyword;
    } else if ('query' in selectedItem) {
      return selectedItem.query;
    } else {
      return '';
    }
  };

  const tabs = activeSection ? ['基本信息', '关键词图谱', '使用记录'] : [];

  return (
    <div className="flex-none bg-white border-b">
      <div className="flex justify-between items-center p-4" style={{ minHeight: '56px' }}>
        <h2 className="flex items-center" style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>
          {getTitleIcon()}
          {getTitle()}
        </h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share2 size={20} className="text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Download size={20} className="text-gray-500" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>
      <div className="flex border-b overflow-x-auto whitespace-nowrap" style={{ minHeight: '40px' }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DetailPanelHeader;
