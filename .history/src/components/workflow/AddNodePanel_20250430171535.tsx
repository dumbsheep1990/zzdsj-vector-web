import React from 'react';
import { Card, Typography, Button } from 'antd';
import { Panel } from '@xyflow/react';

interface AddNodePanelProps {
  onOpenAgentModal: () => void;
  onOpenToolModal: () => void;
  onAddCustomNode: (type: string) => void;
}

const AddNodePanel: React.FC<AddNodePanelProps> = ({
  onOpenAgentModal,
  onOpenToolModal,
  onAddCustomNode
}) => {
  return (
    <Panel position="top-right">
      <Card style={{ width: 200 }}>
        <Typography.Title level={5}>添加节点</Typography.Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button type="primary" onClick={onOpenAgentModal}>
            选择智能体
          </Button>
          <Button type="primary" onClick={onOpenToolModal}>
            选择工具
          </Button>
          <Button onClick={() => onAddCustomNode('application')}>
            添加自定义应用
          </Button>
        </div>
      </Card>
    </Panel>
  );
};

export default AddNodePanel; 