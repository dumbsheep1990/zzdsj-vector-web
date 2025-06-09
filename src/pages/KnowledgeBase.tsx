import React, { useState, useEffect } from 'react';
import { Database, FileIcon, Settings, Plus, Filter, BarChart2 } from 'lucide-react';
import CreateKnowledgeBaseModal from '../components/modals/CreateKnowledgeBaseModal';
import KnowledgeBaseSettingsModal from '../components/modals/KnowledgeBaseSettingsModal';
import PageHeader from '../components/layout/PageHeader';
import CustomSearchBox from '../components/common/CustomSearchBox';
import Switch from '../components/ui/Switch';
import { useAppContext } from '../context/AppContext';
import { KnowledgeBaseListSkeleton } from '../components/skeleton';
import { useToast } from '../components/Toast';
import { knowledgeBaseData } from '../utils/mockData';
import type { KnowledgeBaseItem } from '../utils/types';
// FileListModal removed as it's not being used
import { Empty } from 'antd';

const KnowledgeBase: React.FC = () => {
    const useToastHook = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBaseItem | null>(null);
    const [knowledgeBaseItems, setKnowledgeBaseItems] = useState<KnowledgeBaseItem[]>([]);
    const [loading, setLoading] = useState(true); // 添加加载状态
    const [hasData, setHasData] = useState(true); // 是否有数据状态
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // 创建知识库模态框状态
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const { state } = useAppContext();

    // 加载数据
    useEffect(() => {
        loadKnowledgeBaseData();
    }, []);

    // 加载知识库数据
    const loadKnowledgeBaseData = () => {
        setLoading(true);
        // 模拟API调用延迟
        setTimeout(() => {
            setKnowledgeBaseItems(knowledgeBaseData);
            setLoading(false);
        }, 1500);
    };

    // 刷新数据
    // 将在页面添加刷新按钮时使用
    // const handleRefresh = () => {
    //     loadKnowledgeBaseData();
    // };

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
        setSelectedKnowledgeBase(kb);
        setIsSettingsModalVisible(true);
    };
    
    const handleUpdateKnowledgeBase = (id: string, values: any) => {
        // 模拟更新知识库设置
        setKnowledgeBaseItems(prevBases => {
            return prevBases.map(kb => {
                if (kb.id === id) {
                    return {
                        ...kb,
                        ...values,
                        lastUpdated: new Date().toISOString().split('T')[0] // 更新日期为今天
                    };
                }
                return kb;
            });
        });
    };
    
    const handleDeleteKnowledgeBase = (id: string) => {
        // 模拟删除知识库
        setKnowledgeBaseItems(prevBases => prevBases.filter(kb => kb.id !== id));
    };

    const renderKnowledgeBaseCard = (kb: KnowledgeBaseItem) => {
        const { name, description, category, status, tags = [] } = kb;
        // 使用模拟进度值
        const progress = 70; // 模拟的默认进度值
        const progressColor = getProgressColor(progress);
        const incompleteColor = getIncompleteColor(progress);

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

                    <div className="pt-4 px-4 pb-0 flex-1 flex flex-col">
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
                                        onChange={() => {}} // 添加onChange处理函数
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

                        <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="py-1 px-2 bg-gray-50 rounded-md text-gray-700 font-medium">完成进度</span>
                                <span className="py-1 px-2 bg-blue-50 rounded-md text-blue-700 font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full" style={{ background: incompleteColor }}>
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${progress}%`,
                                        background: progressColor
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex mb-3">
                            <div className="flex items-center mr-4 px-2 py-1 bg-blue-50 rounded-md">
                                <FileIcon size={14} className="text-blue-600 mr-1" />
                                <span className="text-sm text-blue-700 font-medium">{kb.fileCount || 0}</span>
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
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <path d="M12 17h.01" />
                                </svg>
                                <span className="text-sm text-purple-700 font-medium">{kb.vectorCount || 0}</span>
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
                        <div className="flex justify-between items-center text-xs text-gray-500" 
                            style={{ marginTop: '8px', paddingTop: '5px', paddingBottom: '5px', borderTop: '1px solid #e5e7eb', marginLeft: '-16px', marginRight: '-16px', paddingLeft: '16px', paddingRight: '16px', width: 'calc(100% + 32px)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>ID: 
                                <span 
                                style={{ display: 'inline-block', marginLeft: '5px', padding: '1px 5px', border: '1px solid #e0e0e0', backgroundColor: '#f9f9f9', borderRadius: '3px', cursor: 'pointer', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} 
                                title={`点击复制完整ID: ${kb.id}`} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(kb.id);
                                  useToastHook.showToast(`ID已复制: ${kb.id}`, 'success', 2000);
                                }}
                                >{kb.id.split('-')[0]}</span>
                            </div>
                            <div>更新时间: {kb.lastUpdated || 'N/A'}</div>
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
        <CustomSearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setSearchTerm}
            placeholder="搜索知识库..."
            allowClear
            style={{ width: '320px' }}
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
                        onClick: () => setIsCreateModalVisible(true)
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

            {/* FileListModal removed as it's not being used */}

            {isCreateModalVisible && (
                <CreateKnowledgeBaseModal
                    open={isCreateModalVisible}
                    onClose={() => setIsCreateModalVisible(false)}
                    onCreateKnowledgeBase={(values) => {
                        console.log('创建知识库:', values);
                        // 这里处理创建知识库的逻辑
                        // 模拟添加新知识库
                        const newKnowledgeBase: KnowledgeBaseItem = {
                            id: `kb-${Date.now()}`,
                            name: values.name,
                            description: values.description,
                            category: '文档',
                            status: '活跃',
                            tags: values.tags,
                            fileCount: 0,
                            vectorCount: 0,
                            lastUpdated: new Date().toISOString(),
                            size: '0 KB'
                        };
                        setKnowledgeBaseItems([newKnowledgeBase, ...knowledgeBaseItems]);
                        setIsCreateModalVisible(false);
                    }}
                />
            )}
            
            {isSettingsModalVisible && selectedKnowledgeBase && (
                <KnowledgeBaseSettingsModal
                    open={isSettingsModalVisible}
                    onClose={() => setIsSettingsModalVisible(false)}
                    knowledgeBase={selectedKnowledgeBase}
                    onUpdateKnowledgeBase={handleUpdateKnowledgeBase}
                    onDeleteKnowledgeBase={handleDeleteKnowledgeBase}
                />
            )}
        </div>
    );
};

export default KnowledgeBase;
