import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ApplicationConfig, NodeData } from '../types';
import NodeToolbar from './NodeToolbar';

interface ApplicationNodeProps {
  data: NodeData;
  selected: boolean;
}

const ApplicationNode: React.FC<ApplicationNodeProps> = ({ data, selected }) => {
  const appConfig = data.config as ApplicationConfig | undefined;
  
  return (
    <div className={`application-node ${selected ? 'selected' : ''}`}>
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
        <div className="node-icon">{appConfig?.icon || 'C'}</div>
      </div>
      
      <div className="node-type">{data.type}</div>
      
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      
      {/* 显示功能列表 */}
      {appConfig?.features && appConfig.features.length > 0 && (
        <div className="node-features">
          <div className="section-title">功能列表</div>
          <div className="features-list">
            {appConfig.features.map((feature, index) => (
              <div key={index} className="feature-item">
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 显示集成方式 */}
      {appConfig?.integrations && appConfig.integrations.length > 0 && (
        <div className="node-integrations">
          <div className="section-title">集成方式</div>
          <div className="integrations-list">
            {appConfig.integrations.map((integration, index) => (
              <span key={index} className="integration-tag">
                {integration}
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

export default ApplicationNode; 