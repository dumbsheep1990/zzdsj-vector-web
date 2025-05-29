// 导入图标组件
import { 
  FileTextOutlined, 
  TableOutlined, 
  CodeOutlined,
  BarChartOutlined,
  ApiOutlined,
  TagsOutlined,
  CodeSandboxOutlined, // 替代 JsonOutlined
  FileOutlined
} from '@ant-design/icons';
import { Tool, ToolCategory } from './types';

// 输出格式化工具 - 用于数据格式工厂
export const outputFormattingTools: Tool[] = [
  {
    id: 'data-format-factory',
    name: '数据格式工厂',
    description: '智能格式化输出工具，支持将模型输出转换为多种标准格式',
    category: ToolCategory.INTEGRATION,
    icon: <FileTextOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
    tags: ['格式化', '数据转换', '输出处理', '结构化数据'],
    isAdvanced: true,
    complexity: 'medium',
    provider: 'System',
    version: '1.0.0',
    isEnabled: true,
    config: {
      supportedFormats: ['JSON', 'XML', 'CSV', 'Markdown', 'YAML'],
      enableSchema: true,
      validateOutput: true
    },
    permissions: ['data_transformation']
  },
  {
    id: 'json-formatter',
    name: 'JSON格式化工具',
    description: '将输出内容格式化为标准JSON格式，支持自定义schema和验证',
    category: ToolCategory.INTEGRATION,
    icon: <CodeSandboxOutlined style={{ fontSize: '18px', color: '#722ed1' }} />,
    tags: ['JSON', '格式化', 'Schema验证', '结构化数据'],
    isAdvanced: true,
    complexity: 'medium',
    provider: 'System',
    version: '1.0.0',
    isEnabled: true,
    config: {
      prettyPrint: true,
      validateSchema: true,
      defaultSchema: null
    },
    permissions: ['data_transformation']
  },
  {
    id: 'table-formatter',
    name: '表格数据格式化',
    description: '将数据输出为表格格式，支持CSV、Markdown表格等多种格式',
    category: ToolCategory.INTEGRATION,
    icon: <TableOutlined style={{ fontSize: '18px', color: '#52c41a' }} />,
    tags: ['表格', 'CSV', 'Markdown表格', '数据展示'],
    isAdvanced: true,
    complexity: 'medium',
    provider: 'System',
    version: '1.0.0',
    isEnabled: true,
    config: {
      formats: ['CSV', 'Markdown', 'HTML'],
      includeHeader: true,
      sortable: true
    },
    permissions: ['data_transformation']
  },
  {
    id: 'chart-data-formatter',
    name: '图表数据格式化',
    description: '准备适用于图表绘制的数据格式，支持多种图表类型',
    category: ToolCategory.INTEGRATION,
    icon: <BarChartOutlined style={{ fontSize: '18px', color: '#fa8c16' }} />,
    tags: ['图表', '数据可视化', '格式转换', '统计数据'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'System',
    version: '1.0.0',
    isEnabled: true,
    config: {
      chartTypes: ['bar', 'line', 'pie', 'scatter'],
      dataPreprocessing: true,
      aggregationSupport: true
    },
    permissions: ['data_transformation', 'visualization']
  },
  {
    id: 'api-response-formatter',
    name: 'API响应格式化',
    description: '将模型输出格式化为标准API响应格式，符合RESTful规范',
    category: ToolCategory.INTEGRATION,
    icon: <ApiOutlined style={{ fontSize: '18px', color: '#eb2f96' }} />,
    tags: ['API响应', 'RESTful', '标准格式', '接口规范'],
    isAdvanced: true,
    complexity: 'medium',
    provider: 'System',
    version: '1.0.0',
    isEnabled: true,
    config: {
      responseFormats: ['JSON', 'XML'],
      includeMetadata: true,
      statusCodes: true,
      errorHandling: true
    },
    permissions: ['data_transformation', 'api_generation']
  },
  {
    id: 'structured-output',
    name: '结构化输出工具',
    description: '根据特定schema将自由文本转换为严格的结构化数据',
    category: ToolCategory.INTEGRATION,
    icon: <TagsOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
    tags: ['结构化数据', 'Schema定义', '数据验证', '格式转换'],
    isAdvanced: true,
    complexity: 'high',
    provider: 'System',
    version: '1.0.0',
    isEnabled: true,
    config: {
      schemaDefinition: true,
      validationRules: true,
      dataMapping: true,
      errorCorrection: true
    },
    permissions: ['data_transformation', 'schema_validation']
  },
  {
    id: 'code-formatter',
    name: '代码格式化工具',
    description: '格式化各种编程语言的代码输出，使其符合标准规范',
    category: ToolCategory.DEVELOPMENT,
    icon: <CodeOutlined style={{ fontSize: '18px', color: '#13c2c2' }} />,
    tags: ['代码格式化', '编程语言', '代码美化', '语法高亮'],
    isAdvanced: true,
    complexity: 'medium',
    provider: 'System',
    version: '1.0.0',
    isEnabled: true,
    config: {
      languages: ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'SQL'],
      styleGuides: ['Google', 'Airbnb', 'Standard'],
      lintingSupport: true
    },
    permissions: ['code_processing', 'data_transformation']
  }
];

// 获取默认的数据格式工厂工具
export const getDefaultFormattingTools = (): string[] => {
  return [
    'data-format-factory',
    'json-formatter'
  ];
};
