import React, { useState } from 'react';
import { Plus, Filter, BarChart2, RefreshCw, FileSpreadsheet } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SearchInput from '../components/common/SearchInput';

const Metadata: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const searchComponent = (
        <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="搜索元数据..."
            className="w-80"
        />
    );

    const filterComponent = (
        <div className="flex gap-4">
            <button className="px-4 py-2 rounded-md bg-blue-50 text-blue-600">
                全部
            </button>
            <button className="px-4 py-2 rounded-md text-gray-600">
                已标注
            </button>
            <button className="px-4 py-2 rounded-md text-gray-600">
                未标注
            </button>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            <PageHeader
                parentTitle="知识库管理"
                title="元数据管理"
                description="管理和维护文档的元数据信息，支持批量导入、导出和更新操作"
                primaryActions={[
                    {
                        icon: <Plus size={20} />,
                        label: '新建元数据',
                        onClick: () => console.log('新建元数据')
                    },
                    {
                        icon: <FileSpreadsheet size={20} />,
                        label: '导入元数据',
                        onClick: () => console.log('导入元数据')
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
                    },
                    {
                        icon: <RefreshCw size={20} />,
                        label: '同步',
                        onClick: () => console.log('同步元数据')
                    }
                ]}
                searchComponent={searchComponent}
                filterComponent={filterComponent}
            />

            <div className="flex-1 p-6">
                {/* 元数据内容区域 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500 text-center">元数据管理功能开发中...</p>
                </div>
            </div>
        </div>
    );
};

export default Metadata;
