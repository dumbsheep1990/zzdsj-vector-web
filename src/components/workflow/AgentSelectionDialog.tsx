import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  alpha,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  SmartToy as AgentIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

// 已有智能体列表
const AVAILABLE_AGENTS = [
  { 
    id: 'agent_policy_analyst', 
    name: '政策分析师', 
    description: '专业政策解读和分析，具备深度政策理解能力',
    model: 'Qwen/Qwen3-32B',
    status: 'active',
    category: 'analysis',
    avatar: '🏛️'
  },
  { 
    id: 'agent_legal_advisor', 
    name: '法律顾问', 
    description: '法律条文解释和咨询，提供专业法律建议',
    model: 'moonshotai/Kimi-K2-Instruct',
    status: 'active',
    category: 'legal',
    avatar: '⚖️'
  },
  { 
    id: 'agent_report_writer', 
    name: '报告撰写员', 
    description: '专业报告生成助手，擅长结构化文档编写',
    model: 'Qwen/Qwen3-235B-A22B',
    status: 'active',
    category: 'writing',
    avatar: '📝'
  },
  { 
    id: 'agent_qa_assistant', 
    name: '问答助手', 
    description: '智能问答服务代理，快速响应用户查询',
    model: 'Qwen/Qwen3-32B',
    status: 'active',
    category: 'support',
    avatar: '🤖'
  },
  { 
    id: 'agent_data_analyst', 
    name: '数据分析师', 
    description: '专业数据分析和可视化，提供深度洞察',
    model: 'Qwen/Qwen3-235B-A22B',
    status: 'active',
    category: 'analysis',
    avatar: '📊'
  }
];

interface AgentSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (agentId: string) => void;
  selectedAgents: string[];
}

export default function AgentSelectionDialog({
  open,
  onClose,
  onSelect,
  selectedAgents
}: AgentSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const filteredAgents = AVAILABLE_AGENTS.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedAgent) {
      onSelect(selectedAgent);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedAgent(null);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
        borderBottom: '1px solid',
        borderColor: alpha('#e0e7ff', 0.6)
      }}>
        <Typography variant="h6" sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 600
        }}>
          🤖 选择智能体
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
          从系统中已定义的智能体中选择一个加入工作流
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* 搜索框 */}
        <TextField
          fullWidth
          placeholder="搜索智能体名称、描述或分类..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748b' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: 2,
              backgroundColor: alpha('#f8fafc', 0.8)
            }
          }}
        />

                 {/* 智能体网格 */}
         <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
           {filteredAgents.map((agent) => {
             const isSelected = selectedAgent === agent.id;
             const isAlreadyAdded = selectedAgents.includes(agent.id);
             
             return (
               <Box key={agent.id}>
                <Card
                  sx={{
                    cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                    opacity: isAlreadyAdded ? 0.6 : 1,
                    border: '2px solid',
                    borderColor: isSelected 
                      ? '#3b82f6' 
                      : isAlreadyAdded 
                        ? '#9ca3af'
                        : alpha('#e5e7eb', 0.6),
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    background: isSelected 
                      ? alpha('#3b82f6', 0.05)
                      : 'white',
                    '&:hover': !isAlreadyAdded ? {
                      borderColor: '#3b82f6',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                    } : {}
                  }}
                  onClick={() => !isAlreadyAdded && setSelectedAgent(agent.id)}
                >
                  <CardContent sx={{ p: 3, position: 'relative' }}>
                    {isAlreadyAdded && (
                      <Chip
                        icon={<CheckIcon />}
                        label="已添加"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        fontSize: '1.5rem',
                        mr: 2
                      }}>
                        {agent.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{
                          fontWeight: 600,
                          color: '#1f2937',
                          fontSize: '1.1rem'
                        }}>
                          {agent.name}
                        </Typography>
                        <Typography variant="caption" sx={{
                          color: '#6b7280',
                          background: alpha('#f3f4f6', 0.8),
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}>
                          {agent.model}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{
                      color: '#374151',
                      lineHeight: 1.5,
                      mb: 2
                    }}>
                      {agent.description}
                    </Typography>

                    <Chip
                      label={agent.category === 'analysis' ? '分析' : 
                            agent.category === 'legal' ? '法律' :
                            agent.category === 'writing' ? '写作' :
                            agent.category === 'support' ? '支持' : '其他'}
                      size="small"
                      sx={{
                        background: agent.category === 'analysis' ? alpha('#3b82f6', 0.1) :
                                   agent.category === 'legal' ? alpha('#10b981', 0.1) :
                                   agent.category === 'writing' ? alpha('#f59e0b', 0.1) :
                                   agent.category === 'support' ? alpha('#8b5cf6', 0.1) : alpha('#6b7280', 0.1),
                        color: agent.category === 'analysis' ? '#3b82f6' :
                               agent.category === 'legal' ? '#10b981' :
                               agent.category === 'writing' ? '#f59e0b' :
                               agent.category === 'support' ? '#8b5cf6' : '#6b7280',
                        fontWeight: 500
                      }}
                    />
                                     </CardContent>
                 </Card>
               </Box>
             );
           })}
         </Box>

        {filteredAgents.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 6,
            color: '#6b7280'
          }}>
            <AgentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">
              没有找到匹配的智能体
            </Typography>
            <Typography variant="body2">
              尝试调整搜索关键词
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: alpha('#e5e7eb', 0.6) }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#6b7280',
            '&:hover': {
              background: alpha('#6b7280', 0.1)
            }
          }}
        >
          取消
        </Button>
        <Button
          onClick={handleSelect}
          disabled={!selectedAgent}
          sx={{
            background: selectedAgent 
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              : alpha('#6b7280', 0.2),
            color: selectedAgent ? 'white' : '#9ca3af',
            fontWeight: 600,
            px: 3,
            '&:hover': selectedAgent ? {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
            } : {},
            '&:disabled': {
              background: alpha('#6b7280', 0.2),
              color: '#9ca3af'
            },
            transition: 'all 0.2s ease'
          }}
        >
          添加智能体
        </Button>
      </DialogActions>
    </Dialog>
  );
} 