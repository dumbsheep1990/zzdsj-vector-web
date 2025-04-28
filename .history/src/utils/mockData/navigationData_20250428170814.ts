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
      },
      {
        id: 'qa-factory',
        label: '助手工厂',
        iconType: 'Layers'
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
    id: 'knowledge-graph',
    label: '知识图谱',
    iconType: 'Network',
    children: [
      {
        id: 'graph-database',
        label: '图谱数据库',
        iconType: 'Database'
      },
      {
        id: 'graph-preview',
        label: '图谱数据预览',
        iconType: 'Eye'
      },
      {
        id: 'graph-qa',
        label: '图谱检索问答',
        iconType: 'Search'
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
        label: 'API工具',
        iconType: 'BarChart2'
      },
      {
        id: 'agent-tools',
        label: 'Agent工具',
        iconType: 'Layers'
      },
      {
        id: 'mcp-center',
        label: 'MCP工具',
        iconType: 'Search'
      },
      {
        id: 'tool-factory',
        label: '工具工厂',
        iconType: 'FileType'
      }
    ]
  },
  {
    id: 'settings',
    label: '系统设置',
    iconType: 'Settings',
    children: [
      {
        id: 'basic-settings',
        label: '基础设置',
        iconType: 'Tool'
      },
      {
        id: 'model-settings',
        label: '模型设置',
        iconType: 'Box'
      }
    ]
  }
];
