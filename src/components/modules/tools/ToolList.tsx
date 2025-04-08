import React from 'react';
import { Row, Col } from 'antd';
import ToolCard from './ToolCard';
import type { Tool as DataProcessingTool } from '../../../utils/mockToolsData';

interface ToolListProps {
  tools: DataProcessingTool[];
  onFavorite: (id: string) => void;
}

const ToolList: React.FC<ToolListProps> = ({ tools, onFavorite }) => {
  return (
    <Row gutter={[16, 16]}>
      {tools.map(tool => (
        <Col key={tool.id} xs={24} sm={12} md={8} lg={6}>
          <ToolCard tool={tool} onFavorite={onFavorite} />
        </Col>
      ))}
    </Row>
  );
};

export default ToolList; 