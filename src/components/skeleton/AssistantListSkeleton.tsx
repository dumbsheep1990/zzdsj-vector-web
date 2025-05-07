import React from 'react';
import { Row, Col } from 'antd';
import { AssistantCardSkeleton } from './index';
import './SkeletonStyles.css';

interface AssistantListSkeletonProps {
  /**
   * 显示的卡片数量
   */
  count?: number;
  /**
   * 每行显示的卡片数量
   */
  columns?: number;
}

/**
 * 助手列表页面的骨架屏组件
 */
const AssistantListSkeleton: React.FC<AssistantListSkeletonProps> = ({
  count = 8,
  columns = 4
}) => {
  // 计算行列数据
  const items = Array(count).fill(0);
  
  // 计算栅格列宽
  const getColSpan = () => {
    switch (columns) {
      case 1: return 24;
      case 2: return 12;
      case 3: return 8;
      case 4: return 6;
      default: return 6;
    }
  };

  return (
    <div className="assistant-list-skeleton" style={{ padding: '24px' }}>
      {/* 过滤器骨架屏 */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '24px',
          paddingTop: '8px',
          paddingBottom: '8px'
        }}
      >
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ width: '120px', height: '32px', marginRight: '12px' }}
        />
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ width: '120px', height: '32px' }}
        />
      </div>

      {/* 助手卡片列表骨架屏 */}
      <Row gutter={[16, 16]}>
        {items.map((_, index) => (
          <Col span={getColSpan()} key={index}>
            <AssistantCardSkeleton />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AssistantListSkeleton;
