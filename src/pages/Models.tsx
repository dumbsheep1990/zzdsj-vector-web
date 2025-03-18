import React, { useState } from 'react';
import { Plus, Filter, BarChart2, RefreshCw, Download, Upload } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SearchInput from '../components/common/SearchInput';
import ModelsHeader from '../components/modules/models/ModelsHeader';
import ModelsList from '../components/modules/models/ModelsList';
import DetailPanel from '../components/layout/DetailPanel';
import { modelData } from '../utils/mockData';
import { ModelItem } from '../utils/types';

const Models: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<ModelItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const searchComponent = (
        <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="搜索模型..."
            className="w-80"
        />
    );

    const filterComponent = (
        <div className="flex gap-4">
            <button className="px-4 py-2 rounded-md bg-blue-50 text-blue-600">
                全部
            </button>
            <button className="px-4 py-2 rounded-md text-gray-600">
                已部署
            </button>
            <button className="px-4 py-2 rounded-md text-gray-600">
                未部署
            </button>
            <button className="px-4 py-2 rounded-md text-gray-600">
                训练中
            </button>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            <PageHeader
                title="模型管理"
                description="管理和维护模型，支持模型训练、部署和监控"
                primaryActions={[
                    {
                        icon: <Plus size={20} />,
                        label: '新建模型',
                        onClick: () => console.log('新建模型')
                    },
                    {
                        icon: <Upload size={20} />,
                        label: '导入模型',
                        onClick: () => console.log('导入模型')
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
                        label: '性能监控',
                        onClick: () => console.log('性能监控')
                    },
                    {
                        icon: <RefreshCw size={20} />,
                        label: '更新',
                        onClick: () => console.log('更新模型')
                    },
                    {
                        icon: <Download size={20} />,
                        label: '导出',
                        onClick: () => console.log('导出模型')
                    }
                ]}
                searchComponent={searchComponent}
                filterComponent={filterComponent}
            />

            <div className="flex-1 p-6">
                <div className="flex-1 flex overflow-hidden">
                    <div className={`${selectedItem ? 'w-1/2' : 'w-full'} overflow-auto transition-all duration-300 p-6`}>
                        <h1 className="text-2xl font-semibold mb-6">模型管理</h1>

                        <ModelsHeader models={modelData} />

                        <ModelsList
                            models={modelData}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                        />
                    </div>

                    {selectedItem && (
                        <div className="w-1/2 border-l bg-white overflow-auto transition-all duration-300">
                            <DetailPanel
                                selectedItem={selectedItem}
                                setSelectedItem={setSelectedItem}
                                activeSection="models"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Models;