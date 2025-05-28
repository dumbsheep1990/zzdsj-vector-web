import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  Chip,
  Button,
  alpha,
  useTheme,
  Avatar,
  Paper,
  Divider,
  Tooltip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Zoom
} from '@mui/material';
import { 
  DragOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  BranchesOutlined,
  SyncOutlined,
  NodeIndexOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  ForkOutlined,
  RobotOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
  BgColorsOutlined,
  DeploymentUnitOutlined,
  StarOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { Tool, KnowledgeBase } from './types';
import { ExtensionToolsConfig } from './extensionConfig';
import { useAppContext } from '../../../context/AppContext';

// 执行模式枚举
enum ExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel', 
  CONDITIONAL = 'conditional'
}

// 画布节点类型
enum CanvasNodeType {
  TOOL = 'tool',
  KNOWLEDGE_BASE = 'knowledgeBase',
  TOOL_GROUP = 'toolGroup',
  CONDITION = 'condition',
  START = 'start',
  END = 'end'
}

// 画布节点接口
interface CanvasNode {
  id: string;
  type: CanvasNodeType;
  position: { x: number; y: number };
  data: {
    name: string;
    description: string;
    tools?: Tool[];
    knowledgeBases?: KnowledgeBase[];
    executionMode?: ExecutionMode;
    config?: Record<string, unknown>;
  };
  enabled: boolean;
  connections: string[]; // 连接到的节点ID数组
}

// 连接线接口
interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'sequential' | 'parallel' | 'conditional';
}

interface ToolOrchestrationStepProps {
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  extensionToolsConfig: ExtensionToolsConfig;
  orchestrationItems: any[];
  onOrchestrationItemsChange: (items: any[]) => void;
  onBack?: () => void;
  onComplete?: () => void;
  canContinue?: boolean;
}

const ToolOrchestrationStep: React.FC<ToolOrchestrationStepProps> = ({
  selectedTools,
  selectedKnowledgeBases,
  extensionToolsConfig,
  onOrchestrationItemsChange,
  onBack,
  onComplete,
  canContinue = true
}) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const { state, toggleSidebar } = useAppContext();
  
  // 保存进入页面前的侧边栏状态
  const [originalSidebarState, setOriginalSidebarState] = useState<boolean>(true);
  
  // 状态管理
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{type: string; data: any} | null>(null);
  const [panelExpandedSections, setPanelExpandedSections] = useState({
    tools: true,
    knowledgeBases: true,
    templates: false
  });

  // 自动折叠侧边栏
  useEffect(() => {
    // 保存原始状态
    setOriginalSidebarState(state.sidebarExpanded);
    
    // 如果侧边栏是展开的，则折叠它
    if (state.sidebarExpanded) {
      toggleSidebar();
    }
    
    // 组件卸载时恢复原始状态
    return () => {
      if (originalSidebarState && !state.sidebarExpanded) {
        toggleSidebar();
      }
    };
  }, []); // 只在组件挂载和卸载时执行

  // 初始化画布
  React.useEffect(() => {
    if (canvasNodes.length === 0) {
      // 添加开始和结束节点
      const startNode: CanvasNode = {
        id: 'start-node',
        type: CanvasNodeType.START,
        position: { x: 100, y: 200 },
        data: {
          name: '开始',
          description: '智能体执行起点'
        },
        enabled: true,
        connections: []
      };

      const endNode: CanvasNode = {
        id: 'end-node',
        type: CanvasNodeType.END,
        position: { x: 600, y: 200 },
        data: {
          name: '结束',
          description: '智能体执行终点'
        },
        enabled: true,
        connections: []
      };

      setCanvasNodes([startNode, endNode]);
    }
  }, []);

  // 左侧面板展开/收起
  const togglePanelSection = (section: keyof typeof panelExpandedSections) => {
    setPanelExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 处理拖拽开始
  const handleDragStart = (type: string, data: any) => {
    setDraggedItem({ type, data });
  };

  // 处理画布拖拽结束
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      type: draggedItem.type === 'tool' ? CanvasNodeType.TOOL : CanvasNodeType.KNOWLEDGE_BASE,
      position: { x: Math.max(50, x - 75), y: Math.max(50, y - 40) },
      data: {
        name: draggedItem.data.name,
        description: draggedItem.data.description,
        ...(draggedItem.type === 'tool' ? { tools: [draggedItem.data] } : { knowledgeBases: [draggedItem.data] }),
        executionMode: ExecutionMode.SEQUENTIAL
      },
      enabled: true,
      connections: []
    };

    setCanvasNodes(prev => [...prev, newNode]);
    setDraggedItem(null);
  };

  // 处理画布拖拽悬停
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 删除节点
  const deleteNode = (nodeId: string) => {
    if (nodeId === 'start-node' || nodeId === 'end-node') return;
    
    setCanvasNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => conn.source !== nodeId && conn.target !== nodeId));
    setSelectedNode(null);
  };

  // 切换节点启用状态
  const toggleNodeEnabled = (nodeId: string) => {
    setCanvasNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, enabled: !node.enabled } : node
      )
    );
  };

  // 创建工具组
  const createToolGroup = (tools: Tool[]) => {
    const newNode: CanvasNode = {
      id: `group-${Date.now()}`,
      type: CanvasNodeType.TOOL_GROUP,
      position: { x: 300, y: 150 },
      data: {
        name: `工具组 (${tools.length}个工具)`,
        description: `并行执行: ${tools.map(t => t.name).join(', ')}`,
        tools,
        executionMode: ExecutionMode.PARALLEL
      },
      enabled: true,
      connections: []
    };

    setCanvasNodes(prev => [...prev, newNode]);
  };

  // 渲染左侧工具面板
  const renderLeftPanel = () => (
    <Paper
      elevation={0}
      sx={{
        width: leftPanelOpen ? 340 : 60,
        height: '100%',
        borderRadius: '0',
        background: `linear-gradient(180deg, 
          ${alpha(theme.palette.background.paper, 0.98)} 0%, 
          ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `
          0 0 0 1px ${alpha(theme.palette.divider, 0.05)},
          0 2px 8px ${alpha(theme.palette.common.black, 0.04)},
          0 8px 32px ${alpha(theme.palette.common.black, 0.02)}
        `
      }}
    >
      {/* 面板头部 */}
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.02)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.01)} 100%)`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              borderRadius: '10px',
              width: 36,
              height: 36,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
              '&:hover': { 
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}
          >
            <BgColorsOutlined style={{ fontSize: 18 }} />
          </IconButton>
          
          {leftPanelOpen && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontSize: '16px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                组件工具箱
              </Typography>
              <Typography variant="caption" sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '12px',
                fontWeight: 500
              }}>
                拖拽构建智能体流程
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {leftPanelOpen && (
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {/* 工具列表 */}
          <Card sx={{ 
            mb: 2.5, 
            borderRadius: '16px', 
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`
          }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.06)
                }
              }}
              onClick={() => togglePanelSection('tools')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: theme.palette.primary.main,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                }}>
                  <ToolOutlined style={{ fontSize: 14 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '14px' }}>
                    智能工具
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {selectedTools.length} 个可用工具
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                padding: '4px',
                borderRadius: '6px',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                transition: 'transform 0.2s ease'
              }}>
                {panelExpandedSections.tools ? 
                  <UpOutlined style={{ fontSize: 14, color: theme.palette.primary.main }} /> : 
                  <DownOutlined style={{ fontSize: 14, color: theme.palette.primary.main }} />
                }
              </Box>
            </Box>
            
            <Collapse in={panelExpandedSections.tools}>
              <List dense sx={{ py: 1, px: 1 }}>
                {selectedTools.map((tool, index) => (
                  <ListItem
                    key={tool.id}
                    sx={{
                      cursor: 'grab',
                      borderRadius: '12px',
                      mx: 0.5,
                      mb: 1,
                      p: 1.5,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`
                      },
                      '&:active': {
                        cursor: 'grabbing',
                        transform: 'scale(0.98)'
                      }
                    }}
                    draggable
                    onDragStart={() => handleDragStart('tool', tool)}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Avatar sx={{ 
                        width: 28, 
                        height: 28, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                      }}>
                        <ApiOutlined style={{ fontSize: 12, color: theme.palette.primary.main }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={tool.name}
                      secondary={tool.description}
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        fontWeight: 600,
                        fontSize: '13px'
                      }}
                      secondaryTypographyProps={{ 
                        variant: 'caption',
                        fontSize: '11px',
                        sx: { 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }
                      }}
                    />
                    <Box sx={{
                      ml: 1,
                      opacity: 0.6,
                      transition: 'opacity 0.2s ease'
                    }}>
                      <DragOutlined style={{ fontSize: 14, color: theme.palette.text.disabled }} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Card>

          {/* 知识库列表 */}
          <Card sx={{ 
            mb: 2.5, 
            borderRadius: '16px', 
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            boxShadow: `0 2px 12px ${alpha(theme.palette.success.main, 0.08)}`
          }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: alpha(theme.palette.success.main, 0.04),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.success.main, 0.06)
                }
              }}
              onClick={() => togglePanelSection('knowledgeBases')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: theme.palette.success.main,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`
                }}>
                  <DatabaseOutlined style={{ fontSize: 14 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '14px' }}>
                    知识库
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {selectedKnowledgeBases.length} 个知识源
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                padding: '4px',
                borderRadius: '6px',
                bgcolor: alpha(theme.palette.success.main, 0.1),
                transition: 'transform 0.2s ease'
              }}>
                {panelExpandedSections.knowledgeBases ? 
                  <UpOutlined style={{ fontSize: 14, color: theme.palette.success.main }} /> : 
                  <DownOutlined style={{ fontSize: 14, color: theme.palette.success.main }} />
                }
              </Box>
            </Box>
            
            <Collapse in={panelExpandedSections.knowledgeBases}>
              <List dense sx={{ py: 1, px: 1 }}>
                {selectedKnowledgeBases.map((kb) => (
                  <ListItem
                    key={kb.id}
                    sx={{
                      cursor: 'grab',
                      borderRadius: '12px',
                      mx: 0.5,
                      mb: 1,
                      p: 1.5,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.08)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.success.main, 0.04),
                        borderColor: alpha(theme.palette.success.main, 0.2),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 16px ${alpha(theme.palette.success.main, 0.12)}`
                      },
                      '&:active': {
                        cursor: 'grabbing',
                        transform: 'scale(0.98)'
                      }
                    }}
                    draggable
                    onDragStart={() => handleDragStart('knowledgeBase', kb)}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Avatar sx={{ 
                        width: 28, 
                        height: 28, 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                      }}>
                        <DatabaseOutlined style={{ fontSize: 12, color: theme.palette.success.main }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={kb.name}
                      secondary={kb.description}
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        fontWeight: 600,
                        fontSize: '13px'
                      }}
                      secondaryTypographyProps={{ 
                        variant: 'caption',
                        fontSize: '11px',
                        sx: { 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }
                      }}
                    />
                    <Box sx={{
                      ml: 1,
                      opacity: 0.6,
                      transition: 'opacity 0.2s ease'
                    }}>
                      <DragOutlined style={{ fontSize: 14, color: theme.palette.text.disabled }} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Card>

          {/* 快速模板 */}
          <Card sx={{ 
            mb: 2, 
            borderRadius: '16px', 
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            boxShadow: `0 2px 12px ${alpha(theme.palette.warning.main, 0.08)}`
          }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: alpha(theme.palette.warning.main, 0.04),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.warning.main, 0.06)
                }
              }}
              onClick={() => togglePanelSection('templates')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: theme.palette.warning.main,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.3)}`
                }}>
                  <DeploymentUnitOutlined style={{ fontSize: 14 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '14px' }}>
                    快速模板
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    预设组合方案
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                padding: '4px',
                borderRadius: '6px',
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                transition: 'transform 0.2s ease'
              }}>
                {panelExpandedSections.templates ? 
                  <UpOutlined style={{ fontSize: 14, color: theme.palette.warning.main }} /> : 
                  <DownOutlined style={{ fontSize: 14, color: theme.palette.warning.main }} />
                }
              </Box>
            </Box>
            
            <Collapse in={panelExpandedSections.templates}>
              <List dense sx={{ py: 1, px: 1 }}>
                <ListItemButton
                  onClick={() => createToolGroup(selectedTools.slice(0, 3))}
                  sx={{ 
                    borderRadius: '12px', 
                    mx: 0.5, 
                    mb: 1,
                    p: 1.5,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.08)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.warning.main, 0.04),
                      borderColor: alpha(theme.palette.warning.main, 0.2),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 16px ${alpha(theme.palette.warning.main, 0.12)}`
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Avatar sx={{ 
                      width: 28, 
                      height: 28, 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                    }}>
                      <ForkOutlined style={{ fontSize: 12, color: theme.palette.warning.main }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="并行工具组"
                    secondary="创建多工具并行执行组"
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      fontWeight: 600,
                      fontSize: '13px'
                    }}
                    secondaryTypographyProps={{ 
                      variant: 'caption',
                      fontSize: '11px'
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </Card>
        </Box>
      )}
    </Paper>
  );

  // 渲染画布节点
  const renderCanvasNode = (node: CanvasNode) => {
    const getNodeColor = () => {
      switch (node.type) {
        case CanvasNodeType.TOOL:
          return theme.palette.primary.main;
        case CanvasNodeType.KNOWLEDGE_BASE:
          return theme.palette.success.main;
        case CanvasNodeType.TOOL_GROUP:
          return theme.palette.warning.main;
        case CanvasNodeType.START:
          return theme.palette.info.main;
        case CanvasNodeType.END:
          return theme.palette.error.main;
        default:
          return theme.palette.grey[500];
      }
    };

    const getNodeIcon = () => {
      switch (node.type) {
        case CanvasNodeType.TOOL:
          return <ToolOutlined style={{ fontSize: 16 }} />;
        case CanvasNodeType.KNOWLEDGE_BASE:
          return <DatabaseOutlined style={{ fontSize: 16 }} />;
        case CanvasNodeType.TOOL_GROUP:
          return <ForkOutlined style={{ fontSize: 16 }} />;
        case CanvasNodeType.START:
          return <PlayCircleOutlined style={{ fontSize: 16 }} />;
        case CanvasNodeType.END:
          return <CheckCircleOutlined style={{ fontSize: 16 }} />;
        default:
          return <NodeIndexOutlined style={{ fontSize: 16 }} />;
      }
    };

    const isSpecialNode = node.type === CanvasNodeType.START || node.type === CanvasNodeType.END;
    const isSelected = selectedNode === node.id;

    return (
      <Card
        key={node.id}
        sx={{
          position: 'absolute',
          left: node.position.x,
          top: node.position.y,
          width: isSpecialNode ? 88 : 180,
          minHeight: isSpecialNode ? 88 : 120,
          cursor: 'pointer',
          border: `2px solid ${isSelected ? getNodeColor() : alpha(getNodeColor(), 0.2)}`,
          borderRadius: isSpecialNode ? '50%' : '16px',
          background: node.enabled 
            ? `linear-gradient(135deg, 
                ${alpha(getNodeColor(), 0.08)} 0%, 
                ${alpha(getNodeColor(), 0.03)} 100%)`
            : `linear-gradient(135deg, 
                ${alpha(theme.palette.grey[100], 0.8)} 0%, 
                ${alpha(theme.palette.grey[50], 0.6)} 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center',
          boxShadow: `
            0 4px 20px ${alpha(getNodeColor(), node.enabled ? 0.15 : 0.05)},
            0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
          `,
          '&:hover': {
            boxShadow: `
              0 8px 32px ${alpha(getNodeColor(), node.enabled ? 0.25 : 0.1)},
              0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
            `,
            transform: 'translateY(-4px) scale(1.02)',
            borderColor: getNodeColor()
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: isSelected ? 10 : 5
        }}
        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
      >
        <CardContent sx={{ 
          p: isSpecialNode ? 2 : 2.5, 
          textAlign: 'center',
          '&:last-child': { pb: isSpecialNode ? 2 : 2.5 },
          position: 'relative',
          width: '100%'
        }}>
          {/* 节点图标 */}
          <Avatar
            sx={{
              width: isSpecialNode ? 48 : 40,
              height: isSpecialNode ? 48 : 40,
              mb: isSpecialNode ? 0 : 1.5,
              mx: 'auto',
              background: node.enabled 
                ? `linear-gradient(135deg, ${getNodeColor()}, ${alpha(getNodeColor(), 0.8)})`
                : `linear-gradient(135deg, ${theme.palette.grey[400]}, ${theme.palette.grey[300]})`,
              color: 'white',
              border: `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
              boxShadow: `
                0 4px 16px ${alpha(getNodeColor(), node.enabled ? 0.3 : 0.1)},
                0 1px 0 ${alpha(theme.palette.common.white, 0.3)} inset
              `,
              transition: 'all 0.3s ease'
            }}
          >
            {getNodeIcon()}
          </Avatar>

          {!isSpecialNode && (
            <>
              {/* 节点名称 */}
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '13px',
                  color: node.enabled ? theme.palette.text.primary : theme.palette.text.disabled,
                  mb: 0.5,
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {node.data.name}
              </Typography>

              {/* 工具/知识库数量指示 */}
              {(node.data.tools || node.data.knowledgeBases) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                  {node.data.tools && (
                    <Chip
                      size="small"
                      label={`${node.data.tools.length}个工具`}
                      sx={{
                        height: 20,
                        fontSize: '10px',
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                      }}
                    />
                  )}
                  {node.data.knowledgeBases && (
                    <Chip
                      size="small"
                      label={`${node.data.knowledgeBases.length}个库`}
                      sx={{
                        height: 20,
                        fontSize: '10px',
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                      }}
                    />
                  )}
                </Box>
              )}

              {/* 执行模式指示器 */}
              {node.data.executionMode && (
                <Chip
                  size="small"
                  icon={
                    node.data.executionMode === ExecutionMode.PARALLEL ? 
                      <BranchesOutlined style={{ fontSize: 10 }} /> :
                      <ArrowRightOutlined style={{ fontSize: 10 }} />
                  }
                  label={node.data.executionMode === ExecutionMode.PARALLEL ? '并行' : '串行'}
                  sx={{
                    height: 18,
                    fontSize: '9px',
                    fontWeight: 600,
                    bgcolor: alpha(getNodeColor(), 0.1),
                    color: getNodeColor(),
                    border: `1px solid ${alpha(getNodeColor(), 0.2)}`
                  }}
                />
              )}
            </>
          )}

          {/* 启用状态指示器 */}
          {!node.enabled && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.error.main,
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: `0 2px 4px ${alpha(theme.palette.error.main, 0.3)}`
              }}
            />
          )}

          {/* 选中状态指示器 */}
          {isSelected && (
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                borderRadius: isSpecialNode ? '50%' : '18px',
                border: `2px solid ${getNodeColor()}`,
                background: `linear-gradient(45deg, 
                  ${alpha(getNodeColor(), 0.1)} 0%, 
                  transparent 50%, 
                  ${alpha(getNodeColor(), 0.1)} 100%)`,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.6 },
                  '50%': { opacity: 1 }
                }
              }}
            />
          )}
        </CardContent>

        {/* 选中状态的操作按钮 */}
        {isSelected && !isSpecialNode && (
          <Box
            sx={{
              position: 'absolute',
              top: -16,
              right: -16,
              display: 'flex',
              gap: 0.5,
              zIndex: 20
            }}
          >
            <Tooltip title={node.enabled ? '禁用节点' : '启用节点'}>
              <Fab
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNodeEnabled(node.id);
                }}
                sx={{
                  width: 28,
                  height: 28,
                  minHeight: 28,
                  bgcolor: node.enabled ? theme.palette.success.main : theme.palette.grey[400],
                  color: 'white',
                  boxShadow: `0 2px 8px ${alpha(node.enabled ? theme.palette.success.main : theme.palette.grey[400], 0.4)}`,
                  '&:hover': {
                    bgcolor: node.enabled ? theme.palette.success.dark : theme.palette.grey[500],
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px ${alpha(node.enabled ? theme.palette.success.main : theme.palette.grey[400], 0.5)}`
                  }
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 14 }} />
              </Fab>
            </Tooltip>

            <Tooltip title="删除节点">
              <Fab
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                sx={{
                  width: 28,
                  height: 28,
                  minHeight: 28,
                  bgcolor: theme.palette.error.main,
                  color: 'white',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`,
                  '&:hover': { 
                    bgcolor: theme.palette.error.dark,
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.5)}`
                  }
                }}
              >
                <DeleteOutlined style={{ fontSize: 14 }} />
              </Fab>
            </Tooltip>
          </Box>
        )}
      </Card>
    );
  };

  // 渲染画布区域
  const renderCanvas = () => (
    <Box
      ref={canvasRef}
      sx={{
        flex: 1,
        height: '100%',
        position: 'relative',
        background: `
          radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 25%),
          radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 25%),
          radial-gradient(circle at 40% 60%, ${alpha(theme.palette.success.main, 0.02)} 0%, transparent 25%),
          repeating-linear-gradient(0deg, transparent, transparent 24px, ${alpha(theme.palette.divider, 0.04)} 24px, ${alpha(theme.palette.divider, 0.04)} 25px),
          repeating-linear-gradient(90deg, transparent, transparent 24px, ${alpha(theme.palette.divider, 0.04)} 24px, ${alpha(theme.palette.divider, 0.04)} 25px),
          linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)
        `,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.005)} 0%, transparent 70%)
          `,
          pointerEvents: 'none'
        }
      }}
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
    >
      {/* 画布提示 */}
      {canvasNodes.length <= 2 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: theme.palette.text.secondary,
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              background: `linear-gradient(135deg, 
                ${alpha(theme.palette.background.paper, 0.9)} 0%, 
                ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `
                0 8px 32px ${alpha(theme.palette.common.black, 0.08)},
                0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
              `
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                color: theme.palette.primary.main,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <ClearOutlined style={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
              开始构建执行流程
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 280 }}>
              从左侧工具箱拖拽工具和知识库到画布中，设计智能体的执行流程
            </Typography>
          </Paper>
        </Box>
      )}

      {/* 渲染所有节点 */}
      {canvasNodes.map(renderCanvasNode)}

      {/* 画布工具栏 */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 10
        }}
      >
        <Tooltip title="清空画布" placement="left">
          <Fab
            size="small"
            onClick={() => {
              setCanvasNodes(canvasNodes.filter(node => node.type === CanvasNodeType.START || node.type === CanvasNodeType.END));
              setConnections([]);
              setSelectedNode(null);
            }}
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: theme.palette.text.primary,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `
                0 4px 16px ${alpha(theme.palette.common.black, 0.1)},
                0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
              `,
              '&:hover': { 
                bgcolor: alpha(theme.palette.background.paper, 1),
                transform: 'translateY(-2px)',
                boxShadow: `
                  0 6px 20px ${alpha(theme.palette.common.black, 0.15)},
                  0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
                `
              }
            }}
          >
            <DeploymentUnitOutlined style={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>

        <Tooltip title="自动布局" placement="left">
          <Fab
            size="small"
            onClick={() => {
              // 简单的自动布局逻辑
              const layoutNodes = [...canvasNodes];
              layoutNodes.forEach((node, index) => {
                if (node.type !== CanvasNodeType.START && node.type !== CanvasNodeType.END) {
                  node.position = {
                    x: 200 + (index % 3) * 200,
                    y: 100 + Math.floor(index / 3) * 150
                  };
                }
              });
              setCanvasNodes(layoutNodes);
            }}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `
                0 4px 16px ${alpha(theme.palette.primary.main, 0.15)},
                0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
              `,
              '&:hover': { 
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                transform: 'translateY(-2px)',
                boxShadow: `
                  0 6px 20px ${alpha(theme.palette.primary.main, 0.2)},
                  0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
                `
              }
            }}
          >
            <BranchesOutlined style={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>
      </Box>

      {/* 节点统计面板 */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          p: 2.5,
          borderRadius: '16px',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.95)} 0%, 
            ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `
            0 8px 32px ${alpha(theme.palette.common.black, 0.08)},
            0 1px 0 ${alpha(theme.palette.common.white, 0.5)} inset
          `,
          minWidth: 240
        }}
      >
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 700, 
          mb: 1.5,
          color: theme.palette.text.primary
        }}>
          画布统计
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Chip
            icon={<ToolOutlined />}
            label={`${canvasNodes.filter(n => n.type === CanvasNodeType.TOOL).length} 工具`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.05)
            }}
          />
          <Chip
            icon={<DatabaseOutlined />}
            label={`${canvasNodes.filter(n => n.type === CanvasNodeType.KNOWLEDGE_BASE).length} 知识库`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: alpha(theme.palette.success.main, 0.3),
              color: theme.palette.success.main,
              bgcolor: alpha(theme.palette.success.main, 0.05)
            }}
          />
          <Chip
            icon={<ForkOutlined />}
            label={`${canvasNodes.filter(n => n.type === CanvasNodeType.TOOL_GROUP).length} 工具组`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: alpha(theme.palette.warning.main, 0.3),
              color: theme.palette.warning.main,
              bgcolor: alpha(theme.palette.warning.main, 0.05)
            }}
          />
        </Box>
      </Paper>

      {/* 连接线指示器 */}
      {canvasNodes.length > 2 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          {/* 这里可以添加连接线的SVG渲染 */}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部标题栏 */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '16px 16px 0 0',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.06)})`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                width: 40,
                height: 40
              }}
            >
              <RobotOutlined style={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                智能体流程编排器
              </Typography>
              <Typography variant="body2" color="text.secondary">
                拖拽工具和知识库构建执行流程
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<NodeIndexOutlined />}
              label={`${canvasNodes.filter(n => n.enabled && n.type !== CanvasNodeType.START && n.type !== CanvasNodeType.END).length} 个活跃节点`}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* 主要内容区域 */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧工具面板 */}
        {renderLeftPanel()}

        {/* 右侧画布区域 */}
        {renderCanvas()}
      </Box>

      {/* 底部操作栏 */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowRightOutlined style={{ transform: 'rotate(180deg)' }} />}
          sx={{ borderRadius: '12px', textTransform: 'none' }}
        >
          上一步
        </Button>

        <Button
          variant="contained"
          onClick={onComplete}
          disabled={!canContinue}
          endIcon={<CheckCircleOutlined />}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.85)})`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`
            }
          }}
        >
          完成创建
        </Button>
      </Box>
    </Box>
  );
};

export default ToolOrchestrationStep; 