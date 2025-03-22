import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';

interface AssistantFilterProps {
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  setSortOrder: (order: 'newest' | 'oldest' | 'alphabetical') => void;
}

const AssistantFilter: React.FC<AssistantFilterProps> = ({
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder
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

  return (
    <div className="flex items-center gap-2">
      <Dropdown overlay={filterMenu} trigger={['click']}>
        <Button>
          <FilterOutlined /> 状态 <DownOutlined />
        </Button>
      </Dropdown>
      <Dropdown overlay={sortMenu} trigger={['click']}>
        <Button>
          <SortAscendingOutlined /> 排序 <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default AssistantFilter;
