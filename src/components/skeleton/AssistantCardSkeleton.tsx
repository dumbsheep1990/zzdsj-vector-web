import React from 'react';
import { Card } from 'antd';
import './SkeletonStyles.css';

interface AssistantCardSkeletonProps {
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
 * 助手卡片的骨架屏组件
 */
const AssistantCardSkeleton: React.FC<AssistantCardSkeletonProps> = ({
  width = '100%',
  height = 280,
  className = '',
}) => {
  return (
    <Card
      className={`skeleton-glass skeleton-gradient-border skeleton-with-shadow ${className}`}
      bordered={false}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* 头部区域 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '70%' }}>
          <div 
            className="skeleton-pulse skeleton-circle" 
            style={{ width: '42px', height: '42px', flexShrink: 0 }}
          />
          <div style={{ marginLeft: '12px', flex: 1 }}>
            <div 
              className="skeleton-pulse" 
              style={{ width: '80%', height: '20px', marginBottom: '8px' }}
            />
            <div 
              className="skeleton-pulse" 
              style={{ width: '60%', height: '14px' }}
            />
          </div>
        </div>
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ width: '60px', height: '26px' }}
        />
      </div>

      {/* 描述区域 */}
      <div style={{ marginBottom: '24px', flex: '1' }}>
        <div 
          className="skeleton-pulse" 
          style={{ width: '100%', height: '14px', marginBottom: '8px' }}
        />
        <div 
          className="skeleton-pulse" 
          style={{ width: '90%', height: '14px', marginBottom: '8px' }}
        />
        <div 
          className="skeleton-pulse" 
          style={{ width: '70%', height: '14px' }}
        />
      </div>

      {/* 标签区域 */}
      <div style={{ display: 'flex', marginBottom: '24px' }}>
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ width: '80px', height: '22px', marginRight: '8px' }}
        />
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ width: '80px', height: '22px' }}
        />
      </div>

      {/* 底部操作区域 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '16px', paddingBottom: '8px' }}>
        <div 
          className="skeleton-pulse skeleton-circle" 
          style={{ width: '28px', height: '28px', marginRight: '8px' }}
        />
        <div 
          className="skeleton-pulse skeleton-circle" 
          style={{ width: '28px', height: '28px', marginRight: '8px' }}
        />
        <div 
          className="skeleton-pulse skeleton-circle" 
          style={{ width: '28px', height: '28px' }}
        />
      </div>
    </Card>
  );
};

export default AssistantCardSkeleton;
