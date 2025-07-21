import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  alpha,
  useTheme
} from '@mui/material';
import {
  SmartToyOutlined,
  BuildOutlined,
  AutoAwesomeOutlined,
  PlayArrowOutlined,
  StopOutlined,
  AddOutlined,
  SettingsOutlined,
  LinkOutlined,
  DeleteOutlined,
  SaveOutlined,
  VisibilityOutlined,
  CodeOutlined,
  PublishOutlined
} from '@mui/icons-material';

// 节点类型
interface FlowNode {
  id: string;
  type: 'model' | 'tool' | 'agent' | 'condition' | 'output';
  name: string;
  description: string;
  position: { x: number; y: number };
  config: any;
  connections: string[];
}

// 连接线类型
interface FlowConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

const FlowDesigner: React.FC = () => {
  const theme = useTheme();
  
  // 状态管理
  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: 'start',
      type: 'model',
      name: '输入处理',
      description: 'GPT-4模型处理用户输入',
      position: { x: 100, y: 100 },
      config: { model: 'gpt-4', temperature: 0.7 },
      connections: ['search']
    },
    {
      id: 'search',
      type: 'tool',
      name: '知识库检索',
      description: '搜索相关知识',
      position: { x: 350, y: 100 },
      config: { database: 'knowledge-base', topK: 5 },
      connections: ['agent']
    },
    {
      id: 'agent',
      type: 'agent',
      name: '智能回答',
      description: '生成最终回答',
      position: { x: 600, y: 100 },
      config: { persona: 'customer-service', style: 'friendly' },
      connections: ['output']
    },
    {
      id: 'output',
      type: 'output',
      name: '结果输出',
      description: '返回处理结果',
      position: { x: 850, y: 100 },
      config: { format: 'json' },
      connections: []
    }
  ]);
  
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 获取节点图标
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'model': return <AutoAwesomeOutlined />;
      case 'tool': return <BuildOutlined />;
      case 'agent': return <SmartToyOutlined />;
      case 'condition': return <PlayArrowOutlined />;
      case 'output': return <CodeOutlined />;
      default: return <PlayArrowOutlined />;
    }
  };

  // 获取节点颜色
  const getNodeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      model: '#6366f1',
      tool: '#10b981',
      agent: '#8b5cf6',
      condition: '#f59e0b',
      output: '#ef4444'
    };
    return colors[type] || '#64748b';
  };

  // 节点组件
  const FlowNodeComponent: React.FC<{ node: FlowNode }> = ({ node }) => (
    <Card
      sx={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        width: 200,
        borderRadius: '12px',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${alpha(getNodeColor(node.type), 0.3)}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${alpha(getNodeColor(node.type), 0.15)}`,
          borderColor: getNodeColor(node.type)
        }
      }}
      onClick={() => {
        setSelectedNode(node);
        setIsConfigOpen(true);
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* 节点头部 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: alpha(getNodeColor(node.type), 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
              color: getNodeColor(node.type)
            }}
          >
            {getNodeIcon(node.type)}
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
            {node.name}
          </Typography>
          <IconButton size="small">
            <SettingsOutlined fontSize="small" />
          </IconButton>
        </Box>

        {/* 节点描述 */}
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
          {node.description}
        </Typography>

        {/* 节点类型标签 */}
        <Chip
          label={node.type}
          size="small"
          sx={{
            backgroundColor: alpha(getNodeColor(node.type), 0.1),
            color: getNodeColor(node.type),
            fontSize: '0.7rem',
            height: '20px'
          }}
        />

        {/* 连接点 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#94a3b8',
              border: '2px solid white'
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: getNodeColor(node.type),
              border: '2px solid white'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  // 连接线组件
  const ConnectionLine: React.FC<{ from: FlowNode; to: FlowNode }> = ({ from, to }) => (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#64748b"
          />
        </marker>
      </defs>
      <path
        d={`M ${from.position.x + 200} ${from.position.y + 50} Q ${(from.position.x + to.position.x + 200) / 2} ${from.position.y + 50} ${to.position.x} ${to.position.y + 50}`}
        stroke="#64748b"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );

  return (
    <Box sx={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
      {/* 工具栏 */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        display: 'flex',
        gap: 1
      }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddOutlined />}
          sx={{ borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          添加节点
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveOutlined />}
          sx={{ borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          保存
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityOutlined />}
          onClick={() => setIsPreviewOpen(true)}
          sx={{ borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          预览
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<PublishOutlined />}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#6366f1',
            '&:hover': { backgroundColor: '#4f46e5' }
          }}
        >
          发布
        </Button>
      </Box>

      {/* 画布背景 */}
      <Box sx={{
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundColor: '#f8fafc'
      }}>
        {/* 连接线 */}
        {nodes.map((node) =>
          node.connections.map((connectionId) => {
            const targetNode = nodes.find(n => n.id === connectionId);
            return targetNode ? (
              <ConnectionLine
                key={`${node.id}-${connectionId}`}
                from={node}
                to={targetNode}
              />
            ) : null;
          })
        )}

        {/* 节点 */}
        {nodes.map((node) => (
          <FlowNodeComponent key={node.id} node={node} />
        ))}
      </Box>

      {/* 节点配置对话框 */}
      <Dialog
        open={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: alpha(getNodeColor(selectedNode?.type || 'model'), 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                color: getNodeColor(selectedNode?.type || 'model')
              }}
            >
              {getNodeIcon(selectedNode?.type || 'model')}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                配置节点 - {selectedNode?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {selectedNode?.description}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="节点名称"
              fullWidth
              value={selectedNode?.name || ''}
              variant="outlined"
            />
            <TextField
              label="描述"
              fullWidth
              multiline
              rows={2}
              value={selectedNode?.description || ''}
              variant="outlined"
            />
            
            {selectedNode?.type === 'model' && (
              <>
                <FormControl fullWidth>
                  <InputLabel>模型选择</InputLabel>
                  <Select value="gpt-4" label="模型选择">
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                    <MenuItem value="claude-3">Claude-3</MenuItem>
                    <MenuItem value="qwen-max">通义千问</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Temperature"
                  type="number"
                  inputProps={{ min: 0, max: 1, step: 0.1 }}
                  value={0.7}
                  variant="outlined"
                />
              </>
            )}
            
            {selectedNode?.type === 'tool' && (
              <FormControl fullWidth>
                <InputLabel>工具类型</InputLabel>
                <Select value="knowledge-search" label="工具类型">
                  <MenuItem value="knowledge-search">知识库检索</MenuItem>
                  <MenuItem value="web-search">网页搜索</MenuItem>
                  <MenuItem value="file-process">文件处理</MenuItem>
                </Select>
              </FormControl>
            )}
            
            {selectedNode?.type === 'agent' && (
              <FormControl fullWidth>
                <InputLabel>Agent类型</InputLabel>
                <Select value="customer-service" label="Agent类型">
                  <MenuItem value="customer-service">客服助手</MenuItem>
                  <MenuItem value="analyst">数据分析师</MenuItem>
                  <MenuItem value="writer">内容创作者</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setIsConfigOpen(false)}>
            取消
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsConfigOpen(false)}
            sx={{ backgroundColor: '#6366f1', '&:hover': { backgroundColor: '#4f46e5' } }}
          >
            保存配置
          </Button>
        </DialogActions>
      </Dialog>

      {/* 预览对话框 */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            工作流预览
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PlayArrowOutlined sx={{ fontSize: 64, color: '#6366f1', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              工作流执行流程
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              用户输入 → GPT-4处理 → 知识库检索 → 智能回答 → 结果输出
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowOutlined />}
                sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
              >
                测试运行
              </Button>
              <Button
                variant="outlined"
                startIcon={<CodeOutlined />}
              >
                查看代码
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FlowDesigner; 