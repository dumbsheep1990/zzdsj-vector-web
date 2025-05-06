import React from 'react';
import { Typography, Tag, Space, Button, Switch } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';

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

  if (!open) return null;

  // 自定义抽屉样式
  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 247, 250, 0.95) 100%)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    boxShadow: '-5px 0 25px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    transition: 'transform 0.3s ease',
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    overflow: 'hidden',
    border: 'none',
    borderLeft: '1px solid rgba(255, 255, 255, 0.4)'
  };

  // 自定义遮罩层样式
  const maskStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 999,
    transition: 'opacity 0.3s ease',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none'
  };

  // 自定义标题区样式
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 16px',
    borderBottom: 'none'
  };

  // 自定义内容区样式
  const bodyStyle: React.CSSProperties = {
    flex: 1,
    padding: '0 24px 24px',
    overflowY: 'auto'
  };

  // 自定义卡片样式
  const cardStyle: React.CSSProperties = {
    borderRadius: 10,
    marginBottom: 16,
    border: '1px solid rgba(255, 255, 255, 0.6)',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
  };

  // 自定义卡片内容样式
  const cardBodyStyle: React.CSSProperties = {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  // 阻止事件冒泡
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* 自定义遮罩层 */}
      <div 
        style={maskStyle} 
        onClick={onClose}
      />
      
      {/* 自定义抽屉容器 */}
      <div style={drawerStyle} onClick={stopPropagation}>
        {/* 抽屉标题区 */}
        <div style={headerStyle}>
          <span style={{ fontWeight: 600, fontSize: 18 }}>MCP 服务管理</span>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
            style={{ marginRight: -8 }}
          />
        </div>
        
        {/* 抽屉内容区 */}
        <div style={bodyStyle}>
          <Space direction="vertical" style={{ width: '100%' }} size={0}>
            {data.map(service => (
              <div key={service.id} style={cardStyle}>
                <div style={cardBodyStyle}>
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
                </div>
              </div>
            ))}
          </Space>
        </div>
      </div>
    </>
  );
};

export default MCPServiceDrawer;