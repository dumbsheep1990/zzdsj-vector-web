import { FC } from 'react';
import { Search, Clock, BarChart, ExternalLink, Trash2 } from 'lucide-react';
import { SearchRecordItem } from '../../../utils/types';

interface SearchRecordsListProps {
    searchRecords: SearchRecordItem[];
    selectedItem: SearchRecordItem | null;
    setSelectedItem: (item: SearchRecordItem | null) => void;
}

const SearchRecordsList: FC<SearchRecordsListProps> = ({ searchRecords, selectedItem, setSelectedItem }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <div className="text-lg font-medium">检索记录列表</div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                        导出数据
                    </button>
                    <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm hover:bg-gray-200">
                        清除记录
                    </button>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">检索内容</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结果数</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">耗时</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {searchRecords.map((record) => (
                        <tr
                            key={record.id}
                            className={`hover:bg-gray-50 cursor-pointer ${selectedItem?.id === record.id ? 'bg-indigo-50' : ''}`}
                            onClick={() => setSelectedItem(record)}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <Search size={18} className="text-indigo-500 mr-2" />
                                    <span className="font-medium">{record.query}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <Clock size={16} className="text-gray-400 mr-2" />
                                    {record.timestamp}
                                </div>
                            </td>
                            <td className="px-6 py-4">{record.results}</td>
                            <td className="px-6 py-4">{record.duration}</td>
                            <td className="px-6 py-4">{record.user}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.source === '网页界面' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                    {record.source}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                    <button className="text-gray-400 hover:text-indigo-600">
                                        <BarChart size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-indigo-600">
                                        <ExternalLink size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="px-6 py-3 flex items-center justify-between border-t">
                <div className="text-sm text-gray-500">
                    显示 <span className="font-medium">1</span> 至 <span className="font-medium">{searchRecords.length}</span> 条，共 <span className="font-medium">{searchRecords.length}</span> 条
                </div>
                <div className="flex space-x-1">
                    <button className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-50">上一页</button>
                    <button className="px-3 py-1 border rounded-md bg-indigo-600 text-white">1</button>
                    <button className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-50">下一页</button>
                </div>
            </div>
        </div>
    );
};

export default SearchRecordsList;
