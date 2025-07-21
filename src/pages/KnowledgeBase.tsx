import React, { useState, useEffect } from 'react';
import { Plus, Filter, BarChart2, Settings, RefreshCw } from 'lucide-react';
import type { KnowledgeBaseItem } from '../utils/types';
import KnowledgeBaseFiles from '../components/modules/knowledge-base/KnowledgeBaseFiles';
import KnowledgeBaseDetailDrawer from '../components/modules/knowledge-base/KnowledgeBaseDetailDrawer';
import KnowledgeBaseCreateDialog from '../components/modules/knowledge-base/KnowledgeBaseCreateDialog';
import PageHeader from '../components/layout/PageHeader';
import SearchInput from '../components/common/SearchInput';
import { Switch } from '../components/ui/Switch';
import { useAppContext } from '../context/AppContext';
import { FileIcon, Database } from 'lucide-react';
import { KnowledgeBaseListSkeleton } from '../components/skeleton';
import { Empty, message } from 'antd';
import { knowledgeServiceApi } from '../utils/api/knowledge';

const KnowledgeBase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBaseItem | null>(null);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [knowledgeBaseItems, setKnowledgeBaseItems] = useState<KnowledgeBaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasData, setHasData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { state } = useAppContext();

    // 加载数据
    useEffect(() => {
        loadKnowledgeBaseData();
    }, [currentPage, searchTerm, selectedStatus]);

    // 加载知识库数据
    const loadKnowledgeBaseData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const params = {
                page: currentPage,
                page_size: 12,
                ...(selectedStatus !== 'all' && { status: selectedStatus }),
                ...(searchTerm && { search: searchTerm })
            };
            
            const result = await knowledgeServiceApi.getKnowledgeBases(params);
            
            if (result.success) {
                const kbItems = result.data.knowledge_bases.map((kb: any) => ({
                    id: kb.id,
                    name: kb.name,
                    description: kb.description,
                    fileCount: kb.document_count || 0,
                    vectorCount: kb.chunk_count || 0,
                    lastUpdated: kb.updated_at,
                    category: kb.embedding_model || '文档',
                    status: kb.status === 'active' ? '活跃' : '维护中',
                    vectorized: Math.round((kb.chunk_count || 0) / Math.max(kb.document_count || 1, 1) * 100),
                    tags: kb.settings?.tags || []
                }));
                
                setKnowledgeBaseItems(kbItems);
                setTotalPages(result.data.pagination.total_pages || 0);
                setHasData(kbItems.length > 0);
            } else {
                setError('获取知识库列表失败');
                setKnowledgeBaseItems([]);
                setHasData(false);
            }
        } catch (error: any) {
            console.error('Failed to load knowledge bases:', error);
            setError(error.message || '网络错误，请稍后重试');
            setKnowledgeBaseItems([]);
            setHasData(false);
        } finally {
            setLoading(false);
        }
    };

    // 刷新数据
    const handleRefresh = () => {
        setCurrentPage(1);
        loadKnowledgeBaseData();
    };

    // 创建知识库成功后的回调
    const handleCreateSuccess = (newKnowledgeBase: any) => {
        message.success('知识库创建成功');
        handleRefresh();
    };

    // 删除知识库
    const handleDeleteKnowledgeBase = async (kbId: string) => {
        try {
            const result = await knowledgeServiceApi.deleteKnowledgeBase(kbId);
            if (result.success) {
                message.success('知识库删除成功');
                handleRefresh();
            } else {
                message.error(result.message || '删除知识库失败');
            }
        } catch (error: any) {
            message.error(error.message || '删除知识库失败');
        }
    };

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case '文档':
                return 'linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%)'; // 蓝色渐变
            case '法规标准':
            case '标准':
                return 'linear-gradient(135deg, #bbf7d0 0%, #10b981 100%)'; // 绿色渐变
            case '历史会议记录':
            case '会议记录':
                return 'linear-gradient(135deg, #fed7aa 0%, #f97316 100%)'; // 橙色渐变
            case '数据分析':
                return 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)'; // 紫色渐变
            case '配置':
                return 'linear-gradient(135deg, #bae6fd 0%, #0ea5e9 100%)'; // 天蓝色渐变
            default:
                return 'linear-gradient(135deg, #e5e7eb 0%, #6b7280 100%)'; // 灰色渐变
        }
    };

    const getTagColor = (tag: string) => {
        const colorIndex = tag.charCodeAt(0) % 6;
        const colors = [
            { bg: '#f0f9ff', border: '#bae6fd' }, // 蓝色
            { bg: '#f0fdf4', border: '#bbf7d0' }, // 绿色
            { bg: '#fff7ed', border: '#fed7aa' }, // 橙色
            { bg: '#fdf2f8', border: '#fbcfe8' }, // 粉色
            { bg: '#fefce8', border: '#fef08a' }, // 黄色
            { bg: '#f5f3ff', border: '#ddd6fe' }, // 紫色
        ];
        return colors[colorIndex];
    };

    const getProgressColor = (percentage: number) => {
        if (percentage < 30) return '#ef4444'; // 红色
        if (percentage < 70) return '#f59e0b'; // 橙色
        return 'linear-gradient(90deg, #3b82f6, #8b5cf6)'; // 蓝色到紫色渐变
    };

    const getIncompleteColor = (percentage: number) => {
        if (percentage < 30) return 'rgba(239, 68, 68, 0.1)'; // 淡红色
        if (percentage < 70) return 'rgba(245, 158, 11, 0.1)'; // 淡橙色
        return 'rgba(59, 130, 246, 0.05)'; // 淡蓝色
    };

    // 过滤数据并更新hasData状态
    const filteredData = knowledgeBaseItems.filter(kb => {
        const matchesSearch = kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kb.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (kb.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || kb.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // 更新是否有数据状态
    useEffect(() => {
        setHasData(filteredData.length > 0);
    }, [filteredData]);

    const handleCardClick = (kb: KnowledgeBaseItem) => {
        setSelectedKnowledgeBase(kb);
        setIsDetailDrawerOpen(true);
    };

    const handleToggleStatus = (kb: KnowledgeBaseItem) => {
        const updatedItems = knowledgeBaseItems.map(item => {
            if (item.id === kb.id) {
                return {
                    ...item,
                    status: item.status === '活跃' ? '维护中' : '活跃'
                };
            }
            return item;
        });
        setKnowledgeBaseItems(updatedItems);
    };

    const handleSettingsClick = (kb: KnowledgeBaseItem, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Settings clicked for', kb.name);
    };

    const renderKnowledgeBaseCard = (kb: KnowledgeBaseItem) => {
        const { name, description, category, status, tags = [], vectorized } = kb;
        const progressPercentage = vectorized || 0;
        const progressColor = getProgressColor(progressPercentage);
        const incompleteColor = getIncompleteColor(progressPercentage);

        return (
            <div
                key={kb.id}
                onClick={() => handleCardClick(kb)}
                className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group overflow-hidden"
            >
                <div className="flex flex-col h-full">
                    <div
                        className="h-1"
                        style={{ background: getCategoryGradient(category || '') }}
                    ></div>

                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center">
                                <div
                                    className="flex items-center justify-center w-10 h-10 rounded-full"
                                    style={{ background: getCategoryGradient(category || '') }}
                                >
                                    <Database size={20} className="text-white" />
                                </div>
                                <h3 className="text-lg font-semibold ml-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {name}
                                </h3>
                            </div>
                            <div className="flex items-center">
                                <div 
                                    className="relative cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleStatus(kb);
                                    }}
                                >
                                    <Switch
                                        checked={status === '活跃'}
                                        size="sm"
                                        className="data-[state=checked]:bg-blue-500"
                                        onChange={() => handleToggleStatus(kb)}
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

                        <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="py-1 px-2 bg-gray-50 rounded-md text-gray-700 font-medium">完成进度</span>
                                <span className="py-1 px-2 bg-blue-50 rounded-md text-blue-700 font-medium">{progressPercentage}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full" style={{ background: incompleteColor }}>
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${progressPercentage}%`,
                                        background: progressColor
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex mb-3">
                            <div className="flex items-center mr-4 px-2 py-1 bg-blue-50 rounded-md">
                                <FileIcon size={14} className="text-blue-600 mr-1" />
                                <span className="text-sm text-blue-700 font-medium">{kb.fileCount}</span>
                            </div>
                            <div className="flex items-center px-2 py-1 bg-purple-50 rounded-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-purple-600 mr-1"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span className="text-sm text-purple-700 font-medium">{kb.vectorCount}</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-2 flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                                {tags.length > 0 ? (
                                    tags.slice(0, 3).map((tag, index) => {
                                        const tagColor = getTagColor(tag);
                                        return (
                                            <span
                                                key={index}
                                                className="text-xs px-2 py-1 rounded-md prompt-tag"
                                                style={{
                                                    backgroundColor: tagColor.bg,
                                                    border: `1px solid ${tagColor.border}`
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="text-gray-500 text-xs">没有标签</span>
                                )}
                            </div>
                            <div onClick={(e: React.MouseEvent) => handleSettingsClick(kb, e)} className="cursor-pointer ml-2">
                                <Settings size={18} className="text-gray-600 hover:text-gray-800 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const filterComponent = (
        <div className="flex gap-4">
            <button
                className={`px-4 py-2 rounded-md ${selectedStatus === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setSelectedStatus('all')}
            >
                所有
            </button>
            <button
                className={`px-4 py-2 rounded-md ${selectedStatus === '活跃' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setSelectedStatus('活跃')}
            >
                活跃
            </button>
            <button
                className={`px-4 py-2 rounded-md ${selectedStatus === '维护中' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setSelectedStatus('维护中')}
            >
                维护中
            </button>
        </div>
    );

    const searchComponent = (
        <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="搜索知识库..."
            className="w-80"
        />
    );

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            <PageHeader
                parentTitle="知识库管理"
                title="知识库"
                description="管理和组织您的知识库资源，支持文件管理、向量化和数据管理"
                primaryActions={[
                    {
                        icon: <Plus size={20} />,
                        label: '新建知识库',
                        onClick: () => setIsCreateDialogOpen(true)
                    }
                ]}
                secondaryActions={[
                    {
                        icon: <Filter size={20} />,
                        label: '筛选',
                        onClick: () => console.log('筛选')
                    },
                    {
                        icon: <BarChart2 size={20} />,
                        label: '统计',
                        onClick: () => console.log('统计')
                    }
                ]}
                searchComponent={searchComponent}
                filterComponent={filterComponent}
                username={state.username || '管理员'}
            />

            <div className="flex-1 p-6">
                {/* 显示骨架屏或内容 */}
                {loading ? (
                    <KnowledgeBaseListSkeleton count={6} />
                ) : !hasData ? (
                    <div className="flex-1 flex items-center justify-center h-64">
                        <Empty 
                            description="没有找到匹配的知识库" 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredData.map(renderKnowledgeBaseCard)}
                    </div>
                )}
            </div>

            {/* 知识库详情侧抽屉和遮罩 */}
            {isDetailDrawerOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => {
                        setIsDetailDrawerOpen(false);
                        setSelectedKnowledgeBase(null);
                    }}
                />
            )}
            <KnowledgeBaseDetailDrawer
                knowledgeBase={selectedKnowledgeBase}
                isOpen={isDetailDrawerOpen}
                onClose={() => {
                    setIsDetailDrawerOpen(false);
                    setSelectedKnowledgeBase(null);
                }}
            />

            {/* 知识库文件管理面板 - 保留原有功能 */}
            {selectedKnowledgeBase && !isDetailDrawerOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-5/6 h-5/6 bg-white rounded-lg shadow-xl overflow-hidden">
                        <KnowledgeBaseFiles 
                            knowledgeBaseId={selectedKnowledgeBase.id}
                            title={`${selectedKnowledgeBase.name} · 文件管理`}
                            onClose={() => setSelectedKnowledgeBase(null)}
                        />
                    </div>
                </div>
            )}

            {/* 创建知识库对话框 */}
            <KnowledgeBaseCreateDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default KnowledgeBase;
