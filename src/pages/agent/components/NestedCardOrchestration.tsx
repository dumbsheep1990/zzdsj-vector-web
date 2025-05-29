import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  Chip,
  Button,
  alpha,
  useTheme,
  Avatar,
  Paper,
  Divider,
  Tooltip,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Switch
} from '@mui/material';
import { 
  DeleteOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  DatabaseOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  BranchesOutlined,
  NodeIndexOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  BulbOutlined,
  MenuOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

// 导入输出格式化工具
import { outputFormattingTools, getDefaultFormattingTools } from './outputFormattingTools';

// 导入编排系统类型
import { 
  ModuleType, 
  ModuleConfig, 
  ExecutionMode, 
  OrchestrationData 
} from './types/orchestration';

// 简化的工具和知识库接口
interface Tool {
  id: string;
  name: string;
  description: string;
  type?: string; // 使类型字段为可选
}

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
}

// 组件属性
interface NestedCardOrchestrationProps {
  selectedTools: Tool[];
  selectedKnowledgeBases: KnowledgeBase[];
  onOrchestrationChange: (data: any) => void;
  onBack?: () => void;
  onComplete?: () => void;
  executionMode?: 'sequential' | 'parallel' | 'conditional'; // 执行模式属性
  moduleType?: ModuleType; // 模块类型属性。当选中特定功能模块时使用
}

// 使用从types/orchestration导入的类型

const NestedCardOrchestration: React.FC<NestedCardOrchestrationProps> = ({
  selectedTools,
  selectedKnowledgeBases,
  onOrchestrationChange,
  onBack,
  onComplete,
  executionMode = 'sequential' as ExecutionMode // 默认为串行执行
}) => {
  const theme = useTheme();
  
  // 状态管理
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    informationRetrieval: true,
    contentProcessing: true,
    dataAnalysis: false,
    outputGeneration: false
  });
  
  // 更新模块配置结构，添加顺序属性，初始化时将用户选择的工具添加到第一个模块
  const [modulesConfig, setModulesConfig] = useState<{[key: string]: ModuleConfig}>({
    informationRetrieval: {
      tools: [],  // 初始化为空，稍后根据selectedTools填充
      knowledgeBases: [],
      executionStrategy: '串行执行',
      order: 1,
      enabled: true
    },
    contentProcessing: {
      tools: [],
      knowledgeBases: [],
      executionStrategy: '串行执行',
      order: 2,
      enabled: true
    },
    dataAnalysis: {
      tools: [],
      knowledgeBases: [],
      executionStrategy: '串行执行',
      order: 3,
      enabled: true
    },
    outputGeneration: {
      tools: getDefaultFormattingTools(), // 设置默认的数据格式工厂工具
      knowledgeBases: [],
      executionStrategy: '串行执行',
      order: 4,
      enabled: true,
      config: {
        useModelOutput: true, // 默认同时使用模型直接输出
        useFormatting: true,  // 默认使用格式化工具
        formatOptions: ['json', 'markdown'] // 默认格式化选项
      }
    }
  });
  
  // 初始化时，将用户选择的工具添加到第一个模块
  useEffect(() => {
    if (selectedTools.length > 0) {
      setModulesConfig(prev => {
        const firstModule = 'informationRetrieval';
        return {
          ...prev,
          [firstModule]: {
            ...prev[firstModule],
            tools: selectedTools.map(tool => tool.name)
          }
        };
      });
    }
    
    if (selectedKnowledgeBases.length > 0) {
      setModulesConfig(prev => {
        const firstModule = 'informationRetrieval';
        return {
          ...prev,
          [firstModule]: {
            ...prev[firstModule],
            knowledgeBases: selectedKnowledgeBases.map(kb => kb.name)
          }
        };
      });
    }
  }, [selectedTools, selectedKnowledgeBases]);
  
  // 条件执行配置状态 - 增强版本
  const [conditionConfigs, setConditionConfigs] = useState<{[key: string]: {
    baseToolName?: string;
    condition: string;
    trueBranchTools: string[];
    falseBranchTools: string[];
    // 新增：默认处理选项
    trueBranchDefaultAction?: 'none' | 'continue' | 'success' | 'custom';
    falseBranchDefaultAction?: 'none' | 'retry' | 'skip' | 'fallback' | 'error' | 'custom';
    trueBranchDefaultMessage?: string;
    falseBranchDefaultMessage?: string;
  }}>({
    informationRetrieval: {
      baseToolName: '',
      condition: '',
      trueBranchTools: [],
      falseBranchTools: [],
      trueBranchDefaultAction: 'none',
      falseBranchDefaultAction: 'none',
      trueBranchDefaultMessage: '',
      falseBranchDefaultMessage: ''
    },
    contentProcessing: {
      baseToolName: '',
      condition: '',
      trueBranchTools: [],
      falseBranchTools: [],
      trueBranchDefaultAction: 'none',
      falseBranchDefaultAction: 'none',
      trueBranchDefaultMessage: '',
      falseBranchDefaultMessage: ''
    },
    dataAnalysis: {
      baseToolName: '',
      condition: '',
      trueBranchTools: [],
      falseBranchTools: [],
      trueBranchDefaultAction: 'none',
      falseBranchDefaultAction: 'none',
      trueBranchDefaultMessage: '',
      falseBranchDefaultMessage: ''
    },
    outputGeneration: {
      baseToolName: '',
      condition: '',
      trueBranchTools: [],
      falseBranchTools: [],
      trueBranchDefaultAction: 'none',
      falseBranchDefaultAction: 'none',
      trueBranchDefaultMessage: '',
      falseBranchDefaultMessage: ''
    }
  });
  
  // 添加流程预览功能
  const [showFlowPreview, setShowFlowPreview] = useState(false);
  
  // 获取已排序的模块
  const getSortedModules = useCallback(() => {
    return Object.entries(modulesConfig)
      .map(([key, config]) => ({ key, config }))
      .sort((a, b) => a.config.order - b.config.order);
  }, [modulesConfig]);
  
  // 切换部分是否展开
  const toggleSectionExpanded = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // 切换工具选择
  const toggleToolSelection = (section: string, toolName: string) => {
    setModulesConfig(prev => {
      const moduleConfig = { ...prev[section] };
      const tools = [...moduleConfig.tools];
      const index = tools.indexOf(toolName);
      
      if (index === -1) {
        tools.push(toolName);
      } else {
        tools.splice(index, 1);
      }
      
      return {
        ...prev,
        [section]: {
          ...moduleConfig,
          tools
        }
      };
    });
  };
  
  // 切换知识库选择
  const toggleKBSelection = (section: string, kbName: string) => {
    setModulesConfig(prev => {
      const moduleConfig = { ...prev[section] };
      const knowledgeBases = [...moduleConfig.knowledgeBases];
      const index = knowledgeBases.indexOf(kbName);
      
      if (index === -1) {
        knowledgeBases.push(kbName);
      } else {
        knowledgeBases.splice(index, 1);
      }
      
      return {
        ...prev,
        [section]: {
          ...moduleConfig,
          knowledgeBases
        }
      };
    });
  };
  
  // 移动模块顺序
  const moveModuleOrder = (section: string, direction: 'up' | 'down') => {
    const sortedModules = getSortedModules();
    const currentIndex = sortedModules.findIndex(item => item.key === section);
    
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === sortedModules.length - 1)
    ) {
      return; // 已经是第一个或最后一个，无法移动
    }
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetSection = sortedModules[targetIndex].key;
    
    // 交换顺序
    setModulesConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        order: prev[targetSection].order
      },
      [targetSection]: {
        ...prev[targetSection],
        order: prev[section].order
      }
    }));
  };
  
  // 更新执行策略
  const updateExecutionStrategy = (section: string, strategy: string) => {
    setModulesConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        executionStrategy: strategy
      }
    }));
  };
  
  // 当执行模式改变时，更新所有模块的执行策略
  useEffect(() => {
    // 将executionMode转换为对应的策略名称
    const strategyMap = {
      'sequential': '串行执行',
      'parallel': '并行执行',
      'conditional': '条件执行'
    };
    
    const newStrategy = strategyMap[executionMode];
    
    // 更新所有模块的执行策略
    setModulesConfig(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = {
          ...updated[key],
          executionStrategy: newStrategy
        };
      });
      return updated;
    });
  }, [executionMode]);
  
  // 添加新层级
  const addNewLayer = () => {
    // 实现添加新层级的逻辑
    alert('将添加新的功能层级');
  };
  
  // 提交编排配置
  const handleComplete = () => {
    // 构建编排配置数据
    const orchestrationData = {
      type: 'nested',
      modules: getSortedModules()
        // 过滤掉禁用的模块
        .filter(({ config }) => config.enabled)
        .map(({ key, config }) => {
        // 根据模块类型映射
        const moduleTypeMap = {
          'informationRetrieval': ModuleType.INFORMATION_RETRIEVAL,
          'contentProcessing': ModuleType.CONTENT_PROCESSING,
          'dataAnalysis': ModuleType.DATA_ANALYSIS,
          'outputGeneration': ModuleType.OUTPUT_GENERATION
        };
        
        // 模块名称映射
        const moduleNameMap = {
          'informationRetrieval': '信息获取',
          'contentProcessing': '内容处理',
          'dataAnalysis': '数据分析与推理',
          'outputGeneration': '输出生成'
        };
        
        // 将执行策略转换为API所需格式
        const executionStrategyMap: {[key: string]: string} = {
          '串行执行': 'sequential',
          '并行执行': 'parallel',
          '条件执行': 'conditional',
          '混合执行': 'mixed'
        };
        
        // 基本模块配置
        const moduleConfig = {
          type: moduleTypeMap[key as keyof typeof moduleTypeMap],
          name: moduleNameMap[key as keyof typeof moduleNameMap],
          tools: config.tools.map(name => 
            selectedTools.find(t => t.name === name) || { id: '', name, description: '' }
          ),
          knowledgeBases: config.knowledgeBases.map(name => 
            selectedKnowledgeBases.find(kb => kb.name === name) || { id: '', name, description: '' }
          ),
          config: {
            executionStrategy: executionStrategyMap[config.executionStrategy] || 'sequential',
            timeout: 30,
            retries: 2
          }
        };
        
        // 根据执行策略添加特定配置
        if (config.executionStrategy === '条件执行') {
          const conditionConfig = conditionConfigs[key];
          const baseTool = config.tools.length > 0 ? config.tools[0] : '';
          
          // 设置条件执行配置
          if (baseTool) {
            const baseToolObj = selectedTools.find(t => t.name === baseTool);
            
            // 条件执行配置
            (moduleConfig.config as any).conditionalExecution = {
              baseToolId: baseToolObj?.id || '',
              baseToolName: baseTool,
              condition: conditionConfig.condition || `${baseTool}.result.success === true`,
              trueBranchTools: conditionConfig.trueBranchTools.map(name => {
                const tool = selectedTools.find(t => t.name === name);
                return tool ? { id: tool.id, name: tool.name } : { id: '', name };
              }),
              falseBranchTools: conditionConfig.falseBranchTools.map(name => {
                const tool = selectedTools.find(t => t.name === name);
                return tool ? { id: tool.id, name: tool.name } : { id: '', name };
              })
            };
          }
        } 
        // 混合执行模式配置
        else if (config.executionStrategy === '混合执行' && config.parallelGroups && config.parallelGroups.length > 0) {
          // 获取未分配到并行组的工具（串行执行的工具）
          const allAssignedTools = (config.parallelGroups || []).flat();
          const serialTools = config.tools.filter(tool => !allAssignedTools.includes(tool));
          
          // 添加混合执行配置
          (moduleConfig.config as any).mixedExecution = {
            serialTools: serialTools.map(name => {
              const tool = selectedTools.find(t => t.name === name);
              return tool ? { id: tool.id, name: tool.name } : { id: '', name };
            }),
            parallelGroups: (config.parallelGroups || []).map(group => 
              group.map(name => {
                const tool = selectedTools.find(t => t.name === name);
                return tool ? { id: tool.id, name: tool.name } : { id: '', name };
              })
            )
          };
        }
        
        return moduleConfig;
      }).filter(module => {
        // 确保模块有工具或知识库
        const m = module as any;
        return m.tools.length > 0 || m.knowledgeBases.length > 0;
      })
    };
    
    onOrchestrationChange(orchestrationData);
    onComplete?.();
  };
  
  // 切换流程预览
  const toggleFlowPreview = () => {
    setShowFlowPreview(prev => !prev);
  };
  
  // 更新条件表达式
  const updateCondition = (section: string, condition: string) => {
    setConditionConfigs(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        condition
      }
    }));
  };
  
  // 更新条件分支工具
  const updateConditionBranchTools = (section: string, branch: 'true' | 'false', toolName: string, isAdd: boolean) => {
    setConditionConfigs(prev => {
      const branchKey = branch === 'true' ? 'trueBranchTools' : 'falseBranchTools';
      const currentTools = [...prev[section][branchKey]];
      
      if (isAdd && !currentTools.includes(toolName)) {
        currentTools.push(toolName);
      } else if (!isAdd) {
        const index = currentTools.indexOf(toolName);
        if (index !== -1) {
          currentTools.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [branchKey]: currentTools
        }
      };
    });
  };
  
  // 更新条件分支默认处理选项
  const updateConditionBranchDefaultAction = (section: string, branch: 'true' | 'false', action: string, message?: string) => {
    setConditionConfigs(prev => {
      const actionKey = branch === 'true' ? 'trueBranchDefaultAction' : 'falseBranchDefaultAction';
      const messageKey = branch === 'true' ? 'trueBranchDefaultMessage' : 'falseBranchDefaultMessage';
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [actionKey]: action,
          ...(message !== undefined && { [messageKey]: message })
        }
      };
    });
  };
  
  // 添加并行组更新逻辑
  const updateParallelGroups = (section: string, groups: string[][]) => {
    setModulesConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        parallelGroups: groups
      }
    }));
  };
  
  // 添加模块启用/禁用函数
  const toggleModuleEnabled = (section: string) => {
    setModulesConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        enabled: !prev[section].enabled
      }
    }));
  };
  
  // 嵌套层级卡片组件
  interface NestedLayerCardProps {
    title: string;
    icon: React.ReactNode;
    color: any;
    expanded: boolean;
    onToggleExpand: () => void;
    tools: Tool[];
    knowledgeBases: KnowledgeBase[];
    selectedTools: string[];
    selectedKnowledgeBases: string[];
    section: string;
    order: number;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    executionStrategy: string;
    onExecutionStrategyChange: (strategy: string) => void;
    // 添加并行工具组管理函数
    onUpdateParallelGroups?: (groups: string[][]) => void;
    parallelGroups?: string[][];
    enabled: boolean; // 添加启用状态
    onToggleEnabled: () => void; // 添加切换启用状态的回调
    bgGradient?: string; // 添加背景渐变
  }
  
  const NestedLayerCard: React.FC<NestedLayerCardProps> = ({
    title,
    icon,
    color,
    expanded,
    onToggleExpand,
    tools,
    knowledgeBases,
    selectedTools,
    selectedKnowledgeBases,
    section,
    order,
    onMoveUp,
    onMoveDown,
    executionStrategy,
    onExecutionStrategyChange,
    onUpdateParallelGroups,
    parallelGroups = [],
    enabled,
    onToggleEnabled,
    bgGradient
  }) => {
    // 创建一个状态来管理工具的并行组
    const [showParallelGroupEditor, setShowParallelGroupEditor] = useState(false);
    const [tempParallelGroups, setTempParallelGroups] = useState<string[][]>(parallelGroups);
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    
    // 打开并行组编辑器
    const openParallelGroupEditor = (e: React.MouseEvent) => {
      e.stopPropagation();
      setTempParallelGroups(parallelGroups.length > 0 ? [...parallelGroups] : []);
      setShowParallelGroupEditor(true);
    };
    
    // 关闭并行组编辑器
    const closeParallelGroupEditor = () => {
      setShowParallelGroupEditor(false);
      setSelectedGroup(null);
    };
    
    // 保存并行组配置
    const saveParallelGroups = () => {
      onUpdateParallelGroups?.(tempParallelGroups);
      closeParallelGroupEditor();
    };
    
    // 添加新的并行组
    const addNewParallelGroup = () => {
      setTempParallelGroups(prev => [...prev, []]);
      setSelectedGroup(tempParallelGroups.length);
    };
    
    // 删除并行组
    const removeParallelGroup = (index: number) => {
      setTempParallelGroups(prev => prev.filter((_, i) => i !== index));
      setSelectedGroup(null);
    };
    
    // 添加工具到并行组
    const addToolToGroup = (groupIndex: number, toolName: string) => {
      setTempParallelGroups(prev => {
        const newGroups = [...prev];
        if (!newGroups[groupIndex].includes(toolName)) {
          newGroups[groupIndex] = [...newGroups[groupIndex], toolName];
        }
        return newGroups;
      });
    };
    
    // 从并行组移除工具
    const removeToolFromGroup = (groupIndex: number, toolName: string) => {
      setTempParallelGroups(prev => {
        const newGroups = [...prev];
        newGroups[groupIndex] = newGroups[groupIndex].filter(t => t !== toolName);
        // 如果组变空了，考虑删除整个组
        if (newGroups[groupIndex].length === 0) {
          return newGroups.filter((_, i) => i !== groupIndex);
        }
        return newGroups;
      });
    };
    
    // 获取未分配到任何并行组的工具
    const getUnassignedTools = () => {
      const assignedTools = tempParallelGroups.flat();
      return selectedTools.filter(tool => !assignedTools.includes(tool));
    };
    
    // 是否显示执行策略选项
    const shouldShowExecutionStrategy = selectedTools.length > 1;
    
    // 渲染工具列表，根据执行策略使用不同的显示方式
    const renderTools = (tools: Tool[], selectedTools: string[], section: string, executionStrategy: string, color: any) => {
      // 获取实际选中的工具对象
      const selectedToolObjects = selectedTools.map(toolName => {
        const foundTool = tools.find(t => t.name === toolName);
        return foundTool || { id: toolName, name: toolName, description: "工具描述" };
      });
      
      // 混合执行模式 - 可以定义哪些工具并行执行，哪些串行执行
      if (executionStrategy === '混合执行') {
        // 获取未分配到并行组的工具
        const unassignedTools = selectedTools.filter(toolName => {
          return !parallelGroups.flat().includes(toolName);
        });
        
        // 获取未分配工具对应的工具对象
        const unassignedToolObjects = unassignedTools.map(toolName => {
          const foundTool = tools.find(t => t.name === toolName);
          return foundTool || { id: toolName, name: toolName, description: "工具描述" };
        });
        
        return (
          <Box>
            {/* 未分配工具（串行执行部分） */}
            {unassignedToolObjects.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: color.dark }}>
                  串行执行工具
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {unassignedToolObjects.map((tool, index) => (
                    <Box 
                      key={tool.id || index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: '8px',
                        bgcolor: alpha(color.main, 0.05),
                        border: `1px solid ${alpha(color.main, 0.2)}`,
                        position: 'relative'
                      }}
                    >
                      {/* 连接线 */}
                      {index > 0 && (
                        <Box sx={{
                          position: 'absolute',
                          top: -8,
                          height: 8,
                          width: 2,
                          bgcolor: alpha(color.main, 0.5),
                          left: 11
                        }} />
                      )}
                      
                      <Box 
                        sx={{ 
                          width: 22, 
                          height: 22,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(color.main, 0.1),
                          color: color.main,
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Box>
                      
                      <Box 
                        sx={{ 
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <ToolOutlined style={{ fontSize: 14 }} />
                        <Typography variant="body2">
                          {tool.name}
                        </Typography>
                      </Box>
                      
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleToolSelection(section, tool.name);
                        }}
                      >
                        <DeleteOutlined style={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            {/* 并行组部分 */}
            {parallelGroups.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.info.main }}>
                  并行执行组
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {parallelGroups.map((group, groupIndex) => {
                    // 获取组内工具对象
                    const groupToolObjects = group.map(toolName => {
                      const foundTool = tools.find(t => t.name === toolName);
                      return foundTool || { id: toolName, name: toolName, description: "工具描述" };
                    });
                    
                    return (
                      <Paper
                        key={groupIndex}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: '8px',
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          borderColor: alpha(theme.palette.info.main, 0.2)
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1
                        }}>
                          <Typography variant="subtitle2" sx={{ color: theme.palette.info.main }}>
                            并行组 {groupIndex + 1}
                          </Typography>
                          <IconButton 
                            size="small"
                            onClick={() => removeParallelGroup(groupIndex)}
                          >
                            <DeleteOutlined style={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap',
                          gap: 1
                        }}>
                          {groupToolObjects.map((tool) => (
                            <Chip
                              key={tool.id || tool.name}
                              label={tool.name}
                              size="small"
                              deleteIcon={<DeleteOutlined style={{ fontSize: 12 }} />}
                              onDelete={() => removeToolFromGroup(groupIndex, tool.name)}
                              sx={{ 
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            )}
            
            {/* 添加工具和管理并行组按钮 */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<PlusOutlined />}
                variant="outlined"
                size="small"
                sx={{ 
                  borderStyle: 'dashed',
                  mt: 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // 显示所有可用工具进行选择
                  const availableTools = tools.filter(tool => !selectedTools.includes(tool.name));
                  if (availableTools.length > 0) {
                    toggleToolSelection(section, availableTools[0].name);
                  }
                }}
              >
                添加工具
              </Button>
              
              <Button
                startIcon={<AppstoreOutlined />}
                variant="outlined"
                size="small"
                color="info"
                sx={{ mt: 1 }}
                onClick={openParallelGroupEditor}
              >
                管理并行组
              </Button>
            </Box>
            
            {/* 并行组配置对话框 */}
            <Dialog 
              open={showParallelGroupEditor} 
              onClose={closeParallelGroupEditor}
              maxWidth="md"
              fullWidth
              onClick={(e) => e.stopPropagation()}
            >
              <DialogTitle sx={{ 
                bgcolor: alpha(theme.palette.info.main, 0.05),
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <AppstoreOutlined style={{ color: theme.palette.info.main }} />
                <Typography variant="h6">
                  管理并行工具组
                </Typography>
              </DialogTitle>
              
              <DialogContent sx={{ p: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* 左侧：组列表 */}
                  <Box sx={{ width: '30%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      并行组列表
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1, maxHeight: 300, overflow: 'auto' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {tempParallelGroups.map((group, index) => (
                          <Box
                            key={index}
                            sx={{ 
                              p: 1, 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              bgcolor: selectedGroup === index ? alpha(theme.palette.info.main, 0.1) : 'transparent',
                              '&:hover': {
                                bgcolor: selectedGroup === index ? alpha(theme.palette.info.main, 0.15) : alpha(theme.palette.info.main, 0.05)
                              }
                            }}
                            onClick={() => setSelectedGroup(index)}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2">
                                并行组 {index + 1} ({group.length}个工具)
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeParallelGroup(index);
                                }}
                              >
                                <DeleteOutlined style={{ fontSize: 12 }} />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                        
                        <Button
                          startIcon={<PlusOutlined />}
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={addNewParallelGroup}
                        >
                          添加并行组
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                  
                  {/* 右侧：组详情 */}
                  <Box sx={{ width: '70%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {selectedGroup !== null ? `编辑并行组 ${selectedGroup + 1}` : '选择左侧并行组进行编辑'}
                    </Typography>
                    
                    {selectedGroup !== null ? (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {/* 当前组内的工具 */}
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              组内工具 (这些工具将并行执行)
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
                              {tempParallelGroups[selectedGroup].length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                  尚未添加工具到此组
                                </Typography>
                              ) : (
                                tempParallelGroups[selectedGroup].map(toolName => (
                                  <Chip
                                    key={toolName}
                                    label={toolName}
                                    size="small"
                                    deleteIcon={<DeleteOutlined style={{ fontSize: 12 }} />}
                                    onDelete={() => removeToolFromGroup(selectedGroup, toolName)}
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.info.main, 0.1),
                                      color: theme.palette.info.main
                                    }}
                                  />
                                ))
                              )}
                            </Box>
                          </Box>
                          
                          <Divider />
                          
                          {/* 可添加的工具 */}
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              可添加到此组的工具
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
                              {getUnassignedTools().length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                  没有可添加的工具
                                </Typography>
                              ) : (
                                getUnassignedTools().map(toolName => (
                                  <Chip
                                    key={toolName}
                                    label={toolName}
                                    size="small"
                                    icon={<PlusOutlined style={{ fontSize: 12 }} />}
                                    variant="outlined"
                                    onClick={() => addToolToGroup(selectedGroup, toolName)}
                                    sx={{ 
                                      borderColor: alpha(theme.palette.info.main, 0.3),
                                      color: theme.palette.info.main
                                    }}
                                  />
                                ))
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ) : (
                      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                        {tempParallelGroups.length === 0 ? (
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              尚未创建任何并行组
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PlusOutlined />}
                              onClick={addNewParallelGroup}
                              sx={{ mt: 1 }}
                            >
                              创建第一个并行组
                            </Button>
                          </Box>
                        ) : (
                          <Typography variant="body2">
                            请选择左侧的并行组进行编辑
                          </Typography>
                        )}
                      </Paper>
                    )}
                  </Box>
                </Box>
              </DialogContent>
              
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={closeParallelGroupEditor}>
                  取消
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={saveParallelGroups}
                >
                  保存配置
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        );
      }
      
      // 串行执行 - 垂直排列
      if (executionStrategy === '串行执行') {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {selectedToolObjects.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                尚未选择工具，请添加工具
              </Typography>
            ) : (
              selectedToolObjects.map((tool, index) => (
                <Box 
                  key={tool.id || index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: '8px',
                    bgcolor: alpha(color.main, 0.05),
                    border: `1px solid ${alpha(color.main, 0.2)}`,
                    position: 'relative'
                  }}
                >
                  {/* 连接线 */}
                  {index > 0 && (
                    <Box sx={{
                      position: 'absolute',
                      top: -8,
                      height: 8,
                      width: 2,
                      bgcolor: alpha(color.main, 0.5),
                      left: 11
                    }} />
                  )}
                  
                  <Box 
                    sx={{ 
                      width: 22, 
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(color.main, 0.1),
                      color: color.main,
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                  
                  <Box 
                    sx={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <ToolOutlined style={{ fontSize: 14 }} />
                    <Typography variant="body2">
                      {tool.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      size="small"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        // 上移工具逻辑
                      }}
                    >
                      <ArrowUpOutlined style={{ fontSize: 12 }} />
                    </IconButton>
                    <IconButton 
                      size="small"
                      disabled={index === selectedToolObjects.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        // 下移工具逻辑
                      }}
                    >
                      <ArrowDownOutlined style={{ fontSize: 12 }} />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleToolSelection(section, tool.name);
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
            
            <Button
              startIcon={<PlusOutlined />}
              variant="outlined"
              size="small"
              sx={{ 
                alignSelf: 'flex-start', 
                borderStyle: 'dashed',
                mt: 1
              }}
              onClick={(e) => {
                e.stopPropagation();
                // 显示所有可用工具进行选择
                const availableTools = tools.filter(tool => !selectedTools.includes(tool.name));
                if (availableTools.length > 0) {
                  toggleToolSelection(section, availableTools[0].name);
                }
              }}
            >
              添加工具
            </Button>
          </Box>
        );
      }
      
      // 并行执行 - 水平排列
      if (executionStrategy === '并行执行') {
        return (
          <Box>
            <Paper
              variant="outlined"
              sx={{ 
                p: 1.5,
                borderColor: alpha(color.main, 0.3),
                bgcolor: alpha(color.main, 0.02),
                borderRadius: '8px'
              }}
            >
              {selectedToolObjects.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  尚未选择工具，请添加工具
                </Typography>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 1.5
                }}>
                  {selectedToolObjects.map((tool) => (
                    <Paper
                      key={tool.id || tool.name}
                      elevation={0}
                      sx={{ 
                        width: 160,
                        p: 1.5,
                        border: `1px solid ${alpha(color.main, 0.2)}`,
                        borderRadius: '8px',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: alpha(color.main, 0.1),
                          color: color.main,
                          mb: 1
                        }}
                      >
                        <ToolOutlined />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tool.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        color="error"
                        sx={{ mt: 'auto', alignSelf: 'flex-end' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleToolSelection(section, tool.name);
                        }}
                      >
                        <DeleteOutlined style={{ fontSize: 14 }} />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              )}
              
              <Box 
                sx={{ 
                  width: 160,
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed',
                  borderColor: alpha(color.main, 0.3),
                  borderRadius: '8px',
                  cursor: 'pointer',
                  mt: selectedToolObjects.length > 0 ? 1.5 : 0,
                  '&:hover': {
                    bgcolor: alpha(color.main, 0.05)
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // 显示所有可用工具进行选择
                  const availableTools = tools.filter(tool => !selectedTools.includes(tool.name));
                  if (availableTools.length > 0) {
                    toggleToolSelection(section, availableTools[0].name);
                  }
                }}
              >
                <PlusOutlined style={{ fontSize: 24, color: alpha(color.main, 0.7) }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(color.main, 0.7),
                    mt: 1
                  }}
                >
                  添加工具
                </Typography>
              </Box>
            </Paper>
          </Box>
        );
      }
      
      // 条件执行 - 基于特定工具执行结果的分支判断
      if (executionStrategy === '条件执行') {
        // 先要有至少一个工具作为条件判断基础
        const noToolsSelected = selectedTools.length === 0;
        
        // 获取当前选定的条件配置
        const conditionConfig = conditionConfigs[section];
        
        // 获取所有可选工具对象
        const allSelectedToolObjects = selectedToolObjects;
        
        // 获取基础工具 - 可以是任意选中的工具，而不是默认第一个
        const baseToolName = conditionConfig.baseToolName || (allSelectedToolObjects.length > 0 ? allSelectedToolObjects[0].name : '');
        const baseTool = allSelectedToolObjects.find(t => t.name === baseToolName) || allSelectedToolObjects[0];
        
        // 其他可选工具（除基础工具外）
        const otherTools = tools.filter(t => baseTool ? t.name !== baseTool.name : true);
        
        return (
          <Box>
            {noToolsSelected ? (
              <Paper
                variant="outlined"
                sx={{ 
                  p: 3,
                  borderColor: alpha(color.main, 0.2),
                  bgcolor: alpha(color.main, 0.02),
                  borderRadius: '12px',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  请先选择至少一个工具作为条件判断的基础
                </Typography>
                <Button 
                  variant="outlined"
                  startIcon={<PlusOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tools.length > 0) {
                      const availableTools = tools.filter(tool => !selectedTools.includes(tool.name));
                      if (availableTools.length > 0) {
                        toggleToolSelection(section, availableTools[0].name);
                      } else if (tools.length > 0) {
                        toggleToolSelection(section, tools[0].name);
                      }
                    }
                  }}
                  sx={{ borderRadius: '8px' }}
                >
                  添加基础工具
                </Button>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 前置工具选择 */}
                <Paper
                  variant="outlined"
                  sx={{ 
                    p: 2,
                    borderColor: alpha(theme.palette.info.main, 0.2),
                    bgcolor: alpha(theme.palette.info.main, 0.02),
                    borderRadius: '12px'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.info.main }}>
                    1. 选择前置工具（条件判断依据）
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {allSelectedToolObjects.map((tool) => (
                      <Chip
                        key={tool.id || tool.name}
                        label={tool.name}
                        variant={baseToolName === tool.name ? "filled" : "outlined"}
                        onClick={(e) => {
                          e.stopPropagation();
                          // 更新条件配置中的基础工具
                          setConditionConfigs(prev => ({
                            ...prev,
                            [section]: {
                              ...prev[section],
                              baseToolName: tool.name
                            }
                          }));
                        }}
                        sx={{
                          bgcolor: baseToolName === tool.name ? alpha(theme.palette.info.main, 0.15) : 'transparent',
                          color: baseToolName === tool.name ? theme.palette.info.main : theme.palette.text.secondary,
                          borderColor: baseToolName === tool.name ? theme.palette.info.main : alpha(theme.palette.divider, 0.3),
                          '&:hover': {
                            bgcolor: baseToolName === tool.name ? alpha(theme.palette.info.main, 0.2) : alpha(theme.palette.info.main, 0.05)
                          }
                        }}
                      />
                    ))}
                  </Box>
                  
                  {baseTool && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: '8px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: theme.palette.info.main,
                            fontSize: '12px'
                          }}
                        >
                          <ToolOutlined style={{ fontSize: 12 }} />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {baseTool.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          - {baseTool.description || '条件判断工具'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
                
                {/* 条件表达式 */}
                <Paper
                  variant="outlined"
                  sx={{ 
                    p: 2,
                    borderColor: alpha(theme.palette.warning.main, 0.2),
                    bgcolor: alpha(theme.palette.warning.main, 0.02),
                    borderRadius: '12px'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.warning.main }}>
                    2. 设置条件判断表达式
                  </Typography>
                  
                  <TextField
                    fullWidth
                    size="small"
                    value={conditionConfig.condition}
                    onChange={(e) => updateCondition(section, e.target.value)}
                    placeholder={`例如: ${baseToolName}.result.score > 0.7`}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BranchesOutlined style={{ color: theme.palette.warning.main, fontSize: 16 }} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    使用 <code style={{ background: alpha(theme.palette.warning.main, 0.1), padding: '2px 4px', borderRadius: '4px' }}>
                      {baseToolName}.result
                    </code> 引用工具执行结果
                  </Typography>
                </Paper>
                
                {/* 分支配置 - 增强版本 */}
                <Paper
                  variant="outlined"
                  sx={{ 
                    p: 2,
                    borderColor: alpha(color.main, 0.2),
                    bgcolor: alpha(color.main, 0.02),
                    borderRadius: '12px'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: color.main }}>
                    3. 配置条件分支
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* 条件满足分支 */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleOutlined style={{ color: theme.palette.success.main, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.success.main }}>
                          条件满足时执行
                        </Typography>
                      </Box>
                      
                      {/* 工具区域 */}
                      <Paper
                        variant="outlined"
                        sx={{ 
                          p: 1.5,
                          borderColor: alpha(theme.palette.success.main, 0.2),
                          bgcolor: alpha(theme.palette.success.main, 0.02),
                          borderRadius: '8px',
                          minHeight: 60,
                          mb: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                          {conditionConfig.trueBranchTools.length === 0 ? (
                            <Typography variant="caption" color="text.secondary">
                              选择工具或默认处理方式
                            </Typography>
                          ) : (
                            conditionConfig.trueBranchTools.map(toolName => (
                              <Chip
                                key={toolName}
                                label={toolName}
                                size="small"
                                deleteIcon={<DeleteOutlined style={{ fontSize: 12 }} />}
                                onDelete={(e) => {
                                  e?.stopPropagation();
                                  updateConditionBranchTools(section, 'true', toolName, false);
                                }}
                                sx={{ 
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  color: theme.palette.success.main
                                }}
                              />
                            ))
                          )}
                        </Box>
                        
                        {/* 智能推荐和默认处理 */}
                        {(() => {
                          const availableTools = otherTools.filter(tool => 
                            !conditionConfig.trueBranchTools.includes(tool.name) &&
                            !conditionConfig.falseBranchTools.includes(tool.name)
                          );
                          const hasOnlyFewTools = allSelectedToolObjects.length <= 2;
                          const showDefaultOptions = conditionConfig.trueBranchTools.length === 0 || hasOnlyFewTools;
                          
                          return showDefaultOptions && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: '6px' }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                {conditionConfig.trueBranchTools.length === 0 ? '推荐选项：' : '额外选项：'}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {/* 可用工具选项 */}
                                {availableTools.map(tool => (
                                  <Chip
                                    key={`true-${tool.id}`}
                                    label={tool.name}
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateConditionBranchTools(section, 'true', tool.name, true);
                                    }}
                                    sx={{
                                      borderColor: alpha(theme.palette.success.main, 0.3),
                                      color: theme.palette.success.main,
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.success.main, 0.1)
                                      }
                                    }}
                                  />
                                ))}
                                
                                {/* 默认处理选项 */}
                                {[
                                  { key: 'continue', label: '继续下一步', icon: '➡️' },
                                  { key: 'success', label: '成功回复', icon: '✅' },
                                  { key: 'custom', label: '自定义消息', icon: '💬' }
                                ].map(option => (
                                  <Chip
                                    key={`true-default-${option.key}`}
                                    label={`${option.icon} ${option.label}`}
                                    size="small"
                                    variant={conditionConfig.trueBranchDefaultAction === option.key ? "filled" : "outlined"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateConditionBranchDefaultAction(section, 'true', option.key);
                                    }}
                                    sx={{
                                      borderColor: alpha(theme.palette.success.main, 0.3),
                                      bgcolor: conditionConfig.trueBranchDefaultAction === option.key ? 
                                        alpha(theme.palette.success.main, 0.15) : 'transparent',
                                      color: theme.palette.success.main,
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.success.main, 0.1)
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                              
                              {/* 自定义消息输入 */}
                              {conditionConfig.trueBranchDefaultAction === 'custom' && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="输入自定义成功消息..."
                                  value={conditionConfig.trueBranchDefaultMessage || ''}
                                  onChange={(e) => updateConditionBranchDefaultAction(section, 'true', 'custom', e.target.value)}
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                          );
                        })()}
                      </Paper>
                    </Box>
                    
                    {/* 条件不满足分支 */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CloseCircleOutlined style={{ color: theme.palette.error.main, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.error.main }}>
                          条件不满足时执行
                        </Typography>
                      </Box>
                      
                      {/* 工具区域 */}
                      <Paper
                        variant="outlined"
                        sx={{ 
                          p: 1.5,
                          borderColor: alpha(theme.palette.error.main, 0.2),
                          bgcolor: alpha(theme.palette.error.main, 0.02),
                          borderRadius: '8px',
                          minHeight: 60,
                          mb: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                          {conditionConfig.falseBranchTools.length === 0 ? (
                            <Typography variant="caption" color="text.secondary">
                              选择工具或默认处理方式
                            </Typography>
                          ) : (
                            conditionConfig.falseBranchTools.map(toolName => (
                              <Chip
                                key={toolName}
                                label={toolName}
                                size="small"
                                deleteIcon={<DeleteOutlined style={{ fontSize: 12 }} />}
                                onDelete={(e) => {
                                  e?.stopPropagation();
                                  updateConditionBranchTools(section, 'false', toolName, false);
                                }}
                                sx={{ 
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main
                                }}
                              />
                            ))
                          )}
                        </Box>
                        
                        {/* 智能推荐和默认处理 */}
                        {(() => {
                          const availableTools = otherTools.filter(tool => 
                            !conditionConfig.trueBranchTools.includes(tool.name) &&
                            !conditionConfig.falseBranchTools.includes(tool.name)
                          );
                          const hasOnlyFewTools = allSelectedToolObjects.length <= 2;
                          const showDefaultOptions = conditionConfig.falseBranchTools.length === 0 || hasOnlyFewTools;
                          
                          return showDefaultOptions && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: '6px' }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                {conditionConfig.falseBranchTools.length === 0 ? '推荐选项：' : '额外选项：'}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {/* 可用工具选项 */}
                                {availableTools.map(tool => (
                                  <Chip
                                    key={`false-${tool.id}`}
                                    label={tool.name}
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateConditionBranchTools(section, 'false', tool.name, true);
                                    }}
                                    sx={{
                                      borderColor: alpha(theme.palette.error.main, 0.3),
                                      color: theme.palette.error.main,
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.error.main, 0.1)
                                      }
                                    }}
                                  />
                                ))}
                                
                                {/* 默认处理选项 */}
                                {[
                                  { key: 'retry', label: '重试执行', icon: '🔄' },
                                  { key: 'fallback', label: '降级处理', icon: '⬇️' },
                                  { key: 'skip', label: '跳过继续', icon: '⏭️' },
                                  { key: 'error', label: '错误回复', icon: '❌' },
                                  { key: 'custom', label: '自定义消息', icon: '💬' }
                                ].map(option => (
                                  <Chip
                                    key={`false-default-${option.key}`}
                                    label={`${option.icon} ${option.label}`}
                                    size="small"
                                    variant={conditionConfig.falseBranchDefaultAction === option.key ? "filled" : "outlined"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateConditionBranchDefaultAction(section, 'false', option.key);
                                    }}
                                    sx={{
                                      borderColor: alpha(theme.palette.error.main, 0.3),
                                      bgcolor: conditionConfig.falseBranchDefaultAction === option.key ? 
                                        alpha(theme.palette.error.main, 0.15) : 'transparent',
                                      color: theme.palette.error.main,
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.error.main, 0.1)
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                              
                              {/* 自定义消息输入 */}
                              {conditionConfig.falseBranchDefaultAction === 'custom' && (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="输入自定义错误消息..."
                                  value={conditionConfig.falseBranchDefaultMessage || ''}
                                  onChange={(e) => updateConditionBranchDefaultAction(section, 'false', 'custom', e.target.value)}
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                          );
                        })()}
                      </Paper>
                    </Box>
                  </Box>
                  
                  {/* 智能提示 */}
                  <Box sx={{ 
                    mt: 2, 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.info.main, 0.05), 
                    borderRadius: '8px',
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                  }}>
                    <Typography variant="caption" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      color: theme.palette.info.main,
                      fontWeight: 600
                    }}>
                      <BulbOutlined style={{ fontSize: 14 }} />
                      智能配置建议
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {allSelectedToolObjects.length === 1 && 
                        "单工具模式：建议为两个分支选择不同的默认处理方式"
                      }
                      {allSelectedToolObjects.length === 2 && 
                        "双工具模式：可将工具分配到不同分支，或选择默认处理方式"
                      }
                      {allSelectedToolObjects.length >= 3 && 
                        "多工具模式：灵活分配工具到不同分支，实现复杂条件逻辑"
                      }
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        );
      }
      
      // 默认显示方式（兼容旧版本）
      return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tools.map((tool) => (
            <Chip
              key={tool.id}
              label={tool.name}
              size="small"
              icon={<ToolOutlined style={{ fontSize: 10 }} />}
              variant={selectedTools.includes(tool.name) ? "filled" : "outlined"}
              sx={{
                bgcolor: selectedTools.includes(tool.name) ? alpha(color.main, 0.1) : 'transparent',
                color: selectedTools.includes(tool.name) ? color.main : theme.palette.text.secondary,
                borderColor: selectedTools.includes(tool.name) ? 'transparent' : alpha(theme.palette.divider, 0.3),
                '&:hover': {
                  bgcolor: selectedTools.includes(tool.name) ? alpha(color.main, 0.15) : alpha(theme.palette.divider, 0.1)
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleToolSelection(section, tool.name);
              }}
            />
          ))}
        </Box>
      );
    };
    
    return (
      <Box
        sx={{
          mb: 2,
          borderRadius: '16px',
          overflow: 'hidden',
          background: enabled ? bgGradient : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          border: `1px solid ${alpha(color.main, enabled ? 0.15 : 0.08)}`,
          transition: 'all 0.3s ease',
          position: 'relative',
          opacity: enabled ? 1 : 0.7,
          boxShadow: expanded ? `0 8px 25px ${alpha(color.main, 0.15)}` : `0 2px 8px ${alpha(color.main, 0.08)}`
        }}
      >
        {/* 简化连接线 */}
        {order > 1 && (
          <Box sx={{
            position: 'absolute',
            top: '-12px',
            height: '12px',
            width: '2px',
            bgcolor: alpha(color.main, 0.3),
            left: '24px',
            zIndex: 0
          }} />
        )}
        
        {/* 简化的头部 */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            borderBottom: expanded ? `1px solid ${alpha(color.main, 0.1)}` : 'none',
            '&:hover': {
              bgcolor: alpha(color.main, 0.05)
            }
          }}
          onClick={onToggleExpand}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* 简化的序号 */}
            <Box 
              sx={{ 
                width: 28, 
                height: 28, 
                borderRadius: '8px', 
                bgcolor: alpha(color.main, 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: color.main
              }}
            >
              {order}
            </Box>
            
            <Avatar sx={{ bgcolor: color.main, width: 32, height: 32 }}>
              {icon}
            </Avatar>
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: color.dark, fontSize: '1rem' }}>
                {title}
                {!enabled && (
                  <Chip
                    label="已禁用"
                    size="small"
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: 'error.main',
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                {selectedTools.length > 0 && (
                  <Chip
                    size="small"
                    label={`${selectedTools.length} 工具`}
                    sx={{ 
                      height: 18, 
                      fontSize: '0.7rem',
                      bgcolor: alpha(color.main, 0.1),
                      color: color.main
                    }}
                  />
                )}
                
                {selectedKnowledgeBases.length > 0 && (
                  <Chip
                    size="small"
                    label={`${selectedKnowledgeBases.length} 知识库`}
                    sx={{ 
                      height: 18, 
                      fontSize: '0.7rem',
                      bgcolor: alpha(color.light, 0.15),
                      color: color.dark
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 简化的移动按钮 */}
            <IconButton
              size="small"
              sx={{ 
                bgcolor: alpha(color.main, 0.08),
                color: color.main,
                width: 28,
                height: 28,
                '&:hover': { bgcolor: alpha(color.main, 0.15) }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
            >
              <ArrowUpOutlined style={{ fontSize: 14 }} />
            </IconButton>
            
            <IconButton
              size="small"
              sx={{ 
                bgcolor: alpha(color.main, 0.08),
                color: color.main,
                width: 28,
                height: 28,
                '&:hover': { bgcolor: alpha(color.main, 0.15) }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
            >
              <ArrowDownOutlined style={{ fontSize: 14 }} />
            </IconButton>
            
            {/* 展开/收起按钮 */}
            <IconButton
              size="small"
              sx={{ 
                bgcolor: alpha(color.main, 0.1),
                color: color.main,
                width: 28,
                height: 28,
                transition: 'transform 0.2s ease'
              }}
            >
              {expanded ? <UpOutlined style={{ fontSize: 14 }} /> : <DownOutlined style={{ fontSize: 14 }} />}
            </IconButton>
            
            {/* 开关 */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Typography variant="caption" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                {enabled ? '启用' : '禁用'}
              </Typography>
              <Switch
                size="small"
                checked={enabled}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleEnabled();
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.success.main,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.success.main,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        
        {/* 层级内容区域 */}
        <Collapse in={expanded}>
          <Box sx={{ p: 2, position: 'relative' }}>
            {/* 禁用时的遮罩层 */}
            {!enabled && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(1px)'
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    borderRadius: 2,
                    maxWidth: 300,
                    textAlign: 'center'
                  }}
                >
                  <CloseCircleOutlined style={{ fontSize: 40, color: theme.palette.error.main, marginBottom: 8 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    此模块已禁用
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    该模块中的工具和知识库将不会被执行
                  </Typography>
                  
                  {/* 添加切换开关 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1, color: alpha(theme.palette.error.main, 0.8) }}>
                      禁用
                    </Typography>
                    <Switch
                      checked={enabled}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleEnabled();
                      }}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: theme.palette.success.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: theme.palette.success.main,
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: theme.palette.success.main }}>
                      启用
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            {/* 配置选项 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: color.dark }}>
                执行策略
              </Typography>
              {!shouldShowExecutionStrategy ? (
                <Typography variant="body2" color="text.secondary">
                  只有一个工具，将直接执行
                </Typography>
              ) : (
                <>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['串行执行', '并行执行', '条件执行', '混合执行'].map((strategy) => (
                      <Chip
                        key={strategy}
                        label={strategy}
                        size="small"
                        variant={executionStrategy === strategy ? "filled" : "outlined"}
                        sx={{
                          bgcolor: executionStrategy === strategy ? alpha(color.main, 0.1) : 'transparent',
                          color: executionStrategy === strategy ? color.main : theme.palette.text.secondary,
                          borderColor: executionStrategy === strategy ? 'transparent' : alpha(theme.palette.divider, 0.3),
                          '&:hover': {
                            bgcolor: executionStrategy === strategy ? alpha(color.main, 0.15) : alpha(theme.palette.divider, 0.1)
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onExecutionStrategyChange(strategy);
                        }}
                      />
                    ))}
                  </Box>
                  
                  {/* 添加混合执行模式的配置选项 */}
                  {executionStrategy === '混合执行' && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          配置并行工具组
                        </Typography>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<AppstoreOutlined />}
                          onClick={openParallelGroupEditor}
                        >
                          管理并行组
                        </Button>
                      </Box>
                      
                      {parallelGroups.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {parallelGroups.map((group, index) => (
                            <Paper
                              key={index}
                              variant="outlined"
                              sx={{
                                p: 1,
                                borderRadius: '8px',
                                bgcolor: alpha(theme.palette.info.main, 0.05),
                                borderColor: alpha(theme.palette.info.main, 0.2)
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                                  并行组 {index + 1}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {group.map(toolName => (
                                  <Chip
                                    key={toolName}
                                    label={toolName}
                                    size="small"
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.info.main, 0.1),
                                      color: theme.palette.info.main
                                    }}
                                  />
                                ))}
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, py: 1 }}>
                          尚未配置并行工具组，所有工具将串行执行
                        </Typography>
                      )}
                    </Box>
                  )}
                </>
              )}
            </Box>
            
            {/* 工具选择区 - 添加序号和拖拽功能 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: color.dark }}>
                可用工具 {(() => {
                  switch(executionStrategy) {
                    case '串行执行': return '(按执行顺序)';
                    case '并行执行': return '(同时执行)';
                    case '条件执行': return '(条件分支执行)';
                    case '混合执行': return '(混合模式)';
                    default: return '';
                  }
                })()}
              </Typography>
              {renderTools(tools, selectedTools, section, executionStrategy, color)}
            </Box>
            
            {/* 知识库选择 - 添加序号和拖拽功能 */}
            {knowledgeBases.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: color.dark }}>
                  可用知识库 (按优先级)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {knowledgeBases.map((kb, index) => (
                    <Box 
                      key={kb.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: '8px',
                        bgcolor: selectedKnowledgeBases.includes(kb.name) ? alpha(color.light, 0.1) : 'transparent',
                        border: `1px solid ${selectedKnowledgeBases.includes(kb.name) ? alpha(color.light, 0.3) : alpha(theme.palette.divider, 0.2)}`,
                        '&:hover': {
                          bgcolor: selectedKnowledgeBases.includes(kb.name) ? alpha(color.light, 0.15) : alpha(theme.palette.divider, 0.05)
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 22, 
                          height: 22,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: selectedKnowledgeBases.includes(kb.name) ? alpha(color.light, 0.2) : alpha(theme.palette.divider, 0.1),
                          color: selectedKnowledgeBases.includes(kb.name) ? color.dark : theme.palette.text.secondary,
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Box>
                      
                      <MenuOutlined style={{ fontSize: 14, color: alpha(theme.palette.text.secondary, 0.5) }} />
                      
                      <Box 
                        sx={{ 
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleKBSelection(section, kb.name)}
                      >
                        <DatabaseOutlined style={{ fontSize: 14 }} />
                        <Typography variant="body2">
                          {kb.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small">
                          <ArrowUpOutlined style={{ fontSize: 12 }} />
                        </IconButton>
                        <IconButton size="small">
                          <ArrowDownOutlined style={{ fontSize: 12 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            {/* 高级配置 */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: color.dark }}>
                高级配置
              </Typography>
              
              <Paper
                variant="outlined"
                sx={{ 
                  p: 1.5, 
                  borderRadius: '8px',
                  borderColor: alpha(color.main, 0.2),
                  bgcolor: alpha(color.main, 0.02)
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    超时时间
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: color.dark }}>
                    30秒
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    重试次数
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: color.dark }}>
                    2次
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  };
  
  return (
    <Box
      sx={{
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* 内容区域 - 添加完整圆角背景样式 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 3, 
        pt: 5,
        m: 2,
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        {/* 根据排序渲染模块卡片 */}
        {getSortedModules().map(({ key, config }) => {
          const moduleInfo = {
            'informationRetrieval': {
              title: '信息获取',
              icon: <SearchOutlined />,
              color: theme.palette.primary,
              bgGradient: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
            },
            'contentProcessing': {
              title: '内容处理',
              icon: <FileTextOutlined />,
              color: theme.palette.success,
              bgGradient: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)'
            },
            'dataAnalysis': {
              title: '数据分析与推理',
              icon: <CalculatorOutlined />,
              color: theme.palette.warning,
              bgGradient: 'linear-gradient(135deg, #fff3e0 0%, #fef7e0 100%)'
            },
            'outputGeneration': {
              title: '输出生成',
              icon: <BulbOutlined />,
              color: theme.palette.secondary,
              bgGradient: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)'
            }
          }[key];
          
          // 确保moduleInfo一定存在，防止类型错误
          if (!moduleInfo) return null;
          
          return (
            <NestedLayerCard
              key={key}
              title={moduleInfo.title}
              icon={moduleInfo.icon}
              color={moduleInfo.color}
              bgGradient={moduleInfo.bgGradient}
              expanded={expandedSections[key]}
              onToggleExpand={() => toggleSectionExpanded(key)}
              tools={selectedTools}
              knowledgeBases={selectedKnowledgeBases}
              selectedTools={config.tools}
              selectedKnowledgeBases={config.knowledgeBases}
              section={key}
              order={config.order}
              onMoveUp={() => moveModuleOrder(key, 'up')}
              onMoveDown={() => moveModuleOrder(key, 'down')}
              executionStrategy={config.executionStrategy}
              onExecutionStrategyChange={(strategy) => updateExecutionStrategy(key, strategy)}
              onUpdateParallelGroups={(groups) => updateParallelGroups(key, groups)}
              parallelGroups={config.parallelGroups || []}
              enabled={config.enabled}
              onToggleEnabled={() => toggleModuleEnabled(key)}
            />
          );
        })}

        {/* 添加层级按钮 */}
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative'
        }}>
          <Button
            variant="outlined"
            startIcon={<PlusOutlined />}
            onClick={addNewLayer}
            sx={{
              borderStyle: 'dashed',
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: theme.palette.primary.main,
              borderRadius: '12px',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.04)
              }
            }}
          >
            添加功能层级
          </Button>
          
          {/* 简化的连接线 */}
          {getSortedModules().length > 0 && (
            <Box sx={{
              position: 'absolute',
              top: '-16px',
              height: '16px',
              width: '2px',
              bgcolor: alpha(theme.palette.primary.main, 0.3),
              left: '50%',
              transform: 'translateX(-50%)'
            }} />
          )}
        </Box>
      </Box>
      
      {/* 底部操作栏 - 添加圆角样式 */}
      <Box sx={{ 
        p: 2, 
        m: 2,
        mt: 1,
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowRightOutlined style={{ transform: 'rotate(180deg)' }} />}
          sx={{ borderRadius: '10px' }}
        >
          上一步
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<NodeIndexOutlined />}
            label={`${Object.values(modulesConfig).filter(config => config.enabled).length}/${Object.keys(modulesConfig).length}个功能层级`}
            variant="outlined"
            size="small"
            sx={{ borderColor: alpha(theme.palette.primary.main, 0.3), color: theme.palette.primary.main }}
          />
          <Chip
            icon={<ToolOutlined />}
            label={`${Object.values(modulesConfig).filter(config => config.enabled).flatMap(config => config.tools).length}个工具`}
            variant="outlined"
            size="small"
            sx={{ borderColor: alpha(theme.palette.success.main, 0.3), color: theme.palette.success.main }}
          />
          <Chip
            icon={<DatabaseOutlined />}
            label={`${Object.values(modulesConfig).filter(config => config.enabled).flatMap(config => config.knowledgeBases).length}个知识库`}
            variant="outlined"
            size="small"
            sx={{ borderColor: alpha(theme.palette.warning.main, 0.3), color: theme.palette.warning.main }}
          />
          
          {/* 流程预览按钮 */}
          <Tooltip title="查看执行流程">
            <Button
              variant="outlined"
              size="small"
              startIcon={<EyeOutlined />}
              onClick={toggleFlowPreview}
              sx={{ 
                ml: 1,
                borderColor: alpha(theme.palette.info.main, 0.3), 
                color: theme.palette.info.main,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  borderColor: theme.palette.info.main
                }
              }}
            >
              流程预览
            </Button>
          </Tooltip>
        </Box>
        
        <Button
          variant="contained"
          onClick={handleComplete}
          endIcon={<CheckCircleOutlined />}
          sx={{
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.85)})`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`
            }
          }}
        >
          完成编排
        </Button>
      </Box>
      
      {/* 流程预览对话框 */}
      <Dialog 
        open={showFlowPreview} 
        onClose={toggleFlowPreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)}, ${alpha(theme.palette.secondary.main, 0.04)})`,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <EyeOutlined style={{ fontSize: 20, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            工作流执行流程预览
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, minHeight: 400 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              模块执行顺序
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {getSortedModules()
                  .filter(({ config }) => config.enabled)
                  .map(({ key, config }, index) => {
                  const moduleInfo = {
                    'informationRetrieval': {
                      title: '信息获取',
                      icon: <SearchOutlined />,
                      color: theme.palette.primary
                    },
                    'contentProcessing': {
                      title: '内容处理',
                      icon: <FileTextOutlined />,
                      color: theme.palette.success
                    },
                    'dataAnalysis': {
                      title: '数据分析与推理',
                      icon: <CalculatorOutlined />,
                      color: theme.palette.warning
                    },
                    'outputGeneration': {
                      title: '输出生成',
                      icon: <BulbOutlined />,
                      color: theme.palette.secondary
                    }
                  }[key];
                  
                  if (!moduleInfo) return null;
                  
                  return (
                    <Box 
                      key={key}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: alpha(moduleInfo.color.main, 0.05),
                        border: `1px solid ${alpha(moduleInfo.color.main, 0.2)}`,
                        position: 'relative'
                      }}
                    >
                      {/* 连接线 */}
                      {index > 0 && (
                        <Box sx={{
                          position: 'absolute',
                          top: -10,
                          height: 10,
                          width: 2,
                          bgcolor: alpha(theme.palette.divider, 0.5),
                          left: 18
                        }} />
                      )}
                      
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: moduleInfo.color.main,
                          mr: 2
                        }}
                      >
                        {moduleInfo.icon}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {index + 1}. {moduleInfo.title}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={config.executionStrategy}
                            sx={{ 
                              bgcolor: alpha(moduleInfo.color.main, 0.1),
                              color: moduleInfo.color.main
                            }} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {config.tools.map((tool, idx) => (
                            <Chip
                              key={`${tool}-${idx}`}
                              size="small"
                              label={`${idx+1}. ${tool}`}
                              icon={<ToolOutlined style={{ fontSize: 10 }} />}
                              sx={{ 
                                bgcolor: 'transparent',
                                border: `1px solid ${alpha(moduleInfo.color.main, 0.3)}`,
                                color: moduleInfo.color.dark
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            执行配置摘要
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  总执行模块数
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {Object.values(modulesConfig).filter(config => config.enabled).length}个
                  {Object.values(modulesConfig).filter(config => !config.enabled).length > 0 && (
                    <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                      (已禁用 {Object.values(modulesConfig).filter(config => !config.enabled).length}个)
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  总工具数
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {Object.values(modulesConfig).filter(config => config.enabled).flatMap(config => config.tools).length}个
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  总知识库数
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {Object.values(modulesConfig).filter(config => config.enabled).flatMap(config => config.knowledgeBases).length}个
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  执行策略
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  模块级串行执行
                </Typography>
              </Box>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Button 
            onClick={toggleFlowPreview}
            sx={{ borderRadius: '10px' }}
          >
            关闭
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleComplete}
            sx={{ borderRadius: '10px' }}
          >
            确认并完成编排
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NestedCardOrchestration; 