import React from 'react';
import { Row, Col } from 'antd';
import { StatCardSkeleton } from './index';
import { CardSkeleton } from './index';
import './SkeletonStyles.css';

/**
 * Dashboard页面的骨架屏组件
 * 完全匹配Dashboard页面的布局结构
 */
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="dashboard-skeleton" style={{ padding: '16px' }}>
      {/* 页面标题骨架屏 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <div 
            className="skeleton-pulse skeleton-rounded" 
            style={{ width: '42px', height: '42px', marginRight: '12px' }}
          />
          <div className="skeleton-pulse" style={{ width: '200px', height: '28px' }} />
        </div>
        <div className="skeleton-pulse" style={{ width: '50%', height: '16px', marginTop: '8px' }} />
      </div>

      {/* 统计卡片区域 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div 
            className="skeleton-pulse skeleton-rounded" 
            style={{ width: '32px', height: '32px', marginRight: '12px' }}
          />
          <div className="skeleton-pulse" style={{ width: '100px', height: '20px' }} />
        </div>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <StatCardSkeleton 
              subCardCount={2}
              subCardDirection="row"
              height={200}
            />
          </Col>
          <Col span={12}>
            <StatCardSkeleton 
              subCardCount={2}
              subCardDirection="row"
              height={200}
            />
          </Col>
        </Row>
      </div>

      {/* 最佳实践区域 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div 
            className="skeleton-pulse skeleton-rounded" 
            style={{ width: '32px', height: '32px', marginRight: '12px' }}
          />
          <div className="skeleton-pulse" style={{ width: '100px', height: '20px' }} />
        </div>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <CardSkeleton 
              hasHeader
              hasIcon
              hasContent
              contentLines={3}
              height={180}
            />
          </Col>
          <Col span={12}>
            <CardSkeleton 
              hasHeader
              hasIcon
              hasContent
              contentLines={3}
              height={180}
            />
          </Col>
        </Row>
      </div>

      {/* 文档卡片区域 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              className="skeleton-pulse skeleton-rounded" 
              style={{ width: '32px', height: '32px', marginRight: '12px' }}
            />
            <div className="skeleton-pulse" style={{ width: '100px', height: '20px' }} />
          </div>
          
          <div className="skeleton-pulse" style={{ width: '80px', height: '20px' }} />
        </div>
        
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((_, index) => (
            <Col span={6} key={index}>
              <CardSkeleton 
                hasHeader
                hasIcon
                hasContent
                contentLines={1}
                height={120}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
