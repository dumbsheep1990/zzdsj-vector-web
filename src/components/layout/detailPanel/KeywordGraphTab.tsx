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
      { id: 'main', name: selectedItem?.name || 'u4e3bu8981u6587u6863', group: 1, val: 20, color: '#4f46e5' },
      { id: 'node1', name: 'u5e02u573au5206u6790', group: 2, val: 10 },
      { id: 'node2', name: 'u8d22u52a1u62a5u8868', group: 2, val: 10 },
      { id: 'node3', name: 'u5b63u5ea6u6570u636e', group: 2, val: 8 },
      { id: 'node4', name: 'u9500u552eu7edfu8ba1', group: 2, val: 8 },
      { id: 'node5', name: 'u4ea7u54c1u7ebf', group: 3, val: 6 },
      { id: 'node6', name: 'u5229u6da6u7387', group: 3, val: 6 },
      { id: 'node7', name: 'u589eu957fu7387', group: 3, val: 5 },
      { id: 'node8', name: 'u5e02u573au4efdu989d', group: 3, val: 5 },
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
        <h3 className="font-medium text-lg">u5173u952eu8bcdu56feu8c31</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">u5bfcu51fau56feu8c31</button>
      </div>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border p-5">
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-3">
            u4e0bu9762u662fu57fau4e8eu6587u6863u5185u5bb9u751fu6210u7684u5173u952eu8bcdu56feu8c31uff0cu5c55u793au4e86u4e3bu8981u6982u5ff5u53cau5176u5173u8054u5ea6u3002
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">u5e02u573au5206u6790</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">u8d22u52a1u62a5u8868</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">u5b63u5ea6u6570u636e</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">u9500u552eu7edfu8ba1</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">u4ea7u54c1u7ebf</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">u5229u6da6u7387</span>
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
          <h4 className="text-sm font-medium mb-2">u76f8u5173u6587u6863</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">DOC</span>
                </div>
                <div>
                  <p className="text-sm font-medium">u5e02u573au5206u6790u62a5u544a2023Q4.docx</p>
                  <p className="text-xs text-gray-500">2023-12-15 u00b7 1.5 MB</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">85% u76f8u5173</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">XLS</span>
                </div>
                <div>
                  <p className="text-sm font-medium">u8d22u52a1u6570u636eu6c47u603b2023.xlsx</p>
                  <p className="text-xs text-gray-500">2023-12-10 u00b7 2.3 MB</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">70% u76f8u5173</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">PDF</span>
                </div>
                <div>
                  <p className="text-sm font-medium">u5b63u5ea6u9500u552eu62a5u544a.pdf</p>
                  <p className="text-xs text-gray-500">2023-11-28 u00b7 3.1 MB</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">65% u76f8u5173</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordGraphTab;
