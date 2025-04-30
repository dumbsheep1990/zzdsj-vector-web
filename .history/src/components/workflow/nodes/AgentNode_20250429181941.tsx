import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeData } from '../types';

const AgentNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '5px',
      background: selected 
        ? 'linear-gradient(to right, #8a5cf6, #9b66ff)' 
        : 'linear-gradient(to right, #667eea, #764ba2)',
      color: 'white',
      width: '200px',
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: selected 
        ? '0 0 0 2px #8a5cf6, 0 4px 10px rgba(0, 0, 0, 0.3)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'all 0.2s ease'
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.label}</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>{data.type}</div>
      {data.config && 'tools' in data.config && data.config.tools && data.config.tools.length > 0 && (
        <div style={{ marginTop: '8px', fontSize: '10px' }}>
          工具: {data.config.tools.map(tool => tool.name).join(', ')}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: '12px', height: '12px' }}
      />
    </div>
  );
};

export default AgentNode; 