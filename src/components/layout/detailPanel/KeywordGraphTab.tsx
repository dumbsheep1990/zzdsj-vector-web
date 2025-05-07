import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData } from './types';

interface KeywordGraphTabProps {
  selectedItem: any;
}

const KeywordGraphTab: React.FC<KeywordGraphTabProps> = ({ selectedItem }) => {
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  // In a real application, this data would come from the selectedItem or an API
  const graphData: GraphData = {
    nodes: [
      { id: 'main', name: selectedItem?.name || '主要文档', group: 1, val: 20, color: '#4f46e5' },
      { id: 'node1', name: '市场分析', group: 2, val: 10 },
      { id: 'node2', name: '财务报表', group: 2, val: 10 },
      { id: 'node3', name: '季度数据', group: 2, val: 8 },
      { id: 'node4', name: '销售统计', group: 2, val: 8 },
      { id: 'node5', name: '产品线', group: 3, val: 6 },
      { id: 'node6', name: '利润率', group: 3, val: 6 },
      { id: 'node7', name: '增长率', group: 3, val: 5 },
      { id: 'node8', name: '市场份额', group: 3, val: 5 },
    ],
    links: [
      { source: 'main', target: 'node1', value: 0.85 },
      { source: 'main', target: 'node2', value: 0.7 },
      { source: 'main', target: 'node3', value: 0.65 },
      { source: 'main', target: 'node4', value: 0.5 },
      { source: 'main', target: 'node5', value: 0.4 },
      { source: 'main', target: 'node6', value: 0.4 },
      { source: 'main', target: 'node7', value: 0.3 },
      { source: 'main', target: 'node8', value: 0.3 },
      { source: 'node1', target: 'node5', value: 0.2 },
      { source: 'node2', target: 'node6', value: 0.2 },
      { source: 'node3', target: 'node7', value: 0.2 },
      { source: 'node4', target: 'node8', value: 0.2 },
    ]
  };

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 400
      });
    }
  }, []);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">关键词图谱</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">导出图谱</button>
      </div>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border p-5">
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-3">
            下面是基于文档内容生成的关键词图谱，展示了主要概念及其关联度。
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">市场分析</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">财务报表</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">季度数据</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">销售统计</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">产品线</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">利润率</span>
          </div>
        </div>
        <div ref={containerRef} style={{ height: '400px', width: '100%' }}>
          <ForceGraph2D
            graphData={graphData}
            nodeId="id"
            nodeVal="val"
            nodeLabel="name"
            nodeColor={(node) => (node as any).color || '#6366f1'}
            linkWidth={(link) => (link as any).value * 3}
            linkColor={() => '#d1d5db'}
            d3AlphaDecay={0.02}
            width={dimensions.width}
            height={dimensions.height}
          />
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">相关文档</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">DOC</span>
                </div>
                <div>
                  <p className="text-sm font-medium">市场分析报告2023Q4.docx</p>
                  <p className="text-xs text-gray-500">2023-12-15 · 1.5 MB</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">85% 相关</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">XLS</span>
                </div>
                <div>
                  <p className="text-sm font-medium">财务数据汇总2023.xlsx</p>
                  <p className="text-xs text-gray-500">2023-12-10 · 2.3 MB</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">70% 相关</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">PDF</span>
                </div>
                <div>
                  <p className="text-sm font-medium">季度销售报告.pdf</p>
                  <p className="text-xs text-gray-500">2023-11-28 · 3.1 MB</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">65% 相关</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordGraphTab;
