import React from 'react';
import { Drawer, List, Switch, Typography, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface MCPServiceDrawerProps {
  open: boolean;
  onClose: () => void;
}

const { Text } = Typography;

const MCPServiceDrawer: React.FC<MCPServiceDrawerProps> = ({ open, onClose }) => {
  // 模拟服务数据，实际应该从后端获取
  const services = [
    {
      id: 'amap',
      name: 'Amap Maps',
      status: true,
      type: '地图服务'
    },
    {
      id: 'everart',
      name: 'EverArt',
      status: true,
      type: '内容生成'
    },
    {
      id: 'notion',
      name: 'Notion',
      status: false,
      type: '内容生成'
    },
    // ... 其他服务
  ];

  const handleStatusChange = (checked: boolean, serviceId: string) => {
    console.log('Service status changed:', serviceId, checked);
    // TODO: 调用后端 API 更新服务状态
  };

  return (
    <Drawer
      title="MCP 服务管理"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      <List
        dataSource={services}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              <Switch
                key="switch"
                checked={item.status}
                onChange={(checked) => handleStatusChange(checked, item.id)}
              />
            ]}
          >
            <List.Item.Meta
              title={
                <div className="flex items-center gap-2">
                  <Text>{item.name}</Text>
                  {item.status ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>运行中</Tag>
                  ) : (
                    <Tag color="error" icon={<CloseCircleOutlined />}>已停止</Tag>
                  )}
                </div>
              }
              description={
                <Tag color="default">{item.type}</Tag>
              }
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default MCPServiceDrawer; 