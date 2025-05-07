import { FC } from 'react';
import { Database, BarChart, RefreshCw, MoreHorizontal, ChevronRight, FileText } from 'lucide-react';
import { VectorItem } from '../../../utils/types';

interface VectorsListProps {
    vectors: VectorItem[];
    selectedItem: VectorItem | null;
    setSelectedItem: (item: VectorItem | null) => void;
}

const VectorsList: FC<VectorsListProps> = ({ vectors, selectedItem, setSelectedItem }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">向量库名称</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">文件数量</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">大小</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">最后更新</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pr-8">操作</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {vectors.map((vector) => (
                    <tr
                        key={vector.id}
                        className={`group transition-all duration-200 cursor-pointer ${selectedItem?.id === vector.id 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-50/30 border-l-2 border-l-blue-500' 
                            : 'hover:bg-gray-50/80'}`}
                        onClick={() => setSelectedItem(vector)}
                    >
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                    <Database size={16} className="text-white" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{vector.name}</div>
                                    <div className="text-xs text-gray-500 hidden group-hover:block transition-all duration-150">
                                        ID: {String(vector.id).substring(0, 8)}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="bg-blue-50 w-7 h-7 rounded-md flex items-center justify-center mr-2">
                                    <FileText size={14} className="text-blue-500" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{vector.fileCount}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-md">{vector.size}</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{vector.lastUpdated}</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${vector.status === '活跃' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : vector.status === '维护中' 
                                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                                    : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                {vector.status === '活跃' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>}
                                {vector.status === '维护中' && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>}
                                {vector.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex space-x-3 justify-end items-center">
                                <button className="text-gray-400 hover:text-blue-600 bg-transparent hover:bg-blue-50 rounded-full p-1.5 transition-colors">
                                    <BarChart size={16} />
                                </button>
                                <button className="text-gray-400 hover:text-blue-600 bg-transparent hover:bg-blue-50 rounded-full p-1.5 transition-colors">
                                    <RefreshCw size={16} />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-50 rounded-full p-1.5 transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VectorsList;