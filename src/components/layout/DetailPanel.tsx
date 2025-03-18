import React, { useState, useEffect } from 'react';
import { Share2, Download, X, Info, PlusCircle, Tag, Search, Pencil, Trash } from 'lucide-react';
import { DetailPanelProps } from '../../utils/types';
import ForceGraph2D from 'react-force-graph-2d';

const PencilIcon = Pencil;
const TrashIcon = Trash;

// Define types for graph data
interface GraphNode {
  id: string;
  name: string;
  group: number;
  val: number;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const DetailPanel: React.FC<DetailPanelProps> = ({ selectedItem, setSelectedItem, activeSection }) => {
    const [activeTab, setActiveTab] = useState('基本信息');

    // 当activeSection变化时重置activeTab
    useEffect(() => {
        setActiveTab('基本信息');
    }, [activeSection]);

    if (!selectedItem) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center p-6">
                    <Info size={48} className="mx-auto mb-4" />
                    <p className="text-lg">选择一个项目查看详细信息</p>
                </div>
            </div>
        );
    }

    const getTypeDisplay = (): string => {
        if ('type' in selectedItem && selectedItem.type) {
            return selectedItem.type.toUpperCase();
        } else if ('category' in selectedItem && selectedItem.category) {
            return selectedItem.category;
        } else {
            return '未分类';
        }
    };

    const getSizeOrCount = (): string => {
        if ('size' in selectedItem && selectedItem.size) {
            return selectedItem.size;
        } else if ('fileCount' in selectedItem && selectedItem.fileCount !== undefined) {
            return `${selectedItem.fileCount} 个文件`;
        } else if ('fields' in selectedItem && selectedItem.fields !== undefined) {
            return `${selectedItem.fields} 个字段`;
        } else if ('frequency' in selectedItem && selectedItem.frequency !== undefined) {
            return `${selectedItem.frequency} 次使用`;
        } else if ('results' in selectedItem && selectedItem.results !== undefined) {
            return `${selectedItem.results} 个结果`;
        } else {
            return '—';
        }
    };

    const getDate = (): string => {
        if ('date' in selectedItem && selectedItem.date) {
            return selectedItem.date;
        } else if ('lastUsed' in selectedItem && selectedItem.lastUsed) {
            return selectedItem.lastUsed;
        } else if ('lastUpdated' in selectedItem && selectedItem.lastUpdated) {
            return selectedItem.lastUpdated;
        } else if ('timestamp' in selectedItem && selectedItem.timestamp) {
            return selectedItem.timestamp;
        } else {
            return '—';
        }
    };

    const getStatusInfo = () => {
        let statusText = '活跃';
        let statusClass = 'bg-gray-100 text-gray-800';

        if ('status' in selectedItem && selectedItem.status) {
            statusText = selectedItem.status;
            if (selectedItem.status === '已向量化' || selectedItem.status === '已连接' || selectedItem.status === '活跃') {
                statusClass = 'bg-green-100 text-green-800';
            } else if (selectedItem.status === '处理中' || selectedItem.status === '维护中') {
                statusClass = 'bg-yellow-100 text-yellow-800';
            }
        } else if ('usage' in selectedItem && selectedItem.usage) {
            statusText = selectedItem.usage;
            if (selectedItem.usage === '广泛使用') {
                statusClass = 'bg-green-100 text-green-800';
            } else if (selectedItem.usage === '部分使用') {
                statusClass = 'bg-blue-100 text-blue-800';
            }
        } else if ('importance' in selectedItem && selectedItem.importance) {
            statusText = selectedItem.importance === 'high' ? '高重要性' : 
                        selectedItem.importance === 'medium' ? '中重要性' : '低重要性';
            if (selectedItem.importance === 'high') {
                statusClass = 'bg-red-100 text-red-800';
            } else if (selectedItem.importance === 'medium') {
                statusClass = 'bg-yellow-100 text-yellow-800';
            } else {
                statusClass = 'bg-green-100 text-green-800';
            }
        } else if ('source' in selectedItem && selectedItem.source) {
            statusText = selectedItem.source;
            statusClass = selectedItem.source === 'Web来源' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
        }

        return { text: statusText, className: statusClass };
    };

    const statusInfo = getStatusInfo();

    // 获取标题
    const getTitle = (): string => {
        if ('name' in selectedItem && selectedItem.name) {
            return selectedItem.name;
        } else if ('keyword' in selectedItem && selectedItem.keyword) {
            return selectedItem.keyword;
        } else if ('query' in selectedItem && selectedItem.query) {
            return selectedItem.query;
        } else {
            return `ID-${selectedItem.id}`;
        }
    };

    // 获取标题图标
    const getTitleIcon = () => {
        if ('keyword' in selectedItem) {
            return <Tag size={18} className="text-indigo-500 mr-2" />;
        } else if ('query' in selectedItem) {
            return <Search size={18} className="text-indigo-500 mr-2" />;
        } else {
            return null;
        }
    };

    return (
        <div className="p-0 h-full overflow-auto">
            <div className="sticky top-0 z-10 bg-white border-b">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        {getTitleIcon()}
                        {getTitle()}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Share2 size={18} className="text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Download size={18} className="text-gray-500" />
                        </button>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="flex px-4 border-b">
                    {activeSection === 'files' ? (
                        // 文件管理的标签页
                        <>
                            <button 
                                className={`px-4 py-2 ${activeTab === '基本信息' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('基本信息')}
                            >
                                基本信息
                            </button>
                            <button 
                                className={`px-4 py-2 ${activeTab === '关键词图谱' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('关键词图谱')}
                            >
                                关键词图谱
                            </button>
                            <button 
                                className={`px-4 py-2 ${activeTab === '使用记录' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('使用记录')}
                            >
                                使用记录
                            </button>
                        </>
                    ) : activeSection === 'models' ? (
                        // 模型管理的标签页
                        <>
                            <button 
                                className={`px-4 py-2 ${activeTab === '基本信息' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('基本信息')}
                            >
                                基本信息
                            </button>
                            <button 
                                className={`px-4 py-2 ${activeTab === '参数配置' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('参数配置')}
                            >
                                参数配置
                            </button>
                            <button 
                                className={`px-4 py-2 ${activeTab === '使用记录' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('使用记录')}
                            >
                                使用记录
                            </button>
                        </>
                    ) : (
                        // 向量库管理的标签页
                        <>
                            <button 
                                className={`px-4 py-2 ${activeTab === '基本信息' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('基本信息')}
                            >
                                基本信息
                            </button>
                            <button 
                                className={`px-4 py-2 ${activeTab === '向量统计' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('向量统计')}
                            >
                                向量统计
                            </button>
                            <button 
                                className={`px-4 py-2 ${activeTab === '使用记录' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('使用记录')}
                            >
                                使用记录
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="p-6">
                {activeTab === '基本信息' && (
                    <>
                        {/* 基本信息卡片 */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">类型</p>
                                    <div className="flex items-center">
                        <span className={`mr-2 w-3 h-3 rounded-full ${
                            'type' in selectedItem ? (
                                selectedItem.type === 'pdf' || selectedItem.type === 'docx' ? 'bg-blue-500' :
                                    selectedItem.type === 'xlsx' || selectedItem.type === 'pptx' ? 'bg-green-500' :
                                        selectedItem.type === 'LLM' ? 'bg-purple-500' :
                                            selectedItem.type === '嵌入模型' ? 'bg-indigo-500' :
                                                'bg-orange-500'
                            ) : 'bg-gray-500'
                        }`}></span>
                                        <p className="font-medium">{getTypeDisplay()}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">大小 / 项目数</p>
                                    <p className="font-medium">{getSizeOrCount()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">创建/更新日期</p>
                                    <p className="font-medium">{getDate()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">状态</p>
                                    <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                          {statusInfo.text}
                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 向量化状态 - 位于基本信息卡片 */}
                        {'status' in selectedItem && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-lg">向量化状态</h3>
                                    <button className="text-sm text-indigo-600 hover:text-indigo-800">查看详情</button>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                              selectedItem.status === '已向量化' ? 'bg-green-100 text-green-800' :
                                  selectedItem.status === '处理中' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedItem.status || '未处理'}
                          </span>
                                            <span className="text-sm text-gray-500">
                            {selectedItem.status === '已向量化' ? '向量化完成于 ' + (selectedItem as any).date :
                                selectedItem.status === '处理中' ? '正在处理...' : '尚未向量化'}
                          </span>
                                        </div>
                                    </div>

                                    {selectedItem.status === '已向量化' && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>向量维度</span>
                                                <span>1536</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>嵌入模型</span>
                                                <span>Embedding-v3</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-3">
                                                <span>索引方式</span>
                                                <span>HNSW</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 元数据模板字段 - 添加到基本信息卡片 */}
                        {'fields' in selectedItem && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-lg">元数据模板字段</h3>
                                    <button className="text-sm text-indigo-600 hover:text-indigo-800">添加字段</button>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border">
                                    <div className="divide-y divide-gray-200">
                                        {Array(selectedItem.fields).fill(0).map((_, index) => (
                                            <div key={index} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                                <div>
                                                    <span className="font-medium">{['标题', '作者', '分类', '发布日期', '关键词', '摘要', '状态', '审核人', '版本', '来源', '页数', '保密级别'][index % 12]}</span>
                                                    <span className="ml-2 text-xs text-gray-500">{['文本', '文本', '选择项', '日期', '标签', '长文本', '选择项', '文本', '文本', '文本', '数字', '选择项'][index % 12]}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="text-gray-400 hover:text-indigo-600">
                                                        <PencilIcon size={14} />
                                                    </button>
                                                    <button className="text-gray-400 hover:text-red-600">
                                                        <TrashIcon size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t">
                                        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm mr-2">
                                            保存模板
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            导出模板
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === '关键词图谱' && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-lg">关键词图谱</h3>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                <PlusCircle size={16} className="mr-1" />
                                添加关联
                            </button>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border p-4">
                            {/* 关键词图谱可视化 */}
                            <div className="h-64 bg-gray-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                                <ForceGraph2D<GraphNode, GraphLink>
                                    graphData={{
                                        nodes: [
                                            { id: 'main', name: 'keyword' in selectedItem ? selectedItem.keyword : getTitle(), group: 1, val: 20 },
                                            { id: 'node1', name: '政策法规', group: 2, val: 15 },
                                            { id: 'node2', name: '行政管理', group: 3, val: 15 },
                                            { id: 'node3', name: '智能应用', group: 4, val: 15 },
                                            { id: 'node4', name: '数据分析', group: 5, val: 15 },
                                            { id: 'node5', name: '知识管理', group: 2, val: 10 },
                                            { id: 'node6', name: '信息安全', group: 3, val: 10 },
                                            { id: 'node7', name: '系统集成', group: 4, val: 10 },
                                            { id: 'node8', name: '用户体验', group: 5, val: 10 },
                                        ] as GraphNode[],
                                        links: [
                                            { source: 'main', target: 'node1', value: 0.85 },
                                            { source: 'main', target: 'node2', value: 0.7 },
                                            { source: 'main', target: 'node3', value: 0.65 },
                                            { source: 'main', target: 'node4', value: 0.5 },
                                            { source: 'main', target: 'node5', value: 0.4 },
                                            { source: 'main', target: 'node6', value: 0.4 },
                                            { source: 'main', target: 'node7', value: 0.3 },
                                            { source: 'main', target: 'node8', value: 0.3 },
                                            { source: 'node1', target: 'node5', value: 0.2 },
                                            { source: 'node2', target: 'node6', value: 0.2 },
                                            { source: 'node3', target: 'node7', value: 0.2 },
                                            { source: 'node4', target: 'node8', value: 0.2 },
                                        ] as GraphLink[]
                                    } as GraphData}
                                    nodeAutoColorBy="group"
                                    nodeVal={node => node.val}
                                    linkWidth={link => link.value * 3}
                                    linkColor={() => '#ccc'}
                                    nodeCanvasObject={(node, ctx) => {
                                        const label = node.name;
                                        const fontSize = node.id === 'main' ? 12 : 10;
                                        ctx.font = `${fontSize}px Sans-Serif`;
                                        
                                        // Get text width for background
                                        const textWidth = ctx.measureText(label).width;
                                        const bckgDimensions = [textWidth, fontSize].map(n => n + 4);
                                        
                                        // Fill the node
                                        ctx.fillStyle = node.color || '#cccccc';
                                        ctx.beginPath();
                                        ctx.arc(node.x || 0, node.y || 0, node.val, 0, 2 * Math.PI, false);
                                        ctx.fill();

                                        // Add text background
                                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                                        ctx.fillRect(
                                            (node.x || 0) - bckgDimensions[0] / 2,
                                            (node.y || 0) - bckgDimensions[1] / 2,
                                            bckgDimensions[0],
                                            bckgDimensions[1]
                                        );
                                        
                                        // Add text
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillStyle = 'black';
                                        ctx.fillText(label, node.x || 0, node.y || 0);
                                    }}
                                    width={600}
                                    height={240}
                                    cooldownTicks={100}
                                    cooldownTime={2000}
                                    onEngineStop={() => console.log('Graph layout stabilized')}
                                    linkDirectionalParticles={2}
                                    linkDirectionalParticleWidth={2}
                                    nodeRelSize={6}
                                    d3AlphaDecay={0.02}
                                    d3VelocityDecay={0.3}
                                    backgroundColor="#f9fafb"
                                />
                            </div>
                            
                            {/* 关键词关联信息 */}
                            <h4 className="font-medium text-sm text-gray-700 mb-2">关键词关联</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                        <span className="text-sm">政策法规</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">85%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                        <span className="text-sm">行政管理</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">70%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                        <span className="text-sm">智能应用</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">65%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                        <span className="text-sm">数据分析</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">50%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between">
                                    <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800">更新关联</button>
                                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">查看全部</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === '使用记录' && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-lg">使用记录</h3>
                            <button className="text-sm text-indigo-600 hover:text-indigo-800">查看更多</button>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">2025-03-15 14:23</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">查看</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">管理员</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">查看了文件详细信息</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">2025-03-14 09:45</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">编辑</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">用户A</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">编辑了文件内容</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">2025-03-12 16:30</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">删除</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">用户B</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">删除了文件</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="px-4 py-3 bg-gray-50 text-right">
                                <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800">查看更多</button>
                            </div>
                        </div>
                    </div>
                )}

                {(activeSection !== 'files' || (activeSection === 'files' && activeTab !== '基本信息' && activeTab !== '关键词图谱' && activeTab !== '使用记录')) && renderPageSpecificContent(activeSection, activeTab, selectedItem)}
            </div>
        </div>
    );
};

// 根据页面特定内容
const renderPageSpecificContent = (activeSection: string, activeTab: string, selectedItem: any) => {
    // 只有在非文件管理页面或者在文件管理页面但不在基本信息标签时才渲染页面特定内容
    if (activeSection !== 'files' || (activeSection === 'files' && activeTab !== '基本信息')) {
        switch (activeSection) {
            case 'files':
                // 文件管理特有内容 - 只在关键词图谱和使用记录标签下渲染
                if (activeTab === '关键词图谱' || activeTab === '使用记录') {
                    return null; // 这些内容已经在上面的条件渲染中处理了
                }
                return null;

            case 'models':
                // 模型管理特有内容
                if ('provider' in selectedItem) {
                    return (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-lg">模型配置</h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800">查看使用日志</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border p-5">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        API密钥
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="password"
                                            value="••••••••••••••••••••••••••"
                                            className="flex-1 border rounded-l-md px-3 py-2 bg-gray-50"
                                            disabled
                                        />
                                        <button className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md hover:bg-gray-200">
                                            查看
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        服务端点
                                    </label>
                                    <input
                                        type="text"
                                        value="https://api.openai.com/v1/completions"
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        请求参数
                                    </label>
                                    <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                      <pre className="text-xs">{`{
  "temperature": 0.7,
  "max_tokens": 1024,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}`}</pre>
                                    </div>
                                </div>
                                <div className="flex">
                                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm mr-2">
                                        保存配置
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                        测试连接
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;

            case 'vectors':
                // 向量库管理特有内容
                if ('fileCount' in selectedItem) {
                    return (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-lg">向量库统计</h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800">查看全部文件</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border p-5">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">文件数量</div>
                                        <div className="text-2xl font-semibold">{selectedItem.fileCount}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">数据大小</div>
                                        <div className="text-2xl font-semibold">{selectedItem.size}</div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="text-sm font-medium mb-2">文件类型分布</div>
                                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="flex h-full">
                                            <div className="bg-blue-500 h-full w-1/2" title="PDF: 50%"></div>
                                            <div className="bg-green-500 h-full w-1/4" title="DOCX: 25%"></div>
                                            <div className="bg-yellow-500 h-full w-1/8" title="XLSX: 12.5%"></div>
                                            <div className="bg-red-500 h-full w-1/8" title="其他: 12.5%"></div>
                                        </div>
                                    </div>
                                    <div className="flex text-xs justify-between mt-1 text-gray-500">
                                        <span>PDF (50%)</span>
                                        <span>DOCX (25%)</span>
                                        <span>XLSX (12.5%)</span>
                                        <span>其他 (12.5%)</span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm mr-2">
                                        重建索引
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                        导出统计
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;

            default:
                return null;
        }
    }
    return null;
};

export default DetailPanel;