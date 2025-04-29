import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import {
  ModelConfigSection,
  InstructionsSection,
  VariablesSection,
  KnowledgeSection,
  SkillsSection,
  ChatTestingPanel
} from '../../components/applicationOrchestration';

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
          <ModelConfigSection 
            expanded={expandedSections.api} 
            onToggle={() => toggleSection('api')} 
          />

          {/* Instructions/Prompt Section */}
          <InstructionsSection 
            expanded={expandedSections.prompt} 
            onToggle={() => toggleSection('prompt')} 
          />
          
          {/* Variables Configuration Section */}
          <VariablesSection 
            expanded={expandedSections.variables}
            onToggleSection={() => toggleSection('variables')}
            customVariables={customVariables}
            toggleStates={{ imageSupport: toggleStates.imageSupport, voiceSupport: toggleStates.voiceSupport }}
            onAddVariable={addNewVariable}
            onUpdateVariable={updateVariable}
            onDeleteVariable={deleteVariable}
            onToggleFeature={handleToggle}
          />

          {/* Knowledge Base Section */}
          <KnowledgeSection 
            expanded={expandedSections.knowledge}
            onToggleSection={() => toggleSection('knowledge')}
            toggleStates={{ 
              knowledgeBase: toggleStates.knowledgeBase, 
              documentParsing: toggleStates.documentParsing,
              webSearch: toggleStates.webSearch,
              examples: toggleStates.examples
            }}
            onToggleFeature={handleToggle}
          />
          
          {/* Skills/Tools Configuration Section */}
          <SkillsSection 
            expandedSections={{ 
              skills: expandedSections.skills, 
              mcp: expandedSections.mcp, 
              plugins: expandedSections.plugins 
            }}
            onToggleSection={(section) => toggleSection(section)}
          />
        </div>

        {/* Right Panel: Testing/Chat */}
        <ChatTestingPanel 
          imageSupport={toggleStates.imageSupport}
          voiceSupport={toggleStates.voiceSupport}
          documentParsing={toggleStates.documentParsing}
          webSearch={toggleStates.webSearch}
        />
      </div>
    </>
  );
};

export default ApplicationOrchestrationPage; 