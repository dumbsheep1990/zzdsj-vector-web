import React from 'react';
import { Row, Col } from 'antd';
import KnowledgeBaseCardSkeleton from './KnowledgeBaseCardSkeleton';
import './SkeletonStyles.css';

interface KnowledgeBaseListSkeletonProps {
  /**
   * 显示的卡片数量
   */
  count?: number;
}

/**
 * 知识库列表骨架屏组件
 */
const KnowledgeBaseListSkeleton: React.FC<KnowledgeBaseListSkeletonProps> = ({
  count = 6
}) => {
  return (
    <div className="knowledge-base-list-skeleton">
      {/* 顶部筛选区域 */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '80px', height: '32px' }} />
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '80px', height: '32px', opacity: 0.7 }} />
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '80px', height: '32px', opacity: 0.5 }} />
        </div>
        <div className="skeleton-pulse" style={{ width: '200px', height: '32px' }} />
      </div>

      {/* 卡片网格 */}
      <Row gutter={[16, 16]}>
        {Array(count).fill(0).map((_, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <KnowledgeBaseCardSkeleton 
              className="skeleton-glass skeleton-gradient-border"
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KnowledgeBaseListSkeleton;
