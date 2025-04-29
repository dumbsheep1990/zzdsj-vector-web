import React from 'react';
import { ChevronDown, FileText } from 'lucide-react';

interface InstructionsSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ expanded, onToggle }) => {
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

  const toggleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #f1f5f9',
  };

  return (
    <div style={sectionStyle}>
      <div 
        style={{ ...sectionHeaderStyle, marginBottom: expanded ? '12px' : 0 }}
        onClick={onToggle}
      >
        <FileText size={16} style={{ marginRight: '8px', color: '#64748b' }} />
        <span>指令</span>
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
        <div style={{ marginBottom: '16px' }}>
          <div style={toggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>提示词</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button style={{ marginRight: '8px', fontSize: '13px', color: '#64748b', border: 'none', background: 'none', padding: '4px 6px', borderRadius: '4px', cursor: 'pointer' }}>
                复制
              </button>
              <button style={{ fontSize: '13px', color: '#64748b', border: 'none', background: 'none', padding: '4px 6px', borderRadius: '4px', cursor: 'pointer' }}>
                优化
              </button>
            </div>
          </div>
          
          <textarea 
            style={{
              width: '100%', 
              minHeight: '100px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '4px', 
              padding: '8px', 
              fontSize: '14px',
              color: '#64748b',
              resize: 'vertical'
            }}
            placeholder="在这里编辑系统提示词，包括角色设定、任务目标、具备的能力及回复的要求与限制等。好的提示词会直接影响智能体效果。"
          />
          <div style={{marginTop: '8px', color: '#94a3b8', fontSize: '12px'}}>
            提示词中变量的选项来自于下方"变量配置"，如需新增请在下方操作
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsSection; 