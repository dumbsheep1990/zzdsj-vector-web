import React, { useState, useEffect } from 'react';
import { TabsContainer, TabButton } from '../components/ui/Tabs';
import DatasetsList from '../components/modules/datasets/DatasetsList';
import DatasetsListSkeleton from '../components/skeleton/DatasetsListSkeleton';
import EmptyDatasetsState from '../components/modules/datasets/EmptyDatasetsState';
import DatasetDetailPanel from '../components/modules/datasets/DatasetDetailPanel';
import QaPairDialog from '../components/modules/datasets/QaPairDialog';
import AssistantLinkDialog from '../components/modules/datasets/AssistantLinkDialog';
import QaSplitDialog from '../components/modules/datasets/QaSplitDialog';
import PageHeader from '../components/layout/PageHeader';
import { QaDataset, QaPair, AssistantItem } from '../utils/types';
import { mockDatasets } from '../utils/mockQaData';
import { Plus, Upload, FileUp, FilePlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Datasets: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'datasets'>('datasets');
    const [selectedDataset, setSelectedDataset] = useState<QaDataset | null>(null);
    const [datasetsData, setDatasetsData] = useState<QaDataset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { state } = useAppContext();
    
    // 对话框状态
    const [showQaPairDialog, setShowQaPairDialog] = useState(false);
    const [showAssistantLinkDialog, setShowAssistantLinkDialog] = useState(false);
    const [showQaSplitDialog, setShowQaSplitDialog] = useState(false);
    const [editingQaPair, setEditingQaPair] = useState<QaPair | undefined>(undefined);

    // 模拟API加载数据
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // 模拟网络请求延迟
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // 加载数据集数据
                setDatasetsData(mockDatasets);
            } catch (error) {
                console.error('加载数据失败:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    // 获取当前选中的项目
    const getSelectedItem = () => {
        return selectedDataset;
    };

    // 设置当前选中的项目
    const setSelectedItem = (item: QaDataset | null) => {
        setSelectedDataset(item);
    };

    // 创建新数据集
    const handleCreateDataset = () => {
        console.log('创建新数据集');
        // 实际应用中，这里应该打开创建数据集的表单
    };

    // 创建问答对
    const handleCreateQaPair = () => {
        setEditingQaPair(undefined);
        setShowQaPairDialog(true);
    };

    // 编辑问答对
    const handleEditQaPair = (pair: QaPair) => {
        setEditingQaPair(pair);
        setShowQaPairDialog(true);
    };

    // 删除问答对
    const handleDeleteQaPair = (pairId: string) => {
        console.log('删除问答对:', pairId);
        // 实际应用中，这里应该调用API删除问答对
    };

    // 保存问答对
    const handleSaveQaPair = (qaPair: Partial<QaPair>) => {
        console.log('保存问答对:', qaPair);
        setShowQaPairDialog(false);
        // 实际应用中，这里应该调用API保存问答对
    };

    // 管理助手绑定
    const handleLinkAssistant = () => {
        setShowAssistantLinkDialog(true);
    };

    // 保存助手绑定
    const handleSaveAssistantLinks = (linkedAssistants: AssistantItem[]) => {
        console.log('保存助手绑定:', linkedAssistants);
        setShowAssistantLinkDialog(false);
        // 实际应用中，这里应该调用API更新数据集的助手绑定
    };

    // 拆分问答
    const handleSplitQa = () => {
        setShowQaSplitDialog(true);
    };

    // 保存拆分的问答对
    const handleSaveSplitQaPairs = (qaPairs: Partial<QaPair>[]) => {
        console.log('保存拆分的问答对:', qaPairs);
        setShowQaSplitDialog(false);
        // 实际应用中，这里应该调用API保存拆分的问答对
    };

    // 渲染模块内容
    const renderModuleContent = () => {
        if (isLoading) {
            return <DatasetsListSkeleton rowCount={5} />;
        } else if (datasetsData.length === 0) {
            return <EmptyDatasetsState onCreateNew={handleCreateDataset} />;
        } else {
            return (
                <DatasetsList 
                    datasets={datasetsData} 
                    selectedItem={selectedDataset} 
                    setSelectedItem={setSelectedDataset} 
                />
            );
        }
    };

    // 模块标题
    const getModuleTitle = () => {
        return '问答数据集管理';
    };

    // 模块描述
    const getModuleDescription = () => {
        return '管理问答数据集，支持问答拆分和助手绑定';
    };

    // 主要操作按钮
    const getPrimaryActions = () => {
        return [
            {
                icon: <Plus size={20} />,
                label: '新建数据集',
                onClick: handleCreateDataset
            },
            {
                icon: <Upload size={20} />,
                label: '导入问答数据',
                onClick: () => console.log('导入问答数据')
            },
            {
                icon: <FilePlus size={20} />,
                label: '添加问答对',
                onClick: handleCreateQaPair,
                disabled: !selectedDataset
            }
        ];
    };

    // Tab组件
    const tabsComponent = (
        <TabsContainer>
            <TabButton 
                active={activeModule === 'datasets'} 
                onClick={() => setActiveModule('datasets')}
            >
                问答数据集
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
        padding: '1.5rem 1.5rem 1.5rem 1.5rem'
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        transition: 'all 0.3s ease',
        marginLeft: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        maxHeight: 'calc(100vh - 135px)'
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
                        <DatasetDetailPanel 
                            dataset={getSelectedItem() as QaDataset} 
                            onClose={() => setSelectedItem(null)}
                            onCreatePair={handleCreateQaPair}
                            onEditPair={handleEditQaPair}
                            onDeletePair={handleDeleteQaPair}
                            onLinkAssistant={handleLinkAssistant}
                            onSplitQa={handleSplitQa}
                        />
                    </div>
                )}
            </div>

            {/* 问答对话框 */}
            {showQaPairDialog && (
                <QaPairDialog 
                    isOpen={showQaPairDialog}
                    onClose={() => setShowQaPairDialog(false)}
                    onSave={handleSaveQaPair}
                    qaPair={editingQaPair}
                />
            )}

            {/* 助手绑定对话框 */}
            {showAssistantLinkDialog && selectedDataset && (
                <AssistantLinkDialog 
                    isOpen={showAssistantLinkDialog}
                    onClose={() => setShowAssistantLinkDialog(false)}
                    onSave={handleSaveAssistantLinks}
                    dataset={selectedDataset}
                />
            )}

            {/* 问答拆分对话框 */}
            {showQaSplitDialog && selectedDataset && (
                <QaSplitDialog 
                    isOpen={showQaSplitDialog}
                    onClose={() => setShowQaSplitDialog(false)}
                    onSave={handleSaveSplitQaPairs}
                    datasetId={selectedDataset.id}
                />
            )}
        </div>
    );
};

export default Datasets;
