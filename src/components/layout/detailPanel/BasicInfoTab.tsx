import React from 'react';
import { PlusCircle, PencilIcon as Pencil, TrashIcon as Trash } from 'lucide-react';

interface BasicInfoTabProps {
  selectedItem: any;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ selectedItem }) => {
  if (!selectedItem) return null;
  
  return (
    <>
      {/* Unicode编码的文档标题 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 mr-2">{selectedItem.name}</h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                {selectedItem.type || '文档'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {selectedItem.description || '这是一个文档文件，包含了重要的信息和数据。'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">创建时间</p>
                <p className="text-sm">{selectedItem.date || '2023-01-01'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">大小</p>
                <p className="text-sm">{selectedItem.size || '1.2 MB'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">分类</p>
                <p className="text-sm">{selectedItem.category || '未分类'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">创建者</p>
                <p className="text-sm">{selectedItem.creator || '系统'}</p>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {selectedItem.name ? selectedItem.name.charAt(0).toUpperCase() : 'D'}
          </div>
        </div>
      </div>

      {/* u5411u91cfu5316u72b6u6001 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">向量化状态</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">查看详情</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedItem.status === '已向量化' ? 'bg-green-100 text-green-800' :
                  selectedItem.status === '处理中' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
              }`}>
                {selectedItem.status || '未处理'}
              </span>
              <span className="text-sm text-gray-500">
                {selectedItem.status === '已向量化' ? '向量化完成于 ' + (selectedItem as any).date :
                  selectedItem.status === '处理中' ? '正在处理...' : '尚未向量化'}
              </span>
            </div>
            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
              开始向量化
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            向量化后的文档可以被用于语义搜索和相似度匹配，提高检索效率和准确性。
          </div>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: selectedItem.status === '已向量化' ? '100%' : selectedItem.status === '处理中' ? '60%' : '0%' }}></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {selectedItem.status === '已向量化' ? '100%' : selectedItem.status === '处理中' ? '60%' : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* u5143u6570u636eu4fe1u606f */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">元数据信息</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">编辑元数据</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <div className="flex justify-between">
              <span className="text-sm font-medium">标签</span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <PlusCircle size={16} />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">文档</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">报告</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">季度</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">财务</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">2023</span>
            </div>
          </div>
          <div className="p-4 border-t border-b">
            <div className="flex justify-between">
              <span className="text-sm font-medium">自定义属性</span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <PlusCircle size={16} />
              </button>
            </div>
          </div>
          <div className="divide-y">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">部门</p>
                <p className="text-sm text-gray-500">财务部</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-indigo-600">
                  <Pencil size={14} />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash size={14} />
                </button>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">负责人</p>
                <p className="text-sm text-gray-500">张三</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-indigo-600">
                  <Pencil size={14} />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash size={14} />
                </button>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">优先级</p>
                <p className="text-sm text-gray-500">高</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-indigo-600">
                  <Pencil size={14} />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm mr-2">
              保存模板
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              应用模板
            </button>
          </div>
        </div>
      </div>

      {/* u4efbu52a1u8fdbu5ea6 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">任务进度</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">添加任务</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">文档审核</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-xs text-gray-500">完成</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">内容提取</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs text-gray-500">75%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">数据分析</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <span className="text-xs text-gray-500">50%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfoTab;
