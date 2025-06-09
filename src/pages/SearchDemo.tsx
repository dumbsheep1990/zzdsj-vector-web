import React, { useState } from 'react';
import CustomSearchBox from '../components/common/CustomSearchBox';

const SearchDemo: React.FC = () => {
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [searchValue3, setSearchValue3] = useState('');

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">自定义搜索框演示</h1>
      
      <div className="space-y-8">
        {/* 小尺寸搜索框 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">小尺寸搜索框</h2>
          <CustomSearchBox
            size="small"
            placeholder="小尺寸搜索框..."
            value={searchValue1}
            onChange={setSearchValue1}
            onSearch={(value) => console.log('小尺寸搜索:', value)}
            allowClear
            style={{ width: '300px' }}
          />
        </div>

        {/* 中等尺寸搜索框 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">中等尺寸搜索框</h2>
          <CustomSearchBox
            size="medium"
            placeholder="中等尺寸搜索框..."
            value={searchValue2}
            onChange={setSearchValue2}
            onSearch={(value) => console.log('中等尺寸搜索:', value)}
            allowClear
            style={{ width: '400px' }}
          />
        </div>

        {/* 大尺寸搜索框 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">大尺寸搜索框</h2>
          <CustomSearchBox
            size="large"
            placeholder="大尺寸搜索框..."
            value={searchValue3}
            onChange={setSearchValue3}
            onSearch={(value) => console.log('大尺寸搜索:', value)}
            allowClear
            style={{ width: '500px' }}
          />
        </div>

        {/* 不同状态的搜索框 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">不同状态</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-600">普通状态</h3>
              <CustomSearchBox
                placeholder="普通状态搜索框..."
                style={{ width: '400px' }}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-600">错误状态</h3>
              <CustomSearchBox
                placeholder="错误状态搜索框..."
                className="error"
                style={{ width: '400px' }}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-600">成功状态</h3>
              <CustomSearchBox
                placeholder="成功状态搜索框..."
                className="success"
                style={{ width: '400px' }}
              />
            </div>
          </div>
        </div>

        {/* 并排布局 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">并排布局示例</h2>
          <div className="flex gap-4 items-center">
            <CustomSearchBox
              placeholder="第一个搜索框..."
              size="medium"
              style={{ width: '250px' }}
            />
            <CustomSearchBox
              placeholder="第二个搜索框..."
              size="medium"
              style={{ width: '250px' }}
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              搜索
            </button>
          </div>
        </div>

        {/* 响应式示例 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">响应式搜索框</h2>
          <CustomSearchBox
            placeholder="响应式搜索框，自适应宽度..."
            style={{ width: '100%', maxWidth: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchDemo; 