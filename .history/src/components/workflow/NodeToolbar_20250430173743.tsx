import React from 'react';
import { Button, Tooltip } from 'antd';
import { EditOutlined, CopyOutlined, NodeIndexOutlined, DeleteOutlined } from '@ant-design/icons';
import { NodeToolbarProps } from '../../pages/workflow/types';

const NodeToolbar: React.FC<NodeToolbarProps> = ({ 
  nodeId, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onConnect 
}) => {
  return (
    <div className="node-toolbar" onClick={(e) => e.stopPropagation()}>
      <Tooltip title="编辑节点">
        <Button 
          size="small" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(nodeId)}
        />
      </Tooltip>
      <Tooltip title="复制节点">
        <Button 
          size="small" 
          icon={<CopyOutlined />} 
          onClick={() => onDuplicate(nodeId)}
        />
      </Tooltip>
      <Tooltip title="连接节点">
        <Button 
          size="small" 
          icon={<NodeIndexOutlined />} 
          onClick={() => onConnect(nodeId)}
        />
      </Tooltip>
      <Tooltip title="删除节点">
        <Button 
          size="small" 
          danger
          icon={<DeleteOutlined />} 
          onClick={() => onDelete(nodeId)}
        />
      </Tooltip>
    </div>
  );
};

export default NodeToolbar; 