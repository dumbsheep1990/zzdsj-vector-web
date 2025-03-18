import React, { useState } from 'react';
import { Plus, Filter, BarChart2, Power } from 'lucide-react';
import { knowledgeBaseData } from '../utils/mockData';
import type { KnowledgeBaseItem } from '../utils/types';
import FileListModal from '../components/modals/FileListModal';
import PageHeader from '../components/layout/PageHeader';
import SearchInput from '../components/common/SearchInput';

const KnowledgeBase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBaseItem | null>(null);

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case '政策文档':
                return 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.12) 100%)';
            case '法规标准':
                return 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)';
            case '历史会议记录':
                return 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.12) 100%)';
            case '数据分析':
                return 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.12) 100%)';
            default:
                return 'linear-gradient(135deg, rgba(156, 163, 175, 0.08) 0%, rgba(107, 114, 128, 0.12) 100%)';
        }
    };

    const getCategoryAccentColor = (category: string) => {
        switch (category) {
            case '政策文档':
                return '#2563eb';
            case '法规标准':
                return '#059669';
            case '历史会议记录':
                return '#d97706';
            case '数据分析':
                return '#6d28d9';
            default:
                return '#6b7280';
        }
    };

    const filteredData = knowledgeBaseData.filter(kb => {
        const matchesSearch = kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kb.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kb.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || kb.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case '活跃':
                return '#10b981';
            case '维护中':
                return '#f59e0b';
            default:
                return '#6b7280';
        }
    };

    const handleCardClick = (kb: KnowledgeBaseItem) => {
        setSelectedKnowledgeBase(kb);
    };

    const handlePowerClick = (e: React.MouseEvent, kb: KnowledgeBaseItem) => {
        e.stopPropagation(); // 防止触发卡片点击
        // 处理启用/停用逻辑
        console.log('Toggle power for:', kb.name);
    };

    const renderKnowledgeBaseCard = (kb: KnowledgeBaseItem) => {
        const progressPercentage = Math.round((kb.vectorized / kb.fileCount) * 100);
        const accentColor = getCategoryAccentColor(kb.category);
        
        return (
            <div 
                key={kb.id} 
                className="rounded-lg shadow-md p-6 hover:shadow-lg transition-all backdrop-blur-sm cursor-pointer"
                style={{ 
                    background: getCategoryGradient(kb.category),
                    borderLeft: `4px solid ${accentColor}`
                }}
                onClick={() => handleCardClick(kb)}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{kb.name}</h3>
                        <p className="text-gray-600 mt-1">{kb.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
                              style={{ backgroundColor: `${getStatusColor(kb.status)}20`, color: getStatusColor(kb.status) }}>
                            {kb.status}
                        </span>
                        <button 
                            className="p-1.5 rounded-full transition-colors duration-200 hover:bg-gray-100"
                            style={{ color: kb.status === '活跃' ? '#10b981' : '#9ca3af' }}
                            title={kb.status === '活跃' ? '点击停用' : '点击启用'}
                            onClick={(e) => handlePowerClick(e, kb)}
                        >
                            <Power size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-gray-600">
                        <div className="text-sm">文件总数</div>
                        <div className="text-lg font-semibold text-gray-900">{kb.fileCount}</div>
                    </div>
                    <div className="text-gray-600">
                        <div className="text-sm">向量化文件</div>
                        <div className="text-lg font-semibold text-gray-900">{kb.vectorized}</div>
                    </div>
                    <div className="text-gray-600">
                        <div className="text-sm">待处理文件</div>
                        <div className="text-lg font-semibold text-gray-900">{kb.pendingFiles}</div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>向量化进度</span>
                        <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-300"
                             style={{ width: `${progressPercentage}%`, backgroundColor: accentColor }}></div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">标签</div>
                    <div className="flex flex-wrap gap-2">
                        {kb.tags.map((tag, index) => (
                            <span key={index}
                                  className="px-2 py-1 rounded-md text-sm"
                                  style={{ 
                                      backgroundColor: `${accentColor}15`,
                                      color: accentColor
                                  }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>最近更新：{kb.lastUpdated}</div>
                        <div>存储大小：{kb.size}</div>
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
