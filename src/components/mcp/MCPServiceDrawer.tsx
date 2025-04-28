import React from 'react';
import { Drawer, Card, Switch, Typography, Tag, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface MCPServiceDrawerProps {
  open: boolean;
  onClose: () => void;
  services?: {
    id: string;
    name: string;
    status: boolean;
    subServices: { id: string; status: boolean }[];
  }[];
}

const { Text } = Typography;

const defaultServices = [
  {
    id: 'amap',
    name: 'Amap Maps',
    status: true,
    subServices: [
      { id: 'maps_regeocode', status: true },
      { id: 'maps_geo', status: true },
      { id: 'maps_ip_location', status: true },
      { id: 'maps_weather', status: true },
      { id: 'maps_search_detail', status: true },
      { id: 'maps_bicycling', status: true },
      { id: 'maps_direction_walking', status: true },
      { id: 'maps_direction_driving', status: true },
      { id: 'maps_direction_transit_integrated', status: true },
      { id: 'maps_distance', status: true },
      { id: 'maps_text_search', status: true },
      { id: 'maps_around_search', status: true },
    ],
  },
  {
    id: 'everart',
    name: 'EverArt',
    status: true,
    subServices: [
      { id: 'everart_gen', status: true },
      { id: 'everart_style', status: true },
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    status: false,
    subServices: [
      { id: 'notion_content', status: false },
    ],
  },
];

const MCPServiceDrawer: React.FC<MCPServiceDrawerProps> = ({ open, onClose, services }) => {
  // 主服务开关（如需实现可用时再补充参数）
  const handleServiceStatusChange = () => {};
  const data = services || defaultServices;

  return (
    <Drawer
      title={<span style={{ fontWeight: 600, fontSize: 18 }}>MCP 服务管理</span>}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      bodyStyle={{ background: '#f7f8fa', padding: 20 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        {data.map(service => (
          <Card
            key={service.id}
            style={{ borderRadius: 10, boxShadow: 'none', marginBottom: 0, border: '1px solid #f0f0f0', padding: 0 }}
            bodyStyle={{ padding: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <Text style={{ fontWeight: 500 }}>{service.name}</Text>
              <Tag color={service.status ? 'success' : 'error'} icon={service.status ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                {service.status ? '运行中' : '已停止'}
              </Tag>
              <span style={{ fontSize: 13, color: '#888' }}>
                {service.subServices.filter(s => s.status).length}/{service.subServices.length} 启用
              </span>
            </div>
            <div style={{ marginLeft: 16 }}>
              <Switch
                checked={service.status}
                onChange={handleServiceStatusChange}
              />
            </div>
          </Card>
        ))}
      </Space>
    </Drawer>
  );
};

export default MCPServiceDrawer; 