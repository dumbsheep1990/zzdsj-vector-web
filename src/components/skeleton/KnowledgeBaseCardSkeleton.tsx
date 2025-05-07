import React from 'react';
import './SkeletonStyles.css';

interface KnowledgeBaseCardSkeletonProps {
  /**
   * 卡片宽度
   */
  width?: string | number;
  /**
   * 卡片高度
   */
  height?: string | number;
  /**
   * 额外的CSS类名
   */
  className?: string;
}

/**
 * 知识库卡片骨架屏组件
 */
const KnowledgeBaseCardSkeleton: React.FC<KnowledgeBaseCardSkeletonProps> = ({
  width = '100%',
  height = 220,
  className = '',
}) => {
  return (
    <div 
      className={`skeleton-glass rounded-lg ${className}`} 
      style={{ 
        width, 
        height,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        position: 'relative'
      }}
    >
      {/* 标题区域 */}
      <div className="skeleton-pulse" style={{ width: '70%', height: '24px', marginBottom: '8px' }} />
      
      {/* 描述区域 */}
      <div className="skeleton-pulse" style={{ width: '90%', height: '16px', marginBottom: '4px' }} />
      <div className="skeleton-pulse" style={{ width: '80%', height: '16px', marginBottom: '16px' }} />
      
      {/* 进度条 */}
      <div style={{ marginBottom: '16px' }}>
        <div className="skeleton-pulse" style={{ width: '100%', height: '6px', borderRadius: '3px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <div className="skeleton-pulse" style={{ width: '30%', height: '14px' }} />
          <div className="skeleton-pulse" style={{ width: '20%', height: '14px' }} />
        </div>
      </div>
      
      {/* 统计信息 */}
      <div style={{ display: 'flex', marginBottom: '16px', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '16px', height: '16px' }} />
          <div className="skeleton-pulse" style={{ width: '30px', height: '16px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '16px', height: '16px' }} />
          <div className="skeleton-pulse" style={{ width: '30px', height: '16px' }} />
        </div>
      </div>
      
      {/* 标签区域 */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <div className="skeleton-pulse skeleton-rounded" style={{ width: '60px', height: '24px' }} />
        <div className="skeleton-pulse skeleton-rounded" style={{ width: '70px', height: '24px' }} />
        <div className="skeleton-pulse skeleton-rounded" style={{ width: '50px', height: '24px' }} />
      </div>
      
      {/* 设置按钮 */}
      <div 
        className="skeleton-pulse skeleton-rounded" 
        style={{ 
          width: '24px', 
          height: '24px', 
          position: 'absolute',
          top: '16px',
          right: '16px'
        }} 
      />
    </div>
  );
};

export default KnowledgeBaseCardSkeleton;
