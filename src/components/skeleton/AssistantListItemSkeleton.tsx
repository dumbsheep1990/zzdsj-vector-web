import React from 'react';
import './SkeletonStyles.css';

/**
 * 助手列表项的骨架屏组件
 * 与原始助手卡片样式保持一致
 */
const AssistantListItemSkeleton: React.FC = () => {
  return (
    <div 
      className="skeleton-glass skeleton-gradient-border my-2"
      style={{ 
        padding: '16px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: '140px',
        transition: 'all 0.3s'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* 圆形头像骨架 */}
          <div 
            className="skeleton-pulse skeleton-rounded" 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          />
          {/* 名称骨架 */}
          <div className="skeleton-pulse" style={{ width: '100px', height: '18px' }} />
        </div>
        {/* 状态标签骨架 */}
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ 
            width: '40px', 
            height: '20px',
            borderRadius: '12px' 
          }} 
        />
      </div>
      
      {/* 描述骨架 */}
      <div className="skeleton-pulse" style={{ width: '90%', height: '14px', marginLeft: '40px', marginBottom: '6px' }} />
      <div className="skeleton-pulse" style={{ width: '75%', height: '14px', marginLeft: '40px', marginBottom: '16px' }} />
      
      {/* 问题和文档数量骨架 */}
      <div className="flex items-center gap-4 ml-10">
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ 
            width: '90px', 
            height: '24px',
            borderRadius: '12px' 
          }} 
        />
        <div 
          className="skeleton-pulse skeleton-rounded" 
          style={{ 
            width: '90px', 
            height: '24px',
            borderRadius: '12px' 
          }} 
        />
      </div>
    </div>
  );
};

export default AssistantListItemSkeleton;
