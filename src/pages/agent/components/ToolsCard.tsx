import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Paper,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BuildIcon from '@mui/icons-material/Build';
import { SectionCard, CardTitle, CardBody } from './StyledComponents';
import { Tool, CategoryColorType, categoryColors, categoryLabels, availableTools } from './types.tsx';

interface ToolsCardProps {
  selectedTools: Tool[];
  toggleToolSelection: (tool: Tool) => void;
  renderToolChips: () => React.ReactNode;
}

const ToolsCard: React.FC<ToolsCardProps> = ({
  selectedTools,
  toggleToolSelection,
  renderToolChips
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // 按类别过滤工具
  const filteredTools = activeCategory === 'all' 
    ? availableTools 
    : availableTools.filter(tool => tool.category === activeCategory);

  return (
    <SectionCard sx={{
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      borderLeft: '4px solid #8b5cf6',
      backgroundImage: 'linear-gradient(120deg, rgba(139, 92, 246, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    }}>
      <CardTitle 
        color="purple"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundImage: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BuildIcon sx={{ mr: 1 }} /> 
          工具选择
        </Box>
      </CardTitle>
      <CardBody sx={{ overflowY: 'auto', height: '100%' }}>
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={activeCategory}
            onChange={(_, newValue) => setActiveCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#6366f1'
              }
            }}
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 3,
                fontWeight: 500,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: 'rgba(0, 0, 0, 0.7)',
                '&.Mui-selected': {
                  color: '#6366f1',
                  fontWeight: 600
                }
              }
            }}
          >
            <Tab label="全部" value="all" />
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Tab key={key} label={label} value={key} />
            ))}
          </Tabs>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          {filteredTools.map(tool => {
            const isSelected = selectedTools.some(t => t.id === tool.id);
            const category = tool.category;
            const color = categoryColors[category] || categoryColors.utility;
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                <Paper 
                  elevation={0} 
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isSelected ? color.border : 'rgba(0, 0, 0, 0.08)',
                    backgroundColor: isSelected ? `${color.bg}10` : 'rgba(0, 0, 0, 0.01)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: color.border,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }
                  }}
                  onClick={() => toggleToolSelection(tool)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {tool.icon && (
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: isSelected ? color.bg : 'rgba(0,0,0,0.04)',
                            color: isSelected ? '#fff' : 'rgba(0,0,0,0.7)',
                            mr: 1.5 
                          }}
                        >
                          {tool.icon}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {tool.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {categoryLabels[tool.category]}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        color: isSelected ? color.bg : 'rgba(0,0,0,0.4)',
                        bgcolor: isSelected ? 'rgba(255,255,255,0.9)' : 'transparent',
                        '&:hover': { bgcolor: isSelected ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.05)' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleToolSelection(tool);
                      }}
                    >
                      {isSelected ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1.5, 
                      fontSize: '0.8rem',
                      color: 'text.secondary',
                      height: 40,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {tool.description}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </CardBody>
    </SectionCard>
  );
};

export default ToolsCard;
