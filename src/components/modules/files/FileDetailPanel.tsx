import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Tag, BarChart, AlertCircle, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { TabsContainer, TabButton } from '../../ui/Tabs';
import ForceGraph2D from 'react-force-graph-2d';
import ChunkAdjustDialog from './ChunkAdjustDialog';

interface FileDetailPanelProps {
  file: {
    id?: string | null;
    name: string;
    type?: string;
    size: number | string;
    date?: string;
    path?: string;
  };
  onClose: () => void;
  fileStatus?: string;
  onStartVectorize?: (fileId: string) => void;
  onPauseVectorize?: (fileId: string) => void;
  onToggleSettings?: (fileId: string) => void;
}

interface Keyword {
  keyword: string;
  relevance: number;
}

const FileDetailPanel: React.FC<FileDetailPanelProps> = ({
  file,
  onClose,
  fileStatus = 'pending',
  onStartVectorize,
  onPauseVectorize,
  onToggleSettings
}) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [isChunkDialogOpen, setIsChunkDialogOpen] = useState<boolean>(false);

  const handleClose = () => {
    onClose();
  };

  // 计算文件大小（以KB为单位）
  const getFileSizeInKB = (sizeInBytes: number | string | undefined): string => {
    if (sizeInBytes === undefined) return '0 KB';
    
    // 如果是字符串，尝试转换为数字
    const bytes = typeof sizeInBytes === 'string' ? parseFloat(sizeInBytes) : sizeInBytes;
    
    // 如果转换失败或不是有效数字，返回原始字符串或默认值
    if (isNaN(bytes)) return typeof sizeInBytes === 'string' ? sizeInBytes : '0 KB';
    
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  // 示例关键词数据
  const [keywords] = useState<Keyword[]>([
    { keyword: '人工智能', relevance: 0.95 },
    { keyword: '机器学习', relevance: 0.88 },
    { keyword: '深度学习', relevance: 0.82 },
    { keyword: '神经网络', relevance: 0.75 },
    { keyword: '自然语言处理', relevance: 0.70 },
    { keyword: '计算机视觉', relevance: 0.65 },
    { keyword: '数据科学', relevance: 0.60 },
    { keyword: '强化学习', relevance: 0.55 },
  ]);

  // 准备关键词图谱数据
  const prepareGraphData = () => {
    // 生成随机颜色
    const generateColors = () => {
      const colors = [
        '#3b82f6', // blue-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500
        '#6366f1', // indigo-500
        '#ef4444', // red-500
        '#f97316', // orange-500
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // 创建节点和连接
    const nodes = [];
    const links = [];
    
    // 添加主节点（文件名）
    nodes.push({
      id: 'file',
      name: file.name,
      val: 10,
      color: '#3b82f6',
    });
    
    // 添加关键词节点和连接
    keywords.forEach((keyword: Keyword) => {
      // 添加关键词节点
      nodes.push({
        id: keyword.keyword,
        name: keyword.keyword,
        val: 5 + keyword.relevance * 3, // 根据相关性调整节点大小
        color: generateColors(),
      });
      
      // 添加连接到主节点
      links.push({
        source: 'file',
        target: keyword.keyword,
        value: keyword.relevance,
        color: keyword.relevance > 0.8 ? '#3b82f6' : 
               keyword.relevance > 0.6 ? '#8b5cf6' : '#ec4899',
      });
    });
    
    // 添加关键词之间的连接
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        // 随机决定是否添加连接
        if (Math.random() > 0.7) {
          const value = Math.random() * 0.5;
          links.push({
            source: keywords[i].keyword,
            target: keywords[j].keyword,
            value: value,
            color: 'rgba(203, 213, 225, 0.5)', // 浅灰色
          });
        }
      }
    }

    return { nodes, links };
  };

  const graphData = prepareGraphData();
  
  // 模拟分块数据
  const [chunks, setChunks] = useState([
    {
      id: 'chunk-1',
      content: '这是第一个分块的内容，包含了文档的开头部分。这部分内容主要介绍了文档的背景和目的。',
      tokens: 42,
      index: 0
    },
    {
      id: 'chunk-2',
      content: '第二个分块包含了文档的主要内容部分，详细描述了相关的技术细节和实现方法。这部分是文档的核心内容。',
      tokens: 48,
      index: 1
    },
    {
      id: 'chunk-3',
      content: '最后一个分块总结了文档的主要观点，并提出了一些建议和未来的发展方向。',
      tokens: 36,
      index: 2
    }
  ]);

  // 处理分块更新
  const handleChunkUpdate = (updatedChunks: typeof chunks) => {
    setChunks(updatedChunks);
    // 这里可以添加保存到服务器的逻辑
  };

  // 文件状态处理函数
  const handleStartVectorize = () => {
    if (file.id && onStartVectorize) {
      onStartVectorize(file.id);
    }
  };

  const handlePauseVectorize = () => {
    if (file.id && onPauseVectorize) {
      onPauseVectorize(file.id);
    }
  };

  const handleToggleSettings = () => {
    if (file.id && onToggleSettings) {
      onToggleSettings(file.id);
    }
  };

  // 状态颜色和文本
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'processing':
        return 'bg-green-500 animate-pulse';
      case 'completed':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      case 'paused':
        return 'bg-amber-500';
      case 'pending':
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status?: string): string => {
    switch (status) {
      case 'processing':
        return '正在向量化';
      case 'completed':
        return '向量化完成';
      case 'error':
        return '向量化错误';
      case 'paused':
        return '向量化暂停';
      case 'pending':
      default:
        return '等待向量化';
    }
  };

  // 生成头部渐变颜色
  const getHeaderGradient = () => {
    // 颜色组合
    const gradients = [
      'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50',  // 蓝紫粉渐变
      'bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50',   // 绿青蓝渐变
      'bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50', // 橙红渐变
      'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50', // 靛紫粉渐变
      'bg-gradient-to-r from-violet-50 via-fuchsia-50 to-rose-50', // 紫红渐变
    ];
    
    // 根据文件名长度选择渐变颜色
    const index = file.name.length % gradients.length;
    return gradients[index];
  };

  return (
    <>
      <motion.div 
        className="bg-white h-full flex flex-col"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className={`p-4 ${getHeaderGradient()} border-b border-gray-200 flex justify-between items-center`}>
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-0.5">{file.name}</h2>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="mr-3">{file.type || '未知类型'}</span>
              <span className="mr-3">{getFileSizeInKB(file.size)}</span>
              <span>{file.date || '未知日期'}</span>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 状态栏 */}
        <div className="bg-white px-4 py-2 flex justify-between items-center border-b border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${getStatusColor(fileStatus)}`}></div>
            <span className="text-sm font-medium">{getStatusText(fileStatus)}</span>
          </div>
          
          <div className="flex space-x-2">
            {fileStatus === 'pending' && (
              <Button 
                onClick={handleStartVectorize}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
                size="sm"
              >
                开始向量化
              </Button>
            )}
            {fileStatus === 'processing' && (
              <Button 
                onClick={handlePauseVectorize}
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                size="sm"
              >
                暂停向量化
              </Button>
            )}
            <Button 
              onClick={handleToggleSettings}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              size="sm"
            >
              向量化设置
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 shadow-sm py-3">
          <div className="flex justify-center">
            <TabsContainer className="bg-gray-100 p-1 rounded-lg border border-gray-200">
              <TabButton 
                active={activeTab === 'basic'} 
                onClick={() => setActiveTab('basic')}
                className={`${activeTab === 'basic' ? 'bg-white text-blue-600 border-blue-200 shadow-sm' : 'text-gray-600 hover:text-blue-500'} transition-colors duration-200 rounded-md`}
              >
                <FileText className="h-4 w-4 mr-2" />
                基础信息
              </TabButton>
              <TabButton 
                active={activeTab === 'keywords'} 
                onClick={() => setActiveTab('keywords')}
                className={`${activeTab === 'keywords' ? 'bg-white text-purple-600 border-purple-200 shadow-sm' : 'text-gray-600 hover:text-purple-500'} transition-colors duration-200 rounded-md`}
              >
                <Tag className="h-4 w-4 mr-2" />
                关键词关联
              </TabButton>
              <TabButton 
                active={activeTab === 'vector'} 
                onClick={() => setActiveTab('vector')}
                className={`${activeTab === 'vector' ? 'bg-white text-indigo-600 border-indigo-200 shadow-sm' : 'text-gray-600 hover:text-indigo-500'} transition-colors duration-200 rounded-md`}
              >
                <BarChart className="h-4 w-4 mr-2" />
                向量化信息
              </TabButton>
            </TabsContainer>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {/* 基础信息 */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-2 gap-6">
                {/* File Information */}
                <div className="space-y-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-emerald-500" />
                    文件信息
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">文件名</span>
                      <span className="font-medium bg-gray-50 px-3 py-1 rounded-lg text-gray-800">{file.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">类型</span>
                      <span className="font-medium bg-gray-50 px-3 py-1 rounded-lg text-gray-800">{file.type || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">大小</span>
                      <span className="font-medium bg-gray-50 px-3 py-1 rounded-lg text-gray-800">{getFileSizeInKB(file.size)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">创建日期</span>
                      <span className="font-medium bg-gray-50 px-3 py-1 rounded-lg text-gray-800">{file.date || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">路径</span>
                      <span className="font-medium bg-gray-50 px-3 py-1 rounded-lg text-gray-800 truncate max-w-xs">{file.path || '-'}</span>
                    </div>
                  </div>
                  
                  {/* 文件统计信息 */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-teal-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-teal-600">24</div>
                      <div className="text-xs text-teal-700 mt-1">段落数量</div>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-600">7</div>
                      <div className="text-xs text-cyan-700 mt-1">引用数量</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-600">89%</div>
                      <div className="text-xs text-emerald-700 mt-1">相关度</div>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-teal-500" />
                    状态信息
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">当前状态</span>
                      <span className="font-medium">
                        {fileStatus === 'completed' && <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg">已完成</span>}
                        {fileStatus === 'processing' && <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">处理中</span>}
                        {fileStatus === 'pending' && <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-lg">待处理</span>}
                        {fileStatus === 'failed' && <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg">失败</span>}
                        {!fileStatus && <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg">未知</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">更新时间</span>
                      <span className="font-medium bg-gray-50 px-3 py-1 rounded-lg text-gray-800">2025-03-20 15:30</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">文件版本</span>
                      <span className="font-medium bg-gray-50 px-3 py-1 rounded-lg text-gray-800">v1.2.0</span>
                    </div>
                  </div>
                  
                  {/* 文件使用统计 */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-teal-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-teal-600">24</div>
                      <div className="text-xs text-teal-700 mt-1">搜索次数</div>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-600">7</div>
                      <div className="text-xs text-cyan-700 mt-1">访问次数</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-600">89%</div>
                      <div className="text-xs text-emerald-700 mt-1">相关度</div>
                    </div>
                  </div>
                </div>

                {/* Personnel Information */}
                <div className="space-y-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 mt-6">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    关联人员
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">上传者</span>
                      <span className="font-medium flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs mr-2">ZL</span>
                        Zhang Lei
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">最近修改者</span>
                      <span className="font-medium flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs mr-2">WX</span>
                        Wang Xin
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-500">审批人员</span>
                      <span className="font-medium flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs mr-2">LJ</span>
                        Li Jun
                      </span>
                    </div>
                  </div>
                  
                  {/* 文件历史 */}
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">文件历史</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs mr-2">YT</span>
                          <span>Yang Tao</span>
                        </div>
                        <span className="text-gray-500 text-xs">2025-03-20 12:45</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs mr-2">CL</span>
                          <span>Chen Li</span>
                        </div>
                        <span className="text-gray-500 text-xs">2025-03-19 16:30</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs mr-2">ZL</span>
                          <span>Zhang Lei</span>
                        </div>
                        <span className="text-gray-500 text-xs">2025-03-18 09:15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 关键词关联 */}
            {activeTab === 'keywords' && (
              <div>
                {/* 关键词图谱 */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    关键词图谱
                  </h3>
                  <div className="h-[300px] border border-gray-100 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {/* 图谱组件 */}
                    {graphData && graphData.nodes && graphData.nodes.length > 0 ? (
                      <ForceGraph2D
                        graphData={graphData}
                        nodeLabel="name"
                        nodeCanvasObject={(node, ctx, globalScale) => {
                          const label = node.name || '';
                          const fontSize = 12/globalScale;
                          ctx.font = `${fontSize}px Sans-Serif`;
                          const textWidth = ctx.measureText(label).width;
                          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
                          
                          // 绘制节点
                          ctx.fillStyle = node.color || '#9ca3af';
                          ctx.beginPath();
                          const nodeX = node.x || 0;
                          const nodeY = node.y || 0;
                          const nodeVal = node.val || 5;
                          ctx.arc(nodeX, nodeY, nodeVal, 0, 2 * Math.PI);
                          ctx.fill();
                          
                          // 如果是选中的关键词，绘制边框
                          if (selectedKeyword === node.id) {
                            ctx.strokeStyle = '#6d28d9';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(nodeX, nodeY, nodeVal + 2, 0, 2 * Math.PI);
                            ctx.stroke();
                          }
                          
                          // 绘制文本背景
                          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                          ctx.fillRect(
                            nodeX - bckgDimensions[0] / 2,
                            nodeY - bckgDimensions[1] / 2 - fontSize,
                            bckgDimensions[0],
                            bckgDimensions[1]
                          );
                          
                          // 绘制文本
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillStyle = '#1f2937';
                          ctx.fillText(label, nodeX, nodeY - fontSize / 2);
                        }}
                        nodeRelSize={6}
                        linkWidth={2}
                        linkColor={(link) => link.color || '#e5e7eb'}
                        cooldownTicks={100}
                        onNodeClick={(node) => {
                          setSelectedKeyword(node.id === selectedKeyword ? null : node.id);
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span>暂无关键词图谱数据</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 关键词列表 */}
                <div className="grid grid-cols-1 gap-3 mt-6">
                  {keywords.length > 0 ? (
                    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-purple-500" />
                        关键词关联
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword: Keyword, index: number) => {
                          // 为每个关键词生成不同的颜色
                          const keywordColors = [
                            { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', hover: 'hover:bg-purple-200' },
                            { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', hover: 'hover:bg-blue-200' },
                            { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', hover: 'hover:bg-green-200' },
                            { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', hover: 'hover:bg-amber-200' },
                            { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', hover: 'hover:bg-pink-200' },
                            { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', hover: 'hover:bg-indigo-200' },
                            { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200', hover: 'hover:bg-teal-200' },
                          ];
                          const colorIndex = index % keywordColors.length;
                          const color = keywordColors[colorIndex];
                          
                          const relevanceClass = keyword.relevance > 0.7 ? 'font-semibold' : keyword.relevance > 0.4 ? 'font-medium' : 'font-normal';
                          
                          return (
                            <div 
                              key={index}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${color.bg} ${color.text} ${color.hover} ${selectedKeyword === keyword.keyword ? 'ring-2 ring-offset-1 ' + color.border : ''} ${relevanceClass}`}
                              onClick={() => setSelectedKeyword(selectedKeyword === keyword.keyword ? null : keyword.keyword)}
                            >
                              {keyword.keyword}
                              <span className="ml-1.5 bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full text-xs">
                                {(keyword.relevance * 100).toFixed(0)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-lg border border-gray-100 text-center">
                      <Tag className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">暂无关键词数据</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 向量化信息 */}
            {activeTab === 'vector' && (
              <div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    向量化参数
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">向量模型</div>
                      <div className="font-medium text-gray-800">OpenAI Ada 002</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">向量维度</div>
                      <div className="font-medium text-gray-800">1536</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">分块数量</div>
                      <div className="font-medium text-gray-800">{chunks.length}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">分块策略</div>
                      <div className="font-medium text-gray-800">按段落+重叠</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">分块大小</div>
                      <div className="font-medium text-gray-800">1000 tokens</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">重叠大小</div>
                      <div className="font-medium text-gray-800">200 tokens</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      分块内容
                    </h3>
                    <Button 
                      variant="secondary" 
                      onClick={() => setIsChunkDialogOpen(true)}
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    >
                      调整分块
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {chunks.map((chunk, index) => (
                      <div key={chunk.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-emerald-600">分块 {index + 1}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{chunk.tokens} tokens</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {chunk.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      {isChunkDialogOpen && (
        <ChunkAdjustDialog 
          isOpen={isChunkDialogOpen}
          onClose={() => setIsChunkDialogOpen(false)}
          initialChunks={chunks}
          onSave={handleChunkUpdate}
        />
      )}
    </>
  );
};

export default FileDetailPanel;
