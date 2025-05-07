import React from 'react';
import './SkeletonStyles.css';

interface PromptTemplateCardSkeletonProps {
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
 * 提示词模板卡片的骨架屏组件
 */
const PromptTemplateCardSkeleton: React.FC<PromptTemplateCardSkeletonProps> = ({
  width = '100%',
  height = 240,
  className = '',
}) => {
  return (
    <div 
      className={`skeleton-glass ${className}`} 
      style={{ 
        width, 
        height, 
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* 顶部渐变色条 */}
      <div
        className="skeleton-gradient-border"
        style={{
          height: '4px',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      />

      <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 标签区域 */}
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '50px', height: '20px', marginRight: '8px' }} />
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '70px', height: '20px' }} />
        </div>

        {/* 标题区域 */}
        <div className="skeleton-pulse" style={{ width: '80%', height: '24px', marginBottom: '12px' }} />

        {/* 内容区域 - 3行文本 */}
        <div className="skeleton-pulse" style={{ width: '95%', height: '16px', marginBottom: '8px' }} />
        <div className="skeleton-pulse" style={{ width: '90%', height: '16px', marginBottom: '8px' }} />
        <div className="skeleton-pulse" style={{ width: '85%', height: '16px', marginBottom: '8px' }} />
        <div className="skeleton-pulse" style={{ width: '75%', height: '16px', marginBottom: '8px' }} />

        {/* 底部空间填充 */}
        <div style={{ flexGrow: 1 }} />

        {/* 底部信息和操作区域 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div className="skeleton-pulse" style={{ width: '100px', height: '16px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton-pulse skeleton-rounded" style={{ width: '24px', height: '24px' }} />
            <div className="skeleton-pulse skeleton-rounded" style={{ width: '24px', height: '24px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptTemplateCardSkeleton;
