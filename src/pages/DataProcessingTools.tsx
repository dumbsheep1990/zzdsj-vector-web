import React, { useState } from 'react';
import { Tabs, Input, Button, message, Space } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined,
  ImportOutlined 
} from '@ant-design/icons';
import ToolList from '../components/modules/tools/ToolList';
import ImportToolModal from '../components/modules/tools/ImportToolModal';
import CustomToolModal from '../components/modules/tools/CustomToolModal';
import PageHeader from '../components/layout/PageHeader';
import { tools } from '../utils/mockToolsData';
import type { ToolCategory } from '../utils/mockToolsData';
import type { CustomToolValues } from '../components/modules/tools/CustomToolModal';

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
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);

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
        description="管理和使用各类数据处理工具"
      />

      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Search
            placeholder="搜索工具..."
            allowClear
            enterButton={
              <Button 
                type="primary" 
                style={{
                  background: 'linear-gradient(135deg, #1677ff, #40a9ff)',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
                }}
              >
                <SearchOutlined />
              </Button>
            }
            size="large"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-md"
            style={{ width: '400px' }}
          />
          <Space>
            <Button
              type="primary"
              icon={<ImportOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{
                background: 'linear-gradient(135deg, #1677ff, #40a9ff)',
                border: 'none',
                height: '40px',
                boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
              }}
            >
              导入工具
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCustomModalVisible(true)}
              style={{
                background: 'linear-gradient(135deg, #13c2c2, #36cfc9)',
                border: 'none',
                height: '40px',
                boxShadow: '0 2px 6px rgba(19, 194, 194, 0.2)'
              }}
            >
              自定义工具
            </Button>
          </Space>
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

      <CustomToolModal
        open={isCustomModalVisible}
        onCancel={() => setIsCustomModalVisible(false)}
        onOk={(values: CustomToolValues) => {
          console.log('创建自定义工具:', values);
          message.success('自定义工具创建成功');
          setIsCustomModalVisible(false);
        }}
      />
    </div>
  );
};

export default DataProcessingTools;
