import React from 'react';
import { ChevronDown, Info, Image, Mic, Trash2, Plus } from 'lucide-react';

interface Variable {
  id: string;
  name: string;
  description: string;
  defaultValue: string;
}

interface ToggleStates {
  imageSupport: boolean;
  voiceSupport: boolean;
}

interface VariablesSectionProps {
  expanded: boolean;
  onToggleSection: () => void;
  customVariables: Variable[];
  toggleStates: ToggleStates;
  onAddVariable: () => void;
  onUpdateVariable: (id: string, field: 'name' | 'description' | 'defaultValue', value: string) => void;
  onDeleteVariable: (id: string) => void;
  onToggleFeature: (key: keyof ToggleStates) => void;
}

const VariablesSection: React.FC<VariablesSectionProps> = ({
  expanded, 
  onToggleSection, 
  customVariables, 
  toggleStates, 
  onAddVariable, 
  onUpdateVariable, 
  onDeleteVariable,
  onToggleFeature
}) => {
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

  const variableRowStyle: React.CSSProperties = {
    display: 'flex',
    padding: '8px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    marginBottom: '8px',
    alignItems: 'center',
    border: '1px solid #e5e7eb',
    gap: '8px'
  };

  const inlineInputStyle: React.CSSProperties = {
    border: '1px solid #e2e8f0', 
    borderRadius: '4px',
    padding: '6px 8px',
    fontSize: '14px',
    flex: 1,
    backgroundColor: 'white',
    color: '#64748b',
    outline: 'none'
  };
  
  const countBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    borderRadius: '10px',
    marginLeft: '8px',
  };

  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '20px',
  };

  const toggleInputStyle: React.CSSProperties = {
    opacity: 0,
    width: 0,
    height: 0,
  };

  const toggleSliderStyle = (isChecked: boolean): React.CSSProperties => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isChecked ? '#3b82f6' : '#cbd5e1',
    transition: '0.4s',
    borderRadius: '10px',
  });

  const sliderButtonStyle = (isChecked: boolean): React.CSSProperties => ({
    position: 'absolute',
    content: '',
    height: '16px',
    width: '16px',
    left: isChecked ? '20px' : '4px',
    bottom: '2px',
    backgroundColor: 'white',
    transition: '0.4s',
    borderRadius: '50%',
  });

  return (
    <div style={sectionStyle}>
      <div 
        style={{ ...sectionHeaderStyle, marginBottom: expanded ? '12px' : 0 }}
        onClick={onToggleSection}
      >
        <Info size={16} style={{ marginRight: '8px', color: '#64748b' }} />
        <span>变量</span>
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
        <>
          {/* Display editable variables */}
          <div style={{ marginBottom: '12px' }}>
            {customVariables.map((variable) => (
              <div key={variable.id} style={variableRowStyle}>
                <input
                  type="text"
                  style={{ ...inlineInputStyle, flex: 1 }}
                  value={variable.name}
                  onChange={(e) => onUpdateVariable(variable.id, 'name', e.target.value)}
                  placeholder="变量名"
                />
                <input
                  type="text"
                  style={{ ...inlineInputStyle, flex: 2 }}
                  value={variable.description}
                  onChange={(e) => onUpdateVariable(variable.id, 'description', e.target.value)}
                  placeholder="描述"
                />
                <input
                  type="text"
                  style={{ ...inlineInputStyle, flex: 1 }}
                  value={variable.defaultValue}
                  onChange={(e) => onUpdateVariable(variable.id, 'defaultValue', e.target.value)}
                  placeholder="默认值"
                />
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '4px',
                    color: '#ef4444',
                  }}
                  onClick={() => onDeleteVariable(variable.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Button to add a new variable row directly */}
          <div style={{ marginBottom: '12px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px dashed #94a3b8',
                color: '#3b82f6',
                backgroundColor: '#f1f5f9',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                width: '100%',
                justifyContent: 'center'
              }}
              onClick={onAddVariable}
            >
              <Plus size={16} style={{ marginRight: '4px' }} />
              自定义变量
            </button>
          </div>
          
          {/* Image Support Toggle */}
          <div style={toggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image size={16} style={{ marginRight: '8px', color: '#64748b' }} />
              <span style={{ fontSize: '14px', color: '#64748b' }}>图片支持</span>
              <div style={countBadgeStyle}></div>
            </div>
            <label style={toggleStyle}>
              <input 
                type="checkbox" 
                style={toggleInputStyle} 
                checked={toggleStates.imageSupport}
                onChange={() => onToggleFeature('imageSupport')}
              />
              <span style={toggleSliderStyle(toggleStates.imageSupport)}></span>
              <span style={sliderButtonStyle(toggleStates.imageSupport)}></span>
            </label>
          </div>
          
          {/* Voice Support Toggle */}
          <div style={toggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Mic size={16} style={{ marginRight: '8px', color: '#64748b' }} />
              <span style={{ fontSize: '14px', color: '#64748b' }}>语音支持</span>
              <div style={countBadgeStyle}></div>
            </div>
            <label style={toggleStyle}>
              <input 
                type="checkbox" 
                style={toggleInputStyle} 
                checked={toggleStates.voiceSupport}
                onChange={() => onToggleFeature('voiceSupport')}
              />
              <span style={toggleSliderStyle(toggleStates.voiceSupport)}></span>
              <span style={sliderButtonStyle(toggleStates.voiceSupport)}></span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default VariablesSection; 