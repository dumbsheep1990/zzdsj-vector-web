import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, message } from 'antd';
import PageHeader from '../components/layout/PageHeader';
import Graph from 'graphology';
import Sigma from 'sigma';
import { graphApi } from '../utils/api/graph';

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
  const [availableGraphs, setAvailableGraphs] = useState<any[]>([]);
  const [selectedGraphId, setSelectedGraphId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 加载可用图谱列表
  useEffect(() => {
    loadAvailableGraphs();
  }, []);

  // 当选择图谱改变时重新渲染
  useEffect(() => {
    if (selectedGraphId) {
      loadGraphData(selectedGraphId);
    } else {
      renderMockData();
    }
  }, [selectedGraphId]);

  const loadAvailableGraphs = async () => {
    try {
      const graphs = await graphApi.getGraphs();
      setAvailableGraphs(graphs || []);
      
      // 如果有图谱，默认选择第一个
      if (graphs && graphs.length > 0) {
        setSelectedGraphId(graphs[0].id);
      } else {
        // 没有图谱时显示模拟数据
        renderMockData();
      }
    } catch (error) {
      console.error('加载图谱列表失败:', error);
      message.error('加载图谱列表失败，显示模拟数据');
      renderMockData();
    }
  };

  const loadGraphData = async (graphId: string) => {
    if (!containerRef.current) return;
    
    try {
      setLoading(true);
      
      // 清理现有的图
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }

      const response = await graphApi.getGraphNodes(graphId);
      const edges = await graphApi.getGraphEdges(graphId);
      
      // 创建新图实例
      const graph = new Graph();

      // 添加节点
      if (response && response.length > 0) {
        response.forEach((node: any) => {
          graph.addNode(node.id, {
            x: node.x || Math.random() * 800,
            y: node.y || Math.random() * 600,
            size: node.size || 15,
            color: node.color || '#4CAF50',
            label: node.label || node.name
          });
        });
      }

      // 添加边
      if (edges && edges.length > 0) {
        edges.forEach((edge: any) => {
          try {
            graph.addEdge(edge.source, edge.target, {
              size: edge.weight || 2,
              color: edge.color || '#666',
              label: edge.label || edge.type
            });
          } catch (e) {
            // 忽略无效边
            console.warn('Invalid edge:', edge);
          }
        });
      }

      // 如果没有数据，显示提示
      if (graph.order === 0) {
        renderEmptyGraph();
        return;
      }

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

    } catch (error) {
      console.error('加载图谱数据失败:', error);
      message.error('加载图谱数据失败，显示模拟数据');
      renderMockData();
    } finally {
      setLoading(false);
    }
  };

  const renderMockData = () => {
    if (!containerRef.current) return;

    // 清理现有的图
    if (sigmaRef.current) {
      sigmaRef.current.kill();
      sigmaRef.current = null;
    }

    // 创建图实例
    const graph = new Graph();

    // 添加模拟节点
    mockGraphData.nodes.forEach(node => {
      graph.addNode(node.id, {
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
        label: node.label
      });
    });

    // 添加模拟边
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
  };

  const renderEmptyGraph = () => {
    if (!containerRef.current) return;

    // 显示空图提示
    containerRef.current.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #999;">
        <div style="text-align: center;">
          <p style="font-size: 16px; margin: 0;">该图谱暂无数据</p>
          <p style="font-size: 14px; margin: 5px 0 0 0;">请先在图谱管理中创建并生成图谱数据</p>
        </div>
      </div>
    `;
  };

  // 清理效果
  useEffect(() => {
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
              value={selectedGraphId}
              onChange={setSelectedGraphId}
              placeholder="请选择要预览的图谱"
              loading={loading}
              options={availableGraphs.length > 0 ? availableGraphs.map(graph => ({
                value: graph.id,
                label: graph.name
              })) : [
                { value: 'mock', label: '模拟数据演示' }
              ]}
            />
            {availableGraphs.length === 0 && (
              <span style={{ color: '#999', fontSize: '12px' }}>
                暂无可用图谱，显示模拟数据
              </span>
            )}
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