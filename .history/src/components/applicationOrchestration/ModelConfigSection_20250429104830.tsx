import React from 'react';
import { ChevronDown, Settings } from 'lucide-react';

interface ModelConfigSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

const ModelConfigSection: React.FC<ModelConfigSectionProps> = ({ expanded, onToggle }) => {
  // Styles
  const sectionStyle: React.CSSProperties = {
    marginBottom: '16px',
    padding: '0', 
    borderRadius: '8px',
    backgroundColor: 'white',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 600,
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    cursor: 'pointer',
  };

  const modelSelectStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    width: '100%',
    marginBottom: '10px',
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div style={sectionStyle}>
      <div 
        style={{ ...sectionHeaderStyle, marginBottom: expanded ? '12px' : 0 }}
        onClick={onToggle}
      >
        <Settings size={16} style={{ marginRight: '8px', color: '#64748b' }} />
        <span>模型配置</span>
        <ChevronDown 
          size={16} 
          style={{ 
            color: '#64748b',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)', 
            transition: 'transform 0.3s',
            marginLeft: 'auto'
          }} 
        />
      </div>
      
      {expanded && (
        <div style={{ padding: '0 0 16px 0' }}>
          <select style={modelSelectStyle} defaultValue="">
            <option value="" disabled>请选择模型</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="gemini-pro">Gemini Pro</option>
            <option value="qwen-turbo">Qwen Turbo</option>
            <option value="qwen-plus">Qwen Plus</option>
          </select>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ color: '#3b82f6', fontSize: '13px', border: 'none', background: 'none', cursor: 'pointer' }}>
              设置
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelConfigSection; 