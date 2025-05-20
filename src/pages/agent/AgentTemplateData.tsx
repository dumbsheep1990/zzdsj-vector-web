import React from 'react';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import PaletteIcon from '@mui/icons-material/Palette';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// 定义Agent模板类型
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  baseAgentType: string;
  systemPrompt: string;
  suggestedTools: string[];
}

// 创建图标元素
const GeneralIcon = () => <SmartToyIcon />;
const CodeAssistantIcon = () => <CodeIcon />;
const EducationIcon = () => <SchoolIcon />;
const CreativeIcon = () => <PaletteIcon />;
const SupportIcon = () => <SupportAgentIcon />;

// 预定义Agent模板
export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'general',
    name: '通用助手',
    description: '全能型智能助手，适用于各种日常查询和任务',
    icon: <GeneralIcon />,
    baseAgentType: 'assistant',
    systemPrompt: '你是一个友好、有帮助的AI助手。根据用户的需求提供准确、有用的信息和建议。',
    suggestedTools: ['search', 'calculator', 'weather']
  },
  {
    id: 'code',
    name: '代码助手',
    description: '专注于编程和软件开发的智能助手',
    icon: <CodeAssistantIcon />,
    baseAgentType: 'coder',
    systemPrompt: '你是一个专业的编程助手。帮助用户解决代码问题，提供编程建议，并协助完成软件开发任务。',
    suggestedTools: ['code_interpreter', 'github', 'terminal']
  },
  {
    id: 'education',
    name: '学习助手',
    description: '帮助学习和教育指导的智能助手',
    icon: <EducationIcon />,
    baseAgentType: 'tutor',
    systemPrompt: '你是一个有耐心、善于解释的教育助手。帮助用户理解复杂概念，回答学习问题，并提供高质量的教育指导。',
    suggestedTools: ['knowledge_base', 'calculator', 'diagram']
  },
  {
    id: 'creative',
    name: '创意助手',
    description: '专注于创意和内容创作的智能助手',
    icon: <CreativeIcon />,
    baseAgentType: 'creative',
    systemPrompt: '你是一个富有创意和想象力的助手。帮助用户发展创意，提供内容创作建议，并激发灵感。',
    suggestedTools: ['image_generator', 'text_editor', 'brainstorm']
  },
  {
    id: 'support',
    name: '客服助手',
    description: '专注于客户支持和服务的智能助手',
    icon: <SupportIcon />,
    baseAgentType: 'support',
    systemPrompt: '你是一个专业、有礼貌的客户服务助手。帮助解决用户问题，回答咨询，并提供优质的客户服务体验。',
    suggestedTools: ['knowledge_base', 'ticket_system', 'faq']
  }
];
