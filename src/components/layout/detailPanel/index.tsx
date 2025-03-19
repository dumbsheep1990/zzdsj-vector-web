import React, { useState, useEffect } from 'react';
import { DetailPanelProps } from './types';
import DetailPanelHeader from './DetailPanelHeader';
import BasicInfoTab from './BasicInfoTab';
import KeywordGraphTab from './KeywordGraphTab';
import UsageRecordTab from './UsageRecordTab';
import PageSpecificContent from './PageSpecificContent';

const DetailPanel: React.FC<DetailPanelProps> = ({ 
  selectedItem, 
  setSelectedItem, 
  activeSection,
  title,
  onClose,
  className,
  children 
}) => {
  const [activeTab, setActiveTab] = useState('基本信息');

  // 当activeSection变化时重置activeTab
  useEffect(() => {
    setActiveTab('基本信息');
  }, [activeSection]);

  // Handle clearing the selected item safely
  const handleClearSelection = () => {
    if (setSelectedItem) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Component */}
      <DetailPanelHeader 
        selectedItem={selectedItem}
        onClose={handleClearSelection}
        activeSection={activeSection}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5">
        {activeTab === '基本信息' && (
          <BasicInfoTab selectedItem={selectedItem} />
        )}

        {activeTab === '关键词图谱' && (
          <KeywordGraphTab selectedItem={selectedItem} />
        )}

        {activeTab === '使用记录' && (
          <UsageRecordTab selectedItem={selectedItem} />
        )}

        {(activeSection !== 'files' || 
          (activeSection === 'files' && 
           activeTab !== '基本信息' && 
           activeTab !== '关键词图谱' && 
           activeTab !== '使用记录')
        ) && (
          <PageSpecificContent 
            activeSection={activeSection || ''} 
            activeTab={activeTab} 
            selectedItem={selectedItem} 
          />
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
