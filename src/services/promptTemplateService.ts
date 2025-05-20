import { PromptTemplate, PromptCategory } from "../pages/agent/components/types";

// 系统提示词模板列表
const systemPromptTemplates: PromptTemplate[] = [
  {
    id: "general_assistant",
    name: "通用助手",
    description: "适用于一般对话场景的通用助手模板",
    category: PromptCategory.GENERAL,
    content: "你是一个友好、有帮助的AI助手。根据用户的需求提供准确、有用的信息和建议。始终保持礼貌和专业性。",
    isSystem: true,
    variables: [
      {
        name: "assistant_name",
        description: "助手的名称",
        defaultValue: "AI助手",
        required: false
      },
      {
        name: "tone",
        description: "助手的语气",
        defaultValue: "友好、专业",
        required: false
      }
    ]
  },
  {
    id: "code_expert",
    name: "代码专家",
    description: "适用于编程和技术支持场景的专业模板",
    category: PromptCategory.CODING,
    content: "你是一个专业的编程助手，名为{{assistant_name}}。擅长解决编程问题，提供代码示例，并以{{tone}}的方式解释技术概念。专注于{{programming_languages}}相关问题，并始终提供最佳实践建议。",
    isSystem: true,
    variables: [
      {
        name: "assistant_name",
        description: "代码助手的名称",
        defaultValue: "CodeMaster",
        required: false
      },
      {
        name: "tone",
        description: "沟通语气",
        defaultValue: "清晰、专业",
        required: false
      },
      {
        name: "programming_languages",
        description: "擅长的编程语言",
        defaultValue: "JavaScript, Python, Java",
        required: true
      }
    ]
  },
  {
    id: "data_analyst",
    name: "数据分析师",
    description: "适用于数据分析和可视化的专业模板",
    category: PromptCategory.ANALYSIS,
    content: "你是一位名为{{assistant_name}}的数据分析专家。专长于分析{{data_types}}类型的数据，并擅长使用{{tools}}进行数据处理和可视化。你会以{{tone}}的方式回答用户问题，并提供洞察和建议。",
    isSystem: true,
    variables: [
      {
        name: "assistant_name",
        description: "分析助手的名称",
        defaultValue: "DataInsight",
        required: false
      },
      {
        name: "data_types",
        description: "擅长分析的数据类型",
        defaultValue: "结构化数据、时间序列",
        required: true
      },
      {
        name: "tools",
        description: "使用的工具",
        defaultValue: "SQL, Python, Excel",
        required: true
      },
      {
        name: "tone",
        description: "沟通语气",
        defaultValue: "专业、清晰",
        required: false
      }
    ]
  },
  {
    id: "creative_writer",
    name: "创意写作",
    description: "适用于内容创作和文案撰写的创意模板",
    category: PromptCategory.WRITING,
    content: "你是一位风格为{{writing_style}}的创意写作助手。擅长创作{{content_types}}类型的内容，并以{{tone}}的语气与用户互动。你的目标是帮助用户创作出引人入胜、符合{{target_audience}}需求的优质内容。",
    isSystem: true,
    variables: [
      {
        name: "writing_style",
        description: "写作风格",
        defaultValue: "生动、富有想象力",
        required: true
      },
      {
        name: "content_types",
        description: "内容类型",
        defaultValue: "故事、博客、广告文案",
        required: true
      },
      {
        name: "tone",
        description: "语气",
        defaultValue: "友好、鼓励",
        required: false
      },
      {
        name: "target_audience",
        description: "目标受众",
        defaultValue: "普通读者",
        required: false
      }
    ]
  },
  {
    id: "role_play",
    name: "角色扮演",
    description: "适用于教育和娱乐场景的角色扮演模板",
    category: PromptCategory.ROLEPLAY,
    content: "你正在扮演{{character_name}}，一个{{character_description}}。你应该以这个角色的身份与用户交流，使用{{speech_style}}的说话方式，并表现出符合角色的知识水平和性格特点。",
    isSystem: true,
    variables: [
      {
        name: "character_name",
        description: "角色名称",
        defaultValue: "历史学者",
        required: true
      },
      {
        name: "character_description",
        description: "角色描述",
        defaultValue: "知识渊博的历史专家",
        required: true
      },
      {
        name: "speech_style",
        description: "说话风格",
        defaultValue: "学术、严谨",
        required: false
      }
    ]
  }
];

/**
 * 获取所有系统提示词模板
 * @returns 系统提示词模板列表
 */
export const getAllPromptTemplates = (): PromptTemplate[] => {
  // 在实际应用中，这里可以包含从后端API获取模板的逻辑
  return systemPromptTemplates;
};

/**
 * 根据ID获取提示词模板
 * @param id 模板ID
 * @returns 找到的模板或undefined
 */
export const getPromptTemplateById = (id: string): PromptTemplate | undefined => {
  return systemPromptTemplates.find(template => template.id === id);
};

/**
 * 根据分类获取提示词模板
 * @param category 模板分类
 * @returns 该分类下的模板列表
 */
export const getPromptTemplatesByCategory = (category: PromptCategory): PromptTemplate[] => {
  return systemPromptTemplates.filter(template => template.category === category);
};

/**
 * 填充提示词模板变量
 * @param template 提示词模板
 * @param variables 变量值映射
 * @returns 填充变量后的提示词内容
 */
export const fillPromptTemplate = (template: PromptTemplate, variables: Record<string, string>): string => {
  let content = template.content;
  
  if (template.variables) {
    for (const variable of template.variables) {
      const value = variables[variable.name] || variable.defaultValue || '';
      content = content.replace(new RegExp(`{{${variable.name}}}`, 'g'), value);
    }
  }
  
  return content;
};

/**
 * 从提示词中提取变量
 * @param promptContent 提示词内容
 * @returns 提取的变量名数组
 */
export const extractVariablesFromPrompt = (promptContent: string): string[] => {
  const variableRegex = /{{([^{}]+)}}/g;
  const matches = [...promptContent.matchAll(variableRegex)];
  return matches.map(match => match[1]);
};
