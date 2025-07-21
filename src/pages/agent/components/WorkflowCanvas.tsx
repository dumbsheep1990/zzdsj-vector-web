/**
 * 智能体工作流画布设计器
 * 基于React Flow的可视化流程设计工具
 * 包含完整的页面布局和样式
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { agentService, FlowDesignRequest } from '../../../services/agentService';
import BuilderHeader from './BuilderHeader';

// 定义磨砂背景容器 - 与AgentBuilder相同
const GlassmorphismBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}40, ${theme.palette.info.light}30)`,
  pointerEvents: 'none',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '400px',
    height: '400px',
    background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
    borderRadius: '50%',
    transform: 'translate(20%, -20%)',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '500px',
    height: '500px',
    background: `radial-gradient(circle, ${theme.palette.secondary.main}30 0%, transparent 70%)`,
    borderRadius: '50%',
    transform: 'translate(-20%, 20%)',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  }
}));

// 内容容器组件 - 与AgentBuilder相同
const ContentWrapper = styled(Box)(() => ({
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

// 节点类型定义
const nodeTypes = {
  input: 'input',
  default: 'default',
  output: 'output',
  group: 'group'
};

// 初始节点配置
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 250, y: 25 },
    data: { 
      label: '开始',
      type: 'start',
      config: {}
    },
  },
  {
    id: 'process',
    type: 'default',
    position: { x: 250, y: 150 },
    data: { 
      label: '处理节点',
      type: 'process',
      config: {
        tool: '',
        parameters: {}
      }
    },
  },
  {
    id: 'end',
    type: 'output',
    position: { x: 250, y: 275 },
    data: { 
      label: '结束',
      type: 'end',
      config: {}
    },
  },
];

// 初始边配置
const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'start', target: 'process' },
  { id: 'e2-3', source: 'process', target: 'end' },
];

// 可用工具列表
const AVAILABLE_TOOLS = [
  { id: 'web-search', name: '网络搜索', description: '搜索互联网信息' },
  { id: 'data-analysis', name: '数据分析', description: '分析和处理数据' },
  { id: 'text-generation', name: '文本生成', description: '生成文本内容' },
  { id: 'image-processing', name: '图像处理', description: '处理图像文件' },
  { id: 'api-call', name: 'API调用', description: '调用外部API' },
  { id: 'database-query', name: '数据库查询', description: '查询数据库' },
];

interface WorkflowCanvasProps {
  agentId?: string;
  agentName?: string;
  onSave?: (workflow: any) => void;
  readOnly?: boolean;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  agentId,
  agentName = '智能体工作流',
  onSave,
  readOnly = false
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 连接回调
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 节点点击回调
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (!readOnly) {
      setSelectedNode(node);
      if (node.data.type === 'process') {
        setIsToolDialogOpen(true);
      }
    }
  }, [readOnly]);

  // 加载现有工作流
  useEffect(() => {
    if (agentId) {
      loadWorkflow();
    }
  }, [agentId]);

  const loadWorkflow = async () => {
    if (!agentId) return;
    
    try {
      setIsLoading(true);
      const workflow = await agentService.getFlow(agentId);
      
      if (workflow && workflow.nodes && workflow.edges) {
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
      }
    } catch (error) {
      console.error('加载工作流失败:', error);
      setError('加载工作流失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 保存工作流
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const flowData: FlowDesignRequest = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type || 'default',
          position: node.position,
          data: node.data
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type
        })),
        metadata: {
          version: '1.0',
          description: '智能体工作流',
          createdAt: new Date().toISOString()
        }
      };

      if (agentId) {
        await agentService.designFlow(agentId, flowData);
        setSuccess('工作流保存成功！');
      }

      if (onSave) {
        onSave(flowData);
      }
    } catch (error: any) {
      console.error('保存工作流失败:', error);
      setError(error.message || '保存工作流失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 添加新节点
  const addNewNode = (toolId: string, toolName: string) => {
    const newNodeId = `node_${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'default',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: toolName,
        type: 'process',
        config: {
          tool: toolId,
          parameters: {}
        }
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setIsToolDialogOpen(false);
  };

  // 配置节点工具
  const configureNodeTool = (toolId: string, toolName: string) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: toolName,
                  config: {
                    ...node.data.config,
                    tool: toolId
                  }
                }
              }
            : node
        )
      );
    }
    setIsToolDialogOpen(false);
  };

  // 删除选中节点
  const deleteSelectedNode = () => {
    if (selectedNode && selectedNode.id !== 'start' && selectedNode.id !== 'end') {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  };

  // 返回上一页
  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      {/* 固定底层背景 - 与AgentBuilder相同 */}
      <GlassmorphismBackground />
      
      {/* 内容容器 */}
      <ContentWrapper>
        {/* 顶部灵动岛 - 使用与AgentBuilder相同的样式 */}
        <BuilderHeader
          title="工作流设计"
          agentName={agentName}
          pageName="工作流构建"
          canSave={!readOnly}
          onSave={handleSave}
          currentStep={1}
          totalSteps={1}
          isMainHeader={true}
        />

        {/* 主容器 - 与AgentBuilder相同的样式 */}
        <Box 
          sx={{
            display: 'flex', 
            flexGrow: 1,
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '16px',
            margin: 2,
            marginTop: 4,
            marginBottom: 3,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            height: 'calc(100vh - 160px)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* 左侧工具栏 */}
          <Box sx={{
            width: '280px',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 2
          }}>
            {/* 返回按钮 */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{
                mb: 2,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: '#64748b',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              返回
            </Button>

            {/* 工作流信息 */}
            <Box sx={{
              p: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              mb: 2
            }}>
              <Box sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
                工作流信息
              </Box>
              <Box sx={{ fontSize: '0.9rem', color: '#64748b' }}>
                智能体: {agentName}
              </Box>
              <Box sx={{ fontSize: '0.9rem', color: '#64748b' }}>
                状态: {readOnly ? '只读' : '编辑中'}
              </Box>
            </Box>

            {/* 工具说明 */}
            <Box sx={{
              p: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              flex: 1
            }}>
              <Box sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
                操作说明
              </Box>
              <Box sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                • 点击"添加工具"创建新节点<br/>
                • 拖拽节点边缘创建连接<br/>
                • 双击节点进行配置<br/>
                • 点击"保存工作流"保存设计
              </Box>
            </Box>
          </Box>

          {/* 右侧工作流画布区域 */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 简化的顶部工具栏 */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              minHeight: '60px'
            }}>
              <Typography variant="h6" sx={{ color: '#334155', fontWeight: 600 }}>
                工作流设计器
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!readOnly && (
                  <>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => setIsToolDialogOpen(true)}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                    >
                      添加工具
                    </Button>
                    
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={isLoading}
                      size="small"
                      variant="contained"
                      sx={{ 
                        borderRadius: '8px',
                        backgroundColor: '#3b82f6',
                        '&:hover': {
                          backgroundColor: '#2563eb',
                        }
                      }}
                    >
                      {isLoading ? '保存中...' : '保存工作流'}
                    </Button>
                  </>
                )}
                
                <Button
                  startIcon={<PlayIcon />}
                  size="small"
                  variant="contained"
                  color="success"
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: '#10b981',
                    '&:hover': {
                      backgroundColor: '#059669',
                    }
                  }}
                >
                  测试运行
                </Button>
              </Box>
            </Box>

            {/* 画布区域 */}
            <Box sx={{ flex: 1, position: 'relative' }}>
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-left"
                  style={{ width: '100%', height: '100%' }}
                >
                  <Controls />
                  <MiniMap />
                  <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
              </ReactFlowProvider>
            </Box>

            {/* 选中节点信息 */}
            {selectedNode && !readOnly && (
              <Box sx={{
                position: 'absolute',
                top: 80,
                right: 20,
                width: 280,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                p: 2,
                zIndex: 1000
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#334155', fontWeight: 600 }}>
                    节点配置
                  </Typography>
                  <IconButton onClick={() => setSelectedNode(null)} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                  节点ID: {selectedNode.id}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                  节点类型: {selectedNode.data.type}
                </Typography>
                
                {selectedNode.data.config?.tool && (
                  <Box sx={{ 
                    mb: 2,
                    p: 1,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 500 }}>
                      工具: {selectedNode.data.config.tool}
                    </Typography>
                  </Box>
                )}
                
                {selectedNode.id !== 'start' && selectedNode.id !== 'end' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<SettingsIcon />}
                      onClick={() => setIsToolDialogOpen(true)}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                    >
                      配置工具
                    </Button>
                    
                    <Button
                      onClick={deleteSelectedNode}
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ 
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        }
                      }}
                    >
                      删除
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </ContentWrapper>

      {/* 工具选择对话框 */}
      <Dialog 
        open={isToolDialogOpen} 
        onClose={() => setIsToolDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#334155',
          fontWeight: 600
        }}>
          {selectedNode ? '配置节点工具' : '选择工具'}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
            {AVAILABLE_TOOLS.map((tool) => (
              <Box
                key={tool.id} 
                sx={{ 
                  p: 2,
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                onClick={() => {
                  if (selectedNode) {
                    configureNodeTool(tool.id, tool.name);
                  } else {
                    addNewNode(tool.id, tool.name);
                  }
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, color: '#334155', fontWeight: 600 }}>
                  {tool.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
                  {tool.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
          <Button 
            onClick={() => setIsToolDialogOpen(false)}
            sx={{ 
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              color: '#64748b',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            取消
          </Button>
        </DialogActions>
      </Dialog>

      {/* 消息提示 */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{ 
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(null)} 
          severity="success"
          sx={{ 
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WorkflowCanvas;