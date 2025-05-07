import React from 'react';
import { Card, Row, Col } from 'antd';
import './SkeletonStyles.css';

interface GraphCardSkeletonProps {
  /**
   * 卡片宽度
   */
  width?: number | string;
  /**
   * 卡片高度
   */
  height?: number | string;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 图谱数据库卡片的骨架屏组件
 */
const GraphCardSkeleton: React.FC<GraphCardSkeletonProps> = ({
  width = '100%',
  height = 'auto',
  className = '',
}) => {
  return (
    <Card
      hoverable
      className={`skeleton-glass skeleton-gradient-border skeleton-with-shadow ${className}`}
      bordered={false}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
      }}
      bodyStyle={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%' 
      }}
    >
      {/* 标题和描述区域 */}
      <div style={{ marginBottom: '20px' }}>
        <div 
          className="skeleton-pulse" 
          style={{ width: '70%', height: '22px', marginBottom: '12px', borderRadius: '6px' }}
        />
        <div 
          className="skeleton-pulse" 
          style={{ width: '100%', height: '14px', marginBottom: '6px', borderRadius: '4px' }}
        />
        <div 
          className="skeleton-pulse" 
          style={{ width: '90%', height: '14px', borderRadius: '4px' }}
        />
      </div>

      {/* 统计数据区域 */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <div 
            className="skeleton-pulse" 
            style={{ width: '60%', height: '16px', marginBottom: '8px', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              className="skeleton-pulse" 
              style={{ width: '50%', height: '24px', borderRadius: '6px' }}
            />
            <div 
              className="skeleton-pulse" 
              style={{ width: '20%', height: '16px', marginLeft: '4px', borderRadius: '4px' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <div 
            className="skeleton-pulse" 
            style={{ width: '60%', height: '16px', marginBottom: '8px', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              className="skeleton-pulse" 
              style={{ width: '50%', height: '24px', borderRadius: '6px' }}
            />
            <div 
              className="skeleton-pulse" 
              style={{ width: '20%', height: '16px', marginLeft: '4px', borderRadius: '4px' }}
            />
          </div>
        </Col>
      </Row>

      {/* 更新日期区域 */}
      <div 
        className="skeleton-pulse" 
        style={{ width: '40%', height: '14px', borderRadius: '4px', marginBottom: '16px' }}
      />

      {/* 操作按钮区域 */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ width: '45%', height: '32px', borderRadius: '6px' }}
        />
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ width: '45%', height: '32px', borderRadius: '6px' }}
        />
      </div>
    </Card>
  );
};

export default GraphCardSkeleton;
