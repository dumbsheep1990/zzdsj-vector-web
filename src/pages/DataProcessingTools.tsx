import React, { useState } from 'react';
import { Tabs, Input, Button, message } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import ToolList from '../components/modules/tools/ToolList';
import ImportToolModal from '../components/modules/tools/ImportToolModal';
import PageHeader from '../components/layout/PageHeader';
import { tools } from '../utils/mockToolsData';
import type { ToolCategory } from '../utils/mockToolsData';

const { TabPane } = Tabs;
const { Search } = Input;

interface ImportValues {
  name: string;
  category: ToolCategory;
  description: string;
  tags: string[];
}

const DataProcessingTools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 处理收藏工具
  const handleFavorite = (id: string) => {
    // 这里可以添加收藏功能的实现
    console.log('收藏工具:', id);
  };

  // 处理导入工具
  const handleImport = (values: ImportValues) => {
    console.log('导入工具:', values);
    message.success('工具导入成功');
    setIsModalVisible(false);
  };

  // 获取当前分类的工具
  const getCurrentTools = () => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="数据处理工具"
        subTitle="管理和使用各类数据处理工具"
        extra={[
          <Button
            key="import"
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            导入工具
          </Button>
        ]}
      />

      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div className="mb-6">
          <Search
            placeholder="搜索工具..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs
          activeKey={selectedCategory}
          onChange={key => setSelectedCategory(key as ToolCategory)}
          className="flex-1"
        >
          <TabPane tab="全部" key="all">
            <ToolList tools={getCurrentTools()} onFavorite={handleFavorite} />
          </TabPane>
          <TabPane tab="数据爬取" key="crawler">
            <ToolList tools={getCurrentTools()} onFavorite={handleFavorite} />
          </TabPane>
          <TabPane tab="数据清洗" key="cleaner">
            <ToolList tools={getCurrentTools()} onFavorite={handleFavorite} />
          </TabPane>
          <TabPane tab="数据格式化" key="formatter">
            <ToolList tools={getCurrentTools()} onFavorite={handleFavorite} />
          </TabPane>
          <TabPane tab="数据集生成" key="generator">
            <ToolList tools={getCurrentTools()} onFavorite={handleFavorite} />
          </TabPane>
        </Tabs>
      </div>

      <ImportToolModal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleImport}
      />
    </div>
  );
};

export default DataProcessingTools;
