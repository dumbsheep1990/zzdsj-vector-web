import React from 'react';
import { Row, Col } from 'antd';
import PromptTemplateCardSkeleton from './PromptTemplateCardSkeleton';
import './SkeletonStyles.css';

interface PromptTemplateListSkeletonProps {
  /**
   * 显示的卡片数量
   */
  count?: number;
}

/**
 * 提示词模板列表的骨架屏组件
 */
const PromptTemplateListSkeleton: React.FC<PromptTemplateListSkeletonProps> = ({
  count = 6
}) => {
  return (
    <div className="prompt-template-list-skeleton">
      {/* 顶部筛选区域 */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '100px', height: '32px' }} />
          <div className="skeleton-pulse skeleton-rounded" style={{ width: '100px', height: '32px', opacity: 0.7 }} />
        </div>
        <div className="skeleton-pulse skeleton-rounded" style={{ width: '160px', height: '32px' }} />
      </div>

      {/* 卡片网格 */}
      <Row gutter={[16, 16]}>
        {Array(count).fill(0).map((_, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <PromptTemplateCardSkeleton 
              className={`skeleton-glass skeleton-gradient-border`}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PromptTemplateListSkeleton;
