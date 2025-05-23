import React, { useState } from 'react';
import { 
  Card, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Switch,
  alpha,
  useTheme,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  SearchOutlined, 
  FolderOutlined,
  SettingOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ExpandMoreOutlined
} from '@ant-design/icons';
import { KnowledgeBase } from './types';

interface KnowledgeBaseCardProps {
  selectedKnowledgeBases: KnowledgeBase[];
  toggleKnowledgeBaseSelection: (knowledgeBase: KnowledgeBase) => void;
  renderKnowledgeBaseChips?: () => React.ReactNode;
}

type KnowledgeBaseCategory = 'all' | 'document' | 'database' | 'api' | 'web';

const knowledgeBaseCategoryLabels: Record<KnowledgeBaseCategory, string> = {
  all: '全部',
  document: '文档',
  database: '数据库', 
  api: 'API',
  web: '网页'
};

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  selectedKnowledgeBases,
  toggleKnowledgeBaseSelection,
  renderKnowledgeBaseChips
}) => {
  const theme = useTheme();
  const [currentCategory, setCurrentCategory] = useState<KnowledgeBaseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState<KnowledgeBase | null>(null);
  
  // 示例知识库数据
  const availableKnowledgeBases: KnowledgeBase[] = [
    {
      id: '1',
      name: '向量数据库文档',
      description: '包含向量数据库的基本概念、架构和使用方法',
      documentCount: 24,
      category: 'document',
      tags: ['数据库', '向量', '文档'],
      status: 'active',
      size: 15.2,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: '机器学习资料库',
      description: '机器学习和深度学习的理论知识和实践案例',
      documentCount: 56,
      category: 'document',
      tags: ['机器学习', '深度学习', '算法'],
      status: 'active',
      size: 28.5,
      lastUpdated: '2024-01-20'
    },
    {
      id: '3',
      name: '编程语言指南',
      description: '各种编程语言的语法、特性和最佳实践',
      documentCount: 78,
      category: 'document',
      tags: ['编程', '语法', '实践'],
      status: 'active',
      size: 42.1,
      lastUpdated: '2024-01-18'
    },
    {
      id: '4',
      name: '项目文档集合',
      description: '企业内部项目的技术文档和需求规格',
      documentCount: 43,
      category: 'document',
      tags: ['项目', '技术文档', '需求'],
      status: 'active',
      size: 19.8,
      lastUpdated: '2024-01-22'
    },
    {
      id: '5',
      name: '学术研究论文',
      description: '人工智能和自然语言处理领域的学术论文',
      documentCount: 35,
      category: 'document',
      tags: ['学术', '研究', 'AI'],
      status: 'active',
      size: 22.3,
      lastUpdated: '2024-01-16'
    }
  ];

  // 根据当前类别和搜索条件筛选知识库
  const filteredKnowledgeBases = availableKnowledgeBases.filter(kb => {
    const matchesCategory = currentCategory === 'all' || kb.category === currentCategory;
    const matchesSearch = kb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      kb.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 检查知识库是否被选中
  const isKnowledgeBaseSelected = (id: string) => {
    return selectedKnowledgeBases.some(kb => kb.id === id);
  };

  // 获取类别计数
  const getCategoryCount = (category: KnowledgeBaseCategory) => {
    if (category === 'all') return availableKnowledgeBases.length;
    return availableKnowledgeBases.filter(kb => kb.category === category).length;
  };

  // 状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' };
      case 'indexing': return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' };
      case 'error': return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' };
      case 'inactive': return { bg: 'rgba(100, 116, 139, 0.15)', border: 'rgba(100, 116, 139, 0.3)', color: '#64748b' };
      default: return { bg: 'rgba(100, 116, 139, 0.15)', border: 'rgba(100, 116, 139, 0.3)', color: '#64748b' };
    }
  };

  // 打开配置对话框
  const openConfigDialog = (kb: KnowledgeBase, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentKnowledgeBase(kb);
    setConfigDialogOpen(true);
  };

  // 更新检索配置
  const updateRetrievalConfig = (config: KnowledgeBaseRetrievalConfig) => {
    if (currentKnowledgeBase) {
      const updatedKb = { ...currentKnowledgeBase, retrievalConfig: config };
      // 这里应该调用更新接口
      console.log('Updated retrieval config:', updatedKb);
    }
  };

  return (
    // TODO: 重新设计组件
    <div>知识库卡片重新设计中...</div>
  );
};

export default KnowledgeBaseCard;
