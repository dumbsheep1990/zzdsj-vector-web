import React, { useState } from 'react';
import { Tool, ToolCategory } from './types';
import { Card, Badge, Chip, Box, Typography, Tabs, Tab, Switch, Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const CategoryBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: -6,
    top: 6,
    padding: '0 4px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '0.65rem',
    minWidth: '16px',
    height: '16px',
  },
}));

interface ToolsCardProps {
  selectedTools: Tool[];
  toggleToolSelection: (tool: Tool) => void;
  renderToolChips?: () => React.ReactNode;
}

const ToolsCard: React.FC<ToolsCardProps> = ({ 
  selectedTools, 
  toggleToolSelection,
  renderToolChips 
}) => {
  const [currentCategory, setCurrentCategory] = useState<ToolCategory | 'all'>('all');
  
  // 工具列表示例数据
  const availableTools: Tool[] = [
    { 
      id: '1', 
      name: '网页浏览器', 
      description: '访问网页内容，搜索信息，抓取网页数据', 
      category: ToolCategory.WEB,
      tags: ['浏览器', '搜索']
    },
    { 
      id: '2', 
      name: '代码解释器', 
      description: '执行Python代码，进行数据分析和可视化', 
      category: ToolCategory.DEVELOPMENT,
      tags: ['Python', '数据分析']
    },
    { 
      id: '3', 
      name: '文档阅读器', 
      description: '读取PDF、Word等文档的内容和结构', 
      category: ToolCategory.DOCUMENT,
      tags: ['PDF', 'Word']
    },
    { 
      id: '4', 
      name: '图像分析', 
      description: '分析图像内容，识别对象和文本', 
      category: ToolCategory.MULTIMEDIA,
      tags: ['图像', '识别']
    },
    { 
      id: '5', 
      name: 'API调用', 
      description: '连接第三方API获取数据和功能', 
      category: ToolCategory.DEVELOPMENT,
      tags: ['API', '集成']
    },
    { 
      id: '6', 
      name: '文件管理器', 
      description: '管理和操作文件系统', 
      category: ToolCategory.DOCUMENT,
      tags: ['文件', '管理']
    }
  ];

  // 获取不同类别的工具数量
  const getCategoryCount = (category: ToolCategory | 'all') => {
    if (category === 'all') return availableTools.length;
    return availableTools.filter(tool => tool.category === category).length;
  };

  // 根据当前类别筛选工具
  const filteredTools = currentCategory === 'all' 
    ? availableTools 
    : availableTools.filter(tool => tool.category === currentCategory);

  // 检查工具是否被选中
  const isToolSelected = (id: string) => {
    return selectedTools.some(tool => tool.id === id);
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'none',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}
    >
      <Box
        sx={{
          p: 2.5,
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          color: '#111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, fontSize: '1rem' }}>工具组件</Typography>
        <Chip
          size="small"
          label={selectedTools.length > 0 ? `已选择 ${selectedTools.length} 个` : '可选择多个'}
          sx={{
            bgcolor: selectedTools.length > 0 ? '#ebf5ff' : '#f1f5f9',
            color: selectedTools.length > 0 ? '#3b82f6' : '#64748b',
            fontWeight: 500,
            fontSize: '0.75rem',
            height: '24px'
          }}
        />
      </Box>
      
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, bgcolor: 'white' }}>
        <Tabs
          value={currentCategory}
          onChange={(_, newValue) => setCurrentCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            minHeight: '40px',
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
              height: '2px',
              borderRadius: '2px'
            },
            '& .MuiTabs-scrollButtons': {
              color: '#64748b'
            },
            '& .MuiTab-root': {
              minHeight: '40px',
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 500,
              color: '#64748b',
              transition: 'all 0.2s ease',
              borderRadius: '4px',
              mr: 1,
              '&.Mui-selected': {
                color: '#3b82f6',
                fontWeight: 600
              },
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: '#334155'
              }
            }
          }}
        >
          <Tab 
            label={
              <CategoryBadge badgeContent={getCategoryCount('all')}>
                <Box sx={{ pr: 2 }}>全部</Box>
              </CategoryBadge>
            } 
            value="all" 
          />
          <Tab 
            label={
              <CategoryBadge badgeContent={getCategoryCount(ToolCategory.WEB)}>
                <Box sx={{ pr: 2 }}>网页工具</Box>
              </CategoryBadge>
            } 
            value={ToolCategory.WEB} 
          />
          <Tab 
            label={
              <CategoryBadge badgeContent={getCategoryCount(ToolCategory.DEVELOPMENT)}>
                <Box sx={{ pr: 2 }}>开发工具</Box>
              </CategoryBadge>
            } 
            value={ToolCategory.DEVELOPMENT} 
          />
          <Tab 
            label={
              <CategoryBadge badgeContent={getCategoryCount(ToolCategory.DOCUMENT)}>
                <Box sx={{ pr: 2 }}>文档工具</Box>
              </CategoryBadge>
            } 
            value={ToolCategory.DOCUMENT} 
          />
          <Tab 
            label={
              <CategoryBadge badgeContent={getCategoryCount(ToolCategory.MULTIMEDIA)}>
                <Box sx={{ pr: 2 }}>多媒体工具</Box>
              </CategoryBadge>
            } 
            value={ToolCategory.MULTIMEDIA} 
          />
        </Tabs>
      </Box>
      
      <Divider />
      
      <Box sx={{ 
        py: 2,
        px: 2, 
        flexGrow: 1, 
        overflow: 'auto', 
        bgcolor: 'white'
      }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
          {filteredTools.map((tool) => (
            <Paper
              key={tool.id}
              sx={{
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isToolSelected(tool.id) ? '#bfdbfe' : '#e5e7eb',
                borderRadius: 1,
                transition: 'all 0.2s ease',
                bgcolor: isToolSelected(tool.id) ? '#f0f9ff' : 'white',
                boxShadow: isToolSelected(tool.id) ? '0 1px 2px rgba(59, 130, 246, 0.1)' : 'none',
                '&:hover': {
                  borderColor: '#bfdbfe',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  bgcolor: '#fafafa'
                }
              }}
              onClick={() => toggleToolSelection(tool)}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#111827',
                      fontSize: '0.875rem',
                      mb: 0.5
                    }}
                  >
                    {tool.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                      maxWidth: '85%'
                    }}
                  >
                    {tool.description}
                  </Typography>
                </Box>
                
                <Switch 
                  size="small" 
                  checked={isToolSelected(tool.id)} 
                  onChange={() => toggleToolSelection(tool)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#3b82f6',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#3b82f6',
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 0.5 }}>
                  {tool.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: '22px',
                        color: '#475569',
                        bgcolor: '#f1f5f9',
                        border: 'none'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
      
      {renderToolChips && renderToolChips()}
    </Card>
  );
};

export default ToolsCard;
