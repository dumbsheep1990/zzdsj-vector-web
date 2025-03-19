import React, { useState } from 'react';
import { TabsContainer, TabButton } from '../components/ui/Tabs';
import VectorsList from '../components/modules/vectors/VectorsList';
import KeywordsList from '../components/modules/vectors/KeywordsList';
import SearchRecordsList from '../components/modules/vectors/SearchRecordsList';
import DetailPanel from '../components/layout/DetailPanel';
import PageHeader from '../components/layout/PageHeader';
import { vectorData, keywordsData, searchRecordsData } from '../utils/mockData';
import { VectorItem, KeywordItem, SearchRecordItem } from '../utils/types';
import { Upload, RefreshCw, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Vectors: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'vectors' | 'keywords' | 'searchRecords'>('vectors');
    const [selectedVector, setSelectedVector] = useState<VectorItem | null>(null);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordItem | null>(null);
    const [selectedSearchRecord, setSelectedSearchRecord] = useState<SearchRecordItem | null>(null);
    const { state } = useAppContext();

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
    const renderModuleContent = () => {
        switch (activeModule) {
            case 'vectors':
                return (
                    <VectorsList 
                        vectors={vectorData} 
                        selectedItem={selectedVector} 
                        setSelectedItem={setSelectedVector} 
                    />
                );
            case 'keywords':
                return (
                    <KeywordsList 
                        keywords={keywordsData} 
                        selectedItem={selectedKeyword} 
                        setSelectedItem={setSelectedKeyword} 
                    />
                );
            case 'searchRecords':
                return (
                    <SearchRecordsList 
                        searchRecords={searchRecordsData} 
                        selectedItem={selectedSearchRecord} 
                        setSelectedItem={setSelectedSearchRecord} 
                    />
                );
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
        backgroundColor: '#f3f4f6'
    };

    const contentContainerStyle = {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        padding: '0 1.5rem 1.5rem 1.5rem'
    };

    const mainContentStyle = {
        width: getSelectedItem() ? 'calc(50% - 0.75rem)' : '100%',
        overflow: 'auto',
        transition: 'width 0.3s ease',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        padding: '1.5rem'
    };

    const detailPanelStyle = {
        width: 'calc(50% - 0.75rem)',
        backgroundColor: 'white',
        overflow: 'auto',
        transition: 'all 0.3s ease',
        marginLeft: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
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
                    <div className="mt-6">
                        {renderModuleContent()}
                    </div>
                </div>

                {getSelectedItem() && (
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