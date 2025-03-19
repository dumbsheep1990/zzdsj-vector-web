import React, { useState } from 'react';
import { Plus, Filter, BarChart2 } from 'lucide-react';
import { knowledgeBaseData } from '../utils/mockData';
import type { KnowledgeBaseItem } from '../utils/types';
import FileListModal from '../components/modals/FileListModal';
import PageHeader from '../components/layout/PageHeader';
import SearchInput from '../components/common/SearchInput';
import Switch from '../components/ui/Switch';
import { useAppContext } from '../context/AppContext';
import { FileIcon, Database } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBaseItem | null>(null);
    const [knowledgeBaseItems, setKnowledgeBaseItems] = useState(knowledgeBaseData);
    const { state } = useAppContext();

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

    const filteredData = knowledgeBaseItems.filter(kb => {
        const matchesSearch = kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kb.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (kb.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || kb.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCardClick = (kb: KnowledgeBaseItem) => {
        setSelectedKnowledgeBase(kb);
    };

    const handleToggleStatus = (kb: KnowledgeBaseItem) => {
        const updatedItems = knowledgeBaseItems.map(item => {
            if (item.id === kb.id) {
                return {
                    ...item,
                    status: item.status === '活跃' ? '非活跃' : '活跃'
                };
            }
            return item;
        });
        setKnowledgeBaseItems(updatedItems);
    };

    const renderKnowledgeBaseCard = (kb: KnowledgeBaseItem) => {
        // Use default value of 0 if vectorized is undefined
        const vectorizedCount = kb.vectorized ?? 0;
        const progressPercentage = Math.round((vectorizedCount / kb.fileCount) * 100);
        
        return (
            <div 
                key={kb.id} 
                className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer hover:translate-y-[-2px]"
                style={{ 
                    background: getCategoryGradient(kb.category || 'default'),
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                }}
                onClick={() => handleCardClick(kb)}
            >
                <div className="relative z-10 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{kb.name}</h3>
                            <p className="text-gray-700 text-sm mt-1 line-clamp-2">{kb.description}</p>
                        </div>
                        <div className="flex space-x-2">
                            <div onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleToggleStatus(kb); }}>
                                <Switch 
                                    checked={kb.status === '活跃'}
                                    onChange={() => {}}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 backdrop-blur-sm bg-white/30 rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex justify-between text-gray-800 text-sm mb-2">
                            <span className="font-medium">向量化进度</span>
                            <span className="font-bold">{progressPercentage}%</span>
                        </div>
                        <div 
                            className="w-full h-2.5 rounded-full overflow-hidden relative"
                            style={{ 
                                backgroundColor: getIncompleteColor(progressPercentage),
                                backdropFilter: 'blur(4px)'
                            }}
                        >
                            <div 
                                className="h-full rounded-full transition-all duration-500 ease-out absolute top-0 left-0"
                                style={{ 
                                    width: `${progressPercentage}%`,
                                    background: getProgressColor(progressPercentage),
                                    boxShadow: progressPercentage >= 70 ? '0 0 10px rgba(139, 92, 246, 0.5)' : `0 0 8px ${getProgressColor(progressPercentage)}` 
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center">
                                <FileIcon className="h-4 w-4 text-gray-700 mr-1.5" />
                                <span className="text-sm text-gray-800 font-medium">{kb.fileCount}</span>
                            </div>
                            <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center">
                                <Database className="h-4 w-4 text-gray-700 mr-1.5" />
                                <span className="text-sm text-gray-800 font-medium">{vectorizedCount}</span>
                            </div>
                        </div>
                        <div className="text-gray-700 text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                            {kb.lastUpdated}
                        </div>
                    </div>

                    {kb.tags && kb.tags.length > 0 && (
                        <div className="mt-3">
                            <p className="text-gray-700 text-xs mb-1 font-medium">知识库相关标签</p>
                            <div className="flex flex-wrap gap-2">
                                {kb.tags.map((tag, index) => {
                                    const tagColor = getTagColor(tag);
                                    return (
                                        <span 
                                            key={index} 
                                            className="px-2.5 py-1 text-xs rounded-lg font-medium text-gray-700 transition-all duration-200 hover:shadow-sm"
                                            style={{
                                                backgroundColor: tagColor.bg,
                                                border: `1px solid ${tagColor.border}`
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
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
                全部
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
                description="管理和组织您的知识库资源，支持文件管理、向量化和元数据管理"
                primaryActions={[
                    {
                        icon: <Plus size={20} />,
                        label: '新建知识库',
                        onClick: () => console.log('新建知识库')
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredData.map(renderKnowledgeBaseCard)}
                </div>
            </div>

            <FileListModal 
                isOpen={!!selectedKnowledgeBase}
                onClose={() => setSelectedKnowledgeBase(null)}
                knowledgeBaseName={selectedKnowledgeBase?.name || ''}
            />
        </div>
    );
};

export default KnowledgeBase;
