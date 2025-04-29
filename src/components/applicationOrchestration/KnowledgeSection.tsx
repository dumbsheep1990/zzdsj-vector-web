import React from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';

interface ToggleStates {
  knowledgeBase: boolean;
  documentParsing: boolean;
  webSearch: boolean;
  examples: boolean;
}

interface KnowledgeSectionProps {
  expanded: boolean;
  onToggleSection: () => void;
  toggleStates: ToggleStates;
  onToggleFeature: (key: keyof ToggleStates) => void;
}

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({
  expanded,
  onToggleSection,
  toggleStates,
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
        <BookOpen size={16} style={{ marginRight: '8px', color: '#64748b' }} />
        <span>知识</span>
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
          <div style={toggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>知识库</span>
              <div style={countBadgeStyle}>0/5</div>
            </div>
            <label style={toggleStyle}>
              <input 
                type="checkbox" 
                style={toggleInputStyle} 
                checked={toggleStates.knowledgeBase}
                onChange={() => onToggleFeature('knowledgeBase')}
              />
              <span style={toggleSliderStyle(toggleStates.knowledgeBase)}></span>
              <span style={sliderButtonStyle(toggleStates.knowledgeBase)}></span>
            </label>
          </div>
          
          <div style={toggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>文件解析</span>
              <div style={countBadgeStyle}></div>
            </div>
            <label style={toggleStyle}>
              <input 
                type="checkbox" 
                style={toggleInputStyle} 
                checked={toggleStates.documentParsing}
                onChange={() => onToggleFeature('documentParsing')}
              />
              <span style={toggleSliderStyle(toggleStates.documentParsing)}></span>
              <span style={sliderButtonStyle(toggleStates.documentParsing)}></span>
            </label>
          </div>
          
          <div style={toggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>联网搜索</span>
              <div style={countBadgeStyle}></div>
            </div>
            <label style={toggleStyle}>
              <input 
                type="checkbox" 
                style={toggleInputStyle} 
                checked={toggleStates.webSearch}
                onChange={() => onToggleFeature('webSearch')}
              />
              <span style={toggleSliderStyle(toggleStates.webSearch)}></span>
              <span style={sliderButtonStyle(toggleStates.webSearch)}></span>
            </label>
          </div>
          
          <div style={toggleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>样例库</span>
              <div style={countBadgeStyle}></div>
            </div>
            <label style={toggleStyle}>
              <input 
                type="checkbox" 
                style={toggleInputStyle} 
                checked={toggleStates.examples}
                onChange={() => onToggleFeature('examples')}
              />
              <span style={toggleSliderStyle(toggleStates.examples)}></span>
              <span style={sliderButtonStyle(toggleStates.examples)}></span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeSection; 