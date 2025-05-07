import React, { useState, useEffect } from 'react';
import { TabsContainer, TabButton } from '../components/ui/Tabs';
import VectorsList from '../components/modules/vectors/VectorsList';
import VectorsListSkeleton from '../components/skeleton/VectorsListSkeleton';
import EmptyVectorsState from '../components/modules/vectors/EmptyVectorsState';
import KeywordsList from '../components/modules/vectors/KeywordsList';
import SearchRecordsList from '../components/modules/vectors/SearchRecordsList';
import DetailPanel from '../components/layout/DetailPanel';
import PageHeader from '../components/layout/PageHeader';
import { vectorData as mockVectorData, keywordsData as mockKeywordsData, searchRecordsData as mockSearchRecordsData } from '../utils/mockData';
import { VectorItem, KeywordItem, SearchRecordItem } from '../utils/types';
import { Upload, RefreshCw, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Vectors: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'vectors' | 'keywords' | 'searchRecords'>('vectors');
    const [selectedVector, setSelectedVector] = useState<VectorItem | null>(null);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordItem | null>(null);
    const [selectedSearchRecord, setSelectedSearchRecord] = useState<SearchRecordItem | null>(null);
    const [vectorData, setVectorData] = useState<VectorItem[]>([]);
    const [keywordsData, setKeywordsData] = useState<KeywordItem[]>([]);
    const [searchRecordsData, setSearchRecordsData] = useState<SearchRecordItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAppContext();

    // 模拟API加载数据
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // 模拟网络请求延迟
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // 默认加载数据，这里可以切换来测试空状态
                // 设置为空数组显示空状态，设置为mockXXXData显示数据
                // 向量数据 - 可以修改为[] 测试空状态
                setVectorData(mockVectorData); 
                // 关键词数据
                setKeywordsData(mockKeywordsData);
                // 搜索记录数据
                setSearchRecordsData(mockSearchRecordsData);
            } catch (error) {
                console.error('加载数据失败:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    // 获取当前选中的项目（根据当前活动模块）
    const getSelectedItem = () => {
        switch (activeModule) {
            case 'vectors':
                return selectedVector;
            case 'keywords':
                return selectedKeyword;
            case 'searchRecords':
                return selectedSearchRecord;
            default:
                return null;
        }
    };

    // 设置当前选中的项目（根据当前活动模块）
    const setSelectedItem = (item: VectorItem | KeywordItem | SearchRecordItem | null) => {
        switch (activeModule) {
            case 'vectors':
                setSelectedVector(item as VectorItem | null);
                break;
            case 'keywords':
                setSelectedKeyword(item as KeywordItem | null);
                break;
            case 'searchRecords':
                setSelectedSearchRecord(item as SearchRecordItem | null);
                break;
        }
    };

    // 渲染不同模块的内容
    const handleCreateNew = () => {
        // 处理创建新向量库的逻辑
        console.log('创建新向量库');
        // 这里可以打开创建表单或对话框
    };

    const renderModuleContent = () => {
        switch (activeModule) {
            case 'vectors':
                if (isLoading) {
                    return <VectorsListSkeleton rowCount={5} />;
                } else if (vectorData.length === 0) {
                    return <EmptyVectorsState onCreateNew={handleCreateNew} />;
                } else {
                    return (
                        <VectorsList 
                            vectors={vectorData} 
                            selectedItem={selectedVector} 
                            setSelectedItem={setSelectedVector} 
                        />
                    );
                }
            case 'keywords':
                if (isLoading) {
                    return <VectorsListSkeleton rowCount={5} />;
                } else if (keywordsData.length === 0) {
                    return <EmptyVectorsState onCreateNew={handleCreateNew} />;
                } else {
                    return (
                        <KeywordsList 
                            keywords={keywordsData} 
                            selectedItem={selectedKeyword} 
                            setSelectedItem={setSelectedKeyword} 
                        />
                    );
                }
            case 'searchRecords':
                if (isLoading) {
                    return <VectorsListSkeleton rowCount={5} />;
                } else if (searchRecordsData.length === 0) {
                    return <EmptyVectorsState onCreateNew={handleCreateNew} />;
                } else {
                    return (
                        <SearchRecordsList 
                            searchRecords={searchRecordsData} 
                            selectedItem={selectedSearchRecord} 
                            setSelectedItem={setSelectedSearchRecord} 
                        />
                    );
                }
            default:
                return null;
        }
    };

    const getModuleTitle = () => {
        switch (activeModule) {
            case 'vectors':
                return '向量数据';
            case 'keywords':
                return '关键词管理';
            case 'searchRecords':
                return '搜索记录';
            default:
                return '';
        }
    };

    const getModuleDescription = () => {
        switch (activeModule) {
            case 'vectors':
                return '管理和维护向量化后的数据，支持批量操作和数据更新';
            case 'keywords':
                return '管理系统中的关键词，优化搜索结果和数据分类';
            case 'searchRecords':
                return '查看和分析用户搜索记录，优化搜索体验';
            default:
                return '';
        }
    };

    const getPrimaryActions = () => {
        switch (activeModule) {
            case 'vectors':
                return [
                    {
                        icon: <Upload size={20} />,
                        label: '批量导入',
                        onClick: () => console.log('批量导入向量数据')
                    },
                    {
                        icon: <RefreshCw size={20} />,
                        label: '更新向量',
                        onClick: () => console.log('更新向量数据')
                    }
                ];
            case 'keywords':
                return [
                    {
                        icon: <Upload size={20} />,
                        label: '导入关键词',
                        onClick: () => console.log('导入关键词')
                    }
                ];
            case 'searchRecords':
                return [
                    {
                        icon: <Download size={20} />,
                        label: '导出记录',
                        onClick: () => console.log('导出搜索记录')
                    }
                ];
            default:
                return [];
        }
    };

    const tabsComponent = (
        <TabsContainer>
            <TabButton 
                active={activeModule === 'vectors'} 
                onClick={() => setActiveModule('vectors')}
            >
                向量数据
            </TabButton>
            <TabButton 
                active={activeModule === 'keywords'} 
                onClick={() => setActiveModule('keywords')}
            >
                关键词管理
            </TabButton>
            <TabButton 
                active={activeModule === 'searchRecords'} 
                onClick={() => setActiveModule('searchRecords')}
            >
                搜索记录
            </TabButton>
        </TabsContainer>
    );

    // 样式定义
    const containerStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        height: '100vh' // 确保容器占满整个视窗高度
    };

    const contentContainerStyle = {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        padding: '1.5rem 1.5rem 1.5rem 1.5rem' // 增加顶部间距
    };

    const mainContentStyle = {
        width: getSelectedItem() ? 'calc(50% - 0.75rem)' : '100%',
        overflow: 'auto',
        transition: 'width 0.3s ease',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        padding: '1.25rem'
    };

    const detailPanelStyle = {
        width: 'calc(50% - 0.75rem)',
        backgroundColor: 'white',
        height: '100%',  // 确保抽屉面板占满整个高度
        display: 'flex',
        flexDirection: 'column' as const,
        transition: 'all 0.3s ease',
        marginLeft: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden', // 防止溢出
        maxHeight: 'calc(100vh - 135px)' // 限制最大高度，保持在视口内
    };

    return (
        <div style={containerStyle}>
            <PageHeader
                parentTitle="知识库管理"
                title={getModuleTitle()}
                description={getModuleDescription()}
                primaryActions={getPrimaryActions()}
                filterComponent={tabsComponent}
                username={state.username}
            />
            
            <div style={contentContainerStyle}>
                <div style={mainContentStyle}>
                    <div className="mt-4">
                        {renderModuleContent()}
                    </div>
                </div>

                {getSelectedItem() && !isLoading && (
                    <div style={detailPanelStyle}>
                        <DetailPanel 
                            selectedItem={getSelectedItem()} 
                            setSelectedItem={setSelectedItem}
                            activeSection="vectors"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vectors;