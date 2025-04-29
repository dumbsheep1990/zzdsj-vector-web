import React from 'react';
import { ChevronDown, Plug, Server } from 'lucide-react';

interface SectionStates {
  skills: boolean;
  mcp: boolean;
  plugins: boolean;
}

interface SkillsSectionProps {
  expandedSections: SectionStates;
  onToggleSection: (section: keyof SectionStates) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  expandedSections,
  onToggleSection
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

  const collapsibleSectionStyle: React.CSSProperties = {
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '12px',
  };

  const collapsibleHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    cursor: 'pointer',
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

  return (
    <div style={sectionStyle}>
      <div 
        style={{ ...sectionHeaderStyle, marginBottom: expandedSections.skills ? '12px' : 0 }}
        onClick={() => onToggleSection('skills')}
      >
        <Plug size={16} style={{ marginRight: '8px', color: '#64748b' }} />
        <span>技能</span>
        <ChevronDown 
          size={16} 
          style={{ 
            color: '#64748b',
            transform: expandedSections.skills ? 'rotate(180deg)' : 'rotate(0)', 
            transition: 'transform 0.3s',
            marginLeft: 'auto'
          }} 
        />
      </div>
      
      {expandedSections.skills && (
        <>
          {/* MCP Services */}
          <div style={collapsibleSectionStyle}>
            <div 
              style={collapsibleHeaderStyle}
              onClick={() => onToggleSection('mcp')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Server size={14} style={{ marginRight: '8px', color: '#64748b' }} />
                <span style={{ fontSize: '14px', color: '#64748b' }}>MCP服务</span>
                <div style={countBadgeStyle}>0/5</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#3b82f6',
                  backgroundColor: '#eff6ff',
                  borderRadius: '4px',
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  border: 'none',
                }}>MCP</button>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    marginLeft: '8px', 
                    color: '#64748b',
                    transform: expandedSections.mcp ? 'rotate(180deg)' : 'rotate(0)', 
                    transition: 'transform 0.3s' 
                  }} 
                />
              </div>
            </div>
            {expandedSections.mcp && (
              <div style={{ padding: '0 0 12px 24px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>未添加MCP</div>
              </div>
            )}
          </div>
          
          {/* Plugins */}
          <div style={collapsibleSectionStyle}>
            <div 
              style={collapsibleHeaderStyle}
              onClick={() => onToggleSection('plugins')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Plug size={14} style={{ marginRight: '8px', color: '#64748b' }} />
                <span style={{ fontSize: '14px', color: '#64748b' }}>插件</span>
                <div style={countBadgeStyle}>0/20</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#3b82f6',
                  backgroundColor: '#eff6ff',
                  borderRadius: '4px',
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  border: 'none',
                }}>插件</button>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    marginLeft: '8px', 
                    color: '#64748b',
                    transform: expandedSections.plugins ? 'rotate(180deg)' : 'rotate(0)', 
                    transition: 'transform 0.3s' 
                  }} 
                />
              </div>
            </div>
            {expandedSections.plugins && (
              <div style={{ padding: '0 0 12px 24px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>未添加插件</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SkillsSection; 