import React, { useState } from 'react';
import { ChevronDown, Settings, FileText, Info, BookOpen, Server, Plug, Image, Mic, Trash2, Plus } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';

const ApplicationOrchestrationPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'api': true,
    'prompt': true,
    'variables': true,
    'knowledge': true,
    'skills': true,
    'mcp': false,
    'plugins': false
  });
  
  // Toggle states for switches
  const [toggleStates, setToggleStates] = useState({
    imageSupport: false,
    voiceSupport: false,
    knowledgeBase: false,
    documentParsing: false,
    webSearch: false,
    examples: false
  });

  // Custom variable state with editable variables
  const [customVariables, setCustomVariables] = useState<Array<{
    id: string;
    name: string;
    description: string;
    defaultValue: string;
  }>>([]);

  // Function to add a new empty variable directly
  const addNewVariable = () => {
    const newVariable = {
      id: `var_${Date.now()}`,
      name: '',
      description: '',
      defaultValue: ''
    };
    
    setCustomVariables([...customVariables, newVariable]);
  };

  // Function to update a variable field
  const updateVariable = (id: string, field: 'name' | 'description' | 'defaultValue', value: string) => {
    setCustomVariables(prevVariables => 
      prevVariables.map(variable => 
        variable.id === id ? { ...variable, [field]: value } : variable
      )
    );
  };

  // Function to delete a variable with direct approach
  const deleteVariable = (idToDelete: string) => {
    setCustomVariables(variables => variables.filter(variable => variable.id !== idToDelete));
  };

  // Keep only the styles that are actually used
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: 'calc(100vh - 56px)',
    width: '100%',
    backgroundColor: '#f8fafc',
  };

  const leftPanelStyle: React.CSSProperties = {
    flex: '2.5',
    borderRight: '1px solid #e5e7eb',
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: 'white',
  };

  const rightPanelStyle: React.CSSProperties = {
    flex: '1.5',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f1f5f9',
  };

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

  const chatAreaStyle: React.CSSProperties = {
    flexGrow: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '16px',
    backgroundColor: 'white',
    padding: '12px',
    overflowY: 'auto',
  };

  const inputAreaStyle: React.CSSProperties = {
    display: 'flex',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
  };

  const inputStyle: React.CSSProperties = {
    flexGrow: 1,
    border: 'none',
    padding: '12px',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
  };

  const sendButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '4px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
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

  // Editable variable styles
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

  const handleToggle = (key: keyof typeof toggleStates) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      <PageHeader title="应用编排" />
      <div style={containerStyle}>
        {/* Left Panel: Configuration */}
        <div style={leftPanelStyle}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#1e293b' }}>
            智能体应用-配置
          </h1>

          {/* API Configuration Section */}
          <div style={sectionStyle}>
            <div 
              style={{ ...sectionHeaderStyle, marginBottom: expandedSections.api ? '12px' : 0 }}
              onClick={() => toggleSection('api')}
            >
              <Settings size={16} style={{ marginRight: '8px', color: '#64748b' }} />
              <span>模型配置</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  color: '#64748b',
                  transform: expandedSections.api ? 'rotate(180deg)' : 'rotate(0)', 
                  transition: 'transform 0.3s',
                  marginLeft: 'auto'
                }} 
              />
            </div>
            
            {expandedSections.api && (
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

          {/* Instructions/Prompt Section */}
          <div style={sectionStyle}>
            <div 
              style={{ ...sectionHeaderStyle, marginBottom: expandedSections.prompt ? '12px' : 0 }}
              onClick={() => toggleSection('prompt')}
            >
              <FileText size={16} style={{ marginRight: '8px', color: '#64748b' }} />
              <span>指令</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  color: '#64748b',
                  transform: expandedSections.prompt ? 'rotate(180deg)' : 'rotate(0)', 
                  transition: 'transform 0.3s',
                  marginLeft: 'auto'
                }} 
              />
            </div>
            
            {expandedSections.prompt && (
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
          
          {/* Variables Configuration Section */}
          <div style={sectionStyle}>
            <div 
              style={{ ...sectionHeaderStyle, marginBottom: expandedSections.variables ? '12px' : 0 }}
              onClick={() => toggleSection('variables')}
            >
              <Info size={16} style={{ marginRight: '8px', color: '#64748b' }} />
              <span>变量</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  color: '#64748b',
                  transform: expandedSections.variables ? 'rotate(180deg)' : 'rotate(0)', 
                  transition: 'transform 0.3s',
                  marginLeft: 'auto' 
                }} 
              />
            </div>
            
            {expandedSections.variables && (
              <>
                {/* Display editable variables */}
                <div style={{ marginBottom: '12px' }}>
                  {customVariables.map((variable) => (
                    <div key={variable.id} style={variableRowStyle}>
                      <input
                        type="text"
                        style={{ ...inlineInputStyle, flex: 1 }}
                        value={variable.name}
                        onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                        placeholder="变量名"
                      />
                      <input
                        type="text"
                        style={{ ...inlineInputStyle, flex: 2 }}
                        value={variable.description}
                        onChange={(e) => updateVariable(variable.id, 'description', e.target.value)}
                        placeholder="描述"
                      />
                      <input
                        type="text"
                        style={{ ...inlineInputStyle, flex: 1 }}
                        value={variable.defaultValue}
                        onChange={(e) => updateVariable(variable.id, 'defaultValue', e.target.value)}
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
                        onClick={() => deleteVariable(variable.id)}
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
                    onClick={addNewVariable}
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
                      onChange={() => handleToggle('imageSupport')}
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
                      onChange={() => handleToggle('voiceSupport')}
                    />
                    <span style={toggleSliderStyle(toggleStates.voiceSupport)}></span>
                    <span style={sliderButtonStyle(toggleStates.voiceSupport)}></span>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Knowledge Base Section */}
          <div style={sectionStyle}>
            <div 
              style={{ ...sectionHeaderStyle, marginBottom: expandedSections.knowledge ? '12px' : 0 }}
              onClick={() => toggleSection('knowledge')}
            >
              <BookOpen size={16} style={{ marginRight: '8px', color: '#64748b' }} />
              <span>知识</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  color: '#64748b',
                  transform: expandedSections.knowledge ? 'rotate(180deg)' : 'rotate(0)', 
                  transition: 'transform 0.3s',
                  marginLeft: 'auto'
                }} 
              />
            </div>
            
            {expandedSections.knowledge && (
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
                      onChange={() => handleToggle('knowledgeBase')}
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
                      onChange={() => handleToggle('documentParsing')}
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
                      onChange={() => handleToggle('webSearch')}
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
                      onChange={() => handleToggle('examples')}
                    />
                    <span style={toggleSliderStyle(toggleStates.examples)}></span>
                    <span style={sliderButtonStyle(toggleStates.examples)}></span>
                  </label>
                </div>
              </>
            )}
          </div>
          
          {/* Skills/Tools Configuration Section */}
          <div style={sectionStyle}>
            <div 
              style={{ ...sectionHeaderStyle, marginBottom: expandedSections.skills ? '12px' : 0 }}
              onClick={() => toggleSection('skills')}
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
                    onClick={() => toggleSection('mcp')}
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
                    onClick={() => toggleSection('plugins')}
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
        </div>

        {/* Right Panel: Testing/Chat */}
        <div style={rightPanelStyle}>
           <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
             文本对话测试
           </h2>
          <div style={chatAreaStyle}>
            {/* Chat messages will appear here */}
             <p style={{color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px'}}>对话历史</p>
          </div>
          <div style={inputAreaStyle}>
            <input
              type="text"
              placeholder="请输入您想问的问题"
              style={inputStyle}
            />
            <button style={sendButtonStyle}>发送</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationOrchestrationPage; 