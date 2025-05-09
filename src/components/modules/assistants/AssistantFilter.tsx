import React from 'react';
import { Menu, Dropdown, Button, Input } from 'antd';
import { DownOutlined, FilterOutlined, SortAscendingOutlined, SearchOutlined } from '@ant-design/icons';

interface AssistantFilterProps {
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  setSortOrder: (order: 'newest' | 'oldest' | 'alphabetical') => void;
  onSearch?: (searchText: string) => void;
}

const AssistantFilter: React.FC<AssistantFilterProps> = ({
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
  onSearch
}) => {
  const filterMenu = (
    <Menu 
      selectedKeys={filterStatus ? [filterStatus] : ['all']}
      onClick={({key}) => setFilterStatus(key === 'all' ? null : key)}
    >
      <Menu.Item key="all">全部</Menu.Item>
      <Menu.Item key="online">在线</Menu.Item>
      <Menu.Item key="offline">离线</Menu.Item>
    </Menu>
  );

  const sortMenu = (
    <Menu 
      selectedKeys={[sortOrder]}
      onClick={({key}) => setSortOrder(key as 'newest' | 'oldest' | 'alphabetical')}
    >
      <Menu.Item key="newest">最新创建</Menu.Item>
      <Menu.Item key="oldest">最早创建</Menu.Item>
      <Menu.Item key="alphabetical">名称排序</Menu.Item>
    </Menu>
  );

  // 处理搜索功能
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 搜索框 */}
      <Input.Search 
        placeholder="搜索助手名称" 
        allowClear 
        style={{ width: 200 }} 
        onChange={handleSearch}
        className="mr-2"
      />
      
      {/* 状态筛选 */}
      <Dropdown overlay={filterMenu} trigger={['click']}>
        <Button>
          <FilterOutlined /> 状态 <DownOutlined />
        </Button>
      </Dropdown>
      
      {/* 排序选项 */}
      <Dropdown overlay={sortMenu} trigger={['click']}>
        <Button>
          <SortAscendingOutlined /> 排序 <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default AssistantFilter;
