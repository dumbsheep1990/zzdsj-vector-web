import React from 'react';
import { Row, Col } from 'antd';
import './SkeletonStyles.css';

/**
 * 问答管理页面的骨架屏组件
 */
const QAManagementSkeleton: React.FC = () => {
  // 生成助手列表骨架项
  const renderAssistantItems = () => {
    return Array(8).fill(0).map((_, index) => (
      <div 
        key={index} 
        className="skeleton-glass skeleton-gradient-border"
        style={{ 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '10px',
          height: '74px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="skeleton-pulse" style={{ width: '60%', height: '18px' }} />
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '36px', height: '20px' }} />
        </div>
        <div className="skeleton-pulse" style={{ width: '80%', height: '14px', marginBottom: '6px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton-pulse" style={{ width: '30%', height: '12px' }} />
          <div className="skeleton-pulse" style={{ width: '30%', height: '12px' }} />
        </div>
      </div>
    ));
  };

  // 生成问题列表骨架项
  const renderQuestionItems = () => {
    return Array(6).fill(0).map((_, index) => (
      <div 
        key={index} 
        className="skeleton-glass skeleton-gradient-border"
        style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '12px',
          height: '90px'
        }}
      >
        <div className="skeleton-pulse" style={{ width: '80%', height: '18px', marginBottom: '10px' }} />
        <div className="skeleton-pulse" style={{ width: '90%', height: '14px', marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '50px', height: '20px' }} />
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '60px', height: '20px' }} />
        </div>
      </div>
    ));
  };

  return (
    <div className="qa-management-skeleton" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* 主体内容区域 */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        backgroundColor: '#ffffff', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        {/* 左侧助手列表 */}
        <div style={{ 
          width: '240px', 
          borderRight: '1px solid #f0f0f0', 
          padding: '16px', 
          height: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div className="skeleton-pulse" style={{ width: '80%', height: '32px' }} />
          </div>
          <div style={{ overflow: 'auto', height: 'calc(100% - 48px)' }}>
            {renderAssistantItems()}
          </div>
        </div>

        {/* 中间问题列表 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* 操作区域 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '16px 24px', 
            borderBottom: '1px solid #f0f0f0' 
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="skeleton-pulse skeleton-rounded" style={{ width: '100px', height: '36px' }} />
              <div className="skeleton-pulse skeleton-rounded" style={{ width: '100px', height: '36px', opacity: 0.6 }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="skeleton-pulse skeleton-rounded" style={{ width: '200px', height: '36px' }} />
              <div className="skeleton-pulse skeleton-rounded" style={{ width: '120px', height: '36px' }} />
            </div>
          </div>

          {/* 问题列表 */}
          <div style={{ padding: '24px', overflow: 'auto', flex: 1 }}>
            {renderQuestionItems()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAManagementSkeleton;
