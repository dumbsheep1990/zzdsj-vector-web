import { NavItem } from "../types";

// 导航菜单数据
export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: '统计看板',
    iconType: 'BarChart2'
  },
  {
    id: 'qa-assistant',
    label: '问答助手',
    iconType: 'HelpCircle',
    children: [
      {
        id: 'assistant-list',
        label: '助手列表',
        iconType: 'Users'
      },
      {
        id: 'qa-management',
        label: '问答管理',
        iconType: 'MessageCircle'
      }
    ]
  },
  {
    id: 'files',
    label: '知识库管理',
    iconType: 'BookOpen',
    children: [
      {
        id: 'knowledge-base',
        label: '知识库',
        iconType: 'Library'
      },
      {
        id: 'datasets',
        label: '数据集',
        iconType: 'Database'
      },
      {
        id: 'vectors',
        label: '向量化管理',
        iconType: 'Layers'
      },
      {
        id: 'metadata',
        label: '元数据管理',
        iconType: 'Database'
      }
    ]
  },
  {
    id: 'models',
    label: '模型管理',
    iconType: 'Code',
    children: [
      {
        id: 'model-services',
        label: '模型服务',
        iconType: 'Database'
      },
      {
        id: 'model-config',
        label: '模型配置',
        iconType: 'Settings'
      },
      {
        id: 'config-export',
        label: '配置导出',
        iconType: 'FileText'
      }
    ]
  },
  {
    id: 'tool-plaza',
    label: '工具广场',
    iconType: 'Wrench',
    children: [
      {
        id: 'data-processing-tools',
        label: '数据处理',
        iconType: 'BarChart2'
      },
      {
        id: 'data-integration',
        label: '数据集成',
        iconType: 'Layers'
      },
      {
        id: 'ocr-recognition',
        label: 'OCR识别',
        iconType: 'Search'
      },
      {
        id: 'format-conversion',
        label: '格式转换',
        iconType: 'FileType'
      }
    ]
  },
  {
    id: 'settings',
    label: '系统设置',
    iconType: 'Settings'
  }
];
