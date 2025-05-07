import React from 'react';
import { Row, Col } from 'antd';
import GraphCardSkeleton from './GraphCardSkeleton';

interface GraphDatabaseListSkeletonProps {
  /**
   * 显示的骨架卡片数量
   */
  count?: number;
}

/**
 * 图谱数据库列表骨架屏组件
 */
const GraphDatabaseListSkeleton: React.FC<GraphDatabaseListSkeletonProps> = ({ count = 6 }) => {
  return (
    <Row gutter={[16, 16]}>
      {Array(count).fill(0).map((_, index) => (
        <Col key={index} xs={24} sm={12} lg={8}>
          <GraphCardSkeleton 
            className="h-full shadow-hover"
            height={300}
          />
        </Col>
      ))}
    </Row>
  );
};

export default GraphDatabaseListSkeleton;
