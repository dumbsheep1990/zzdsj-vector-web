import React, { useEffect, useRef } from 'react';
import { Card, Select } from 'antd';
import PageHeader from '../components/layout/PageHeader';
import Graph from 'graphology';
import Sigma from 'sigma';

interface SigmaInstance {
  kill: () => void;
}

// 模拟知识图谱数据，实际应该从API获取
const mockGraphData = {
  nodes: [
    { id: '1', label: '产业政策', x: 0, y: 0, size: 20, color: '#4CAF50' },
    { id: '2', label: '制造业转型', x: 5, y: 5, size: 15, color: '#2196F3' },
    { id: '3', label: '智能制造', x: -5, y: 5, size: 15, color: '#2196F3' },
    { id: '4', label: '数字化转型', x: 0, y: 10, size: 15, color: '#2196F3' },
    { id: '5', label: '技术创新', x: -10, y: 0, size: 15, color: '#FFC107' },
    { id: '6', label: '人才培养', x: 10, y: 0, size: 15, color: '#FFC107' },
    { id: '7', label: '财政补贴', x: 0, y: -10, size: 12, color: '#FF5722' },
    { id: '8', label: '税收优惠', x: -8, y: -8, size: 12, color: '#FF5722' },
    { id: '9', label: '产业基金', x: 8, y: -8, size: 12, color: '#FF5722' },
    { id: '10', label: '示范项目', x: 15, y: 5, size: 10, color: '#9C27B0' }
  ],
  edges: [
    { source: '1', target: '2', label: '重点支持', size: 3, color: '#666' },
    { source: '1', target: '3', label: '发展方向', size: 3, color: '#666' },
    { source: '1', target: '4', label: '主要任务', size: 3, color: '#666' },
    { source: '2', target: '5', label: '依托', size: 2, color: '#999' },
    { source: '2', target: '6', label: '需要', size: 2, color: '#999' },
    { source: '3', target: '5', label: '基础', size: 2, color: '#999' },
    { source: '4', target: '5', label: '驱动', size: 2, color: '#999' },
    { source: '1', target: '7', label: '支持措施', size: 2, color: '#999' },
    { source: '1', target: '8', label: '支持措施', size: 2, color: '#999' },
    { source: '1', target: '9', label: '支持措施', size: 2, color: '#999' },
    { source: '2', target: '10', label: '实施', size: 1, color: '#999' },
    { source: '3', target: '10', label: '实施', size: 1, color: '#999' }
  ]
};

const GraphPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<SigmaInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建图实例
    const graph = new Graph();

    // 添加节点
    mockGraphData.nodes.forEach(node => {
      graph.addNode(node.id, {
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
        label: node.label
      });
    });

    // 添加边
    mockGraphData.edges.forEach(edge => {
      graph.addEdge(edge.source, edge.target, {
        size: edge.size,
        color: edge.color,
        label: edge.label
      });
    });

    // 创建 Sigma 实例
    sigmaRef.current = new Sigma(graph, containerRef.current, {
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      renderEdgeLabels: true,
      defaultEdgeColor: '#999',
      defaultNodeColor: '#999',
      labelSize: 12,
      labelWeight: 'bold',
    });

    return () => {
      if (sigmaRef.current) {
        sigmaRef.current.kill();
      }
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="图谱数据预览"
        parentTitle="知识图谱"
        description="可视化预览知识图谱数据"
      />
      <div className="p-6">
        <Card className="mb-4">
          <div className="flex items-center gap-4">
            <span>选择图谱：</span>
            <Select
              style={{ width: 300 }}
              defaultValue="industry"
              options={[
                { value: 'industry', label: '产业政策知识图谱' },
                { value: 'technology', label: '科技创新政策图谱' },
                { value: 'livelihood', label: '民生政策知识图谱' },
                { value: 'finance', label: '财税政策知识图谱' },
                { value: 'business', label: '营商环境政策图谱' },
                { value: 'regional', label: '区域发展政策图谱' }
              ]}
            />
          </div>
        </Card>
        <Card bodyStyle={{ padding: 0 }}>
          <div 
            ref={containerRef} 
            style={{ 
              width: '100%', 
              height: 'calc(100vh - 300px)',
              minHeight: '500px',
              background: '#f8f9fa'
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default GraphPreview; 