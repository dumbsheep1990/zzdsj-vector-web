import React from 'react';

interface UsageRecordTabProps {
  selectedItem: any;
}

const UsageRecordTab: React.FC<UsageRecordTabProps> = ({ selectedItem }) => {
  if (!selectedItem) return null;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">使用记录</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">导出记录</button>
      </div>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">开始日期</label>
                <input type="date" className="border rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">结束日期</label>
                <input type="date" className="border rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">操作类型</label>
                <select className="border rounded px-2 py-1 text-sm">
                  <option>全部</option>
                  <option>查看</option>
                  <option>编辑</option>
                  <option>下载</option>
                  <option>删除</option>
                </select>
              </div>
            </div>
            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
              筛选
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                时间
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                详情
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 whitespace-nowrap text-sm">2025-03-19 14:30</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">查看</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">当前用户</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">查看了文件详情</td>
            </tr>
            <tr>
              <td className="px-4 py-3 whitespace-nowrap text-sm">2025-03-18 10:15</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">下载</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">用户C</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">下载了文件</td>
            </tr>
            <tr>
              <td className="px-4 py-3 whitespace-nowrap text-sm">2025-03-15 09:45</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">编辑</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">用户A</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">编辑了文件内容</td>
            </tr>
            <tr>
              <td className="px-4 py-3 whitespace-nowrap text-sm">2025-03-12 16:30</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">删除</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">用户B</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">删除了文件</td>
            </tr>
          </tbody>
        </table>
        <div className="px-4 py-3 bg-gray-50 text-right">
          <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800">
            查看更多
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageRecordTab;
