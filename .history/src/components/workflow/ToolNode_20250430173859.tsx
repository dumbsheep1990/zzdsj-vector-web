import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ToolConfig, NodeData } from '../../pages/workflow/types';
import NodeToolbar from './NodeToolbar';

interface ToolNodeProps {
  data: NodeData;
  selected: boolean;
}

const ToolNode: React.FC<ToolNodeProps> = ({ data, selected }) => {
  const toolConfig = data.config as ToolConfig | undefined;
  
  return (
    <div className={`tool-node ${selected ? 'selected' : ''}`}>
      {selected && data.showToolbar && data.nodeId && (
        <NodeToolbar 
          nodeId={data.nodeId}
          onEdit={(id) => window.editNode && window.editNode(id)}
          onDelete={(id) => window.deleteNode && window.deleteNode(id)}
          onDuplicate={(id) => window.duplicateNode && window.duplicateNode(id)}
          onConnect={(id) => window.connectNode && window.connectNode(id)}
        />
      )}
      
      <div className="node-header">
        <div>{data.label}</div>
        <div className="node-icon">{toolConfig?.icon || 'T'}</div>
      </div>
      
      <div className="node-type">{data.type}</div>
      
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      
      {/* 显示参数信息 */}
      {toolConfig?.parameters && toolConfig.parameters.length > 0 && (
        <div className="node-parameters">
          <div className="section-title">参数</div>
          <div className="parameters-list">
            {toolConfig.parameters.map((param) => (
              <div key={param.name} className="parameter-item">
                <span className="parameter-name">{param.name}</span>
                <span className="parameter-type">{param.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 显示功能示例 */}
      {toolConfig?.usage_examples && toolConfig.usage_examples.length > 0 && (
        <div className="node-examples">
          <div className="section-title">使用示例</div>
          <div className="examples-list">
            {toolConfig.usage_examples.map((example, index) => (
              <div key={index} className="example-item">
                {example}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle-left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle-right"
      />
    </div>
  );
};

export default ToolNode; 