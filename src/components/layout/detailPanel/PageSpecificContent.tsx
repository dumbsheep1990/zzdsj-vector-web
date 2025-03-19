import React from 'react';
import ModelConfigContent from './ModelConfigContent';

interface PageSpecificContentProps {
  activeSection: string;
  activeTab: string;
  selectedItem: any;
}

const PageSpecificContent: React.FC<PageSpecificContentProps> = ({ 
  activeSection, 
  activeTab, 
  selectedItem 
}) => {
  if (activeSection !== 'files' || (activeSection === 'files' && activeTab !== '基本信息')) {
    switch (activeSection) {
      case 'files':
        if (activeTab === '关键词图谱' || activeTab === '使用记录') {
          return null;
        }
        return null;

      case 'models':
        // 模型管理特有内容
        if ('provider' in selectedItem) {
          return <ModelConfigContent selectedItem={selectedItem} />;
        }
        return null;

      case 'vectors':
        // 向量库特有内容
        return (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">向量库信息</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">刷新</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">向量维度</p>
                  <p className="text-sm font-medium">1536</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">向量总数</p>
                  <p className="text-sm font-medium">12,458</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">创建时间</p>
                  <p className="text-sm">2023-10-15</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">最后更新</p>
                  <p className="text-sm">2023-12-28</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  向量库类型
                </label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>Pinecone</option>
                  <option>Milvus</option>
                  <option selected>Faiss</option>
                  <option>Chroma</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  相似度算法
                </label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>欧几里得距离 (L2)</option>
                  <option selected>余弦相似度</option>
                  <option>点积</option>
                  <option>杰卡德相似度</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  保存设置
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  重建索引
                </button>
              </div>
            </div>
          </div>
        );

      case 'metadata':
        // 元数据管理特有内容
        return (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">元数据模板</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">创建新模板</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  模板名称
                </label>
                <input
                  type="text"
                  value="财务报告模板"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  适用文档类型
                </label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>所有类型</option>
                  <option selected>财务报告</option>
                  <option>市场分析</option>
                  <option>产品说明</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>字段定义</span>
                  <button className="text-xs text-indigo-600">添加字段</button>
                </label>
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">报告类型</p>
                      <p className="text-xs text-gray-500">选择字段 (单选)</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">财务年度</p>
                      <p className="text-xs text-gray-500">数字字段</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">部门</p>
                      <p className="text-xs text-gray-500">文本字段</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  保存模板
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  应用到文档
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }
  return null;
};

export default PageSpecificContent;
