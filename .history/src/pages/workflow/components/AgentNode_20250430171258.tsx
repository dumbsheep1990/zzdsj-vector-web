import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { AgentConfig, NodeData } from '../types';
import NodeToolbar from './NodeToolbar';

interface AgentNodeProps {
  data: NodeData;
  selected: boolean;
}

const AgentNode: React.FC<AgentNodeProps> = ({ data, selected }) => {
  const agentConfig = data.config as AgentConfig | undefined;
  
  return (
    <div className={`agent-node ${selected ? 'selected' : ''}`}>
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
        <div className="node-icon">{agentConfig?.icon || 'A'}</div>
      </div>
      
      <div className="node-type">
        {data.type}
        {agentConfig?.model && (
          <span className="node-model"> • {agentConfig.model}</span>
        )}
      </div>
      
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      
      {/* 显示步骤信息 */}
      {agentConfig?.steps && agentConfig.steps.length > 0 && (
        <div className="node-steps">
          <div className="section-title">流程步骤</div>
          <div className="steps-list">
            {agentConfig.steps.map((step, index) => (
              <div key={step.id} className={`step-item ${step.type}`}>
                <span className="step-number">{index + 1}</span>
                <span className="step-name">{step.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 显示工具信息 */}
      {agentConfig?.tools && agentConfig.tools.length > 0 && (
        <div className="node-tools">
          <div className="section-title">使用工具</div>
          <div className="tools-list">
            {agentConfig.tools.map(tool => (
              <span key={tool.id} className="node-tool-tag">
                {tool.name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* 显示能力信息 */}
      {agentConfig?.capabilities && agentConfig.capabilities.length > 0 && (
        <div className="node-capabilities">
          <div className="section-title">能力</div>
          <div className="capabilities-list">
            {agentConfig.capabilities.map((capability, index) => (
              <span key={index} className="capability-tag">
                {capability}
              </span>
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

export default AgentNode; 