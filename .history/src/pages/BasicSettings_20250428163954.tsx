import React, { useState } from 'react';
import { Card, Select, Switch, Space, Divider, Typography } from 'antd';
import PageHeader from '../components/layout/PageHeader';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BasicSettings: React.FC = () => {
  const [useLocalModels, setUseLocalModels] = useState(false);

  const modelOptions = {
    embedding: [
      { value: 'siliconflow/BAAI/bge-m3', label: 'siliconflow/BAAI/bge-m3' },
      { value: 'local/embedding-model-1', label: '本地模型 1' },
      { value: 'custom/embedding-model-1', label: '自定义模型 1' },
    ],
    rerank: [
      { value: 'siliconflow/BAAI/bge-reranker-v2-m3', label: 'siliconflow/BAAI/bge-reranker-v2-m3' },
      { value: 'local/rerank-model-1', label: '本地模型 1' },
      { value: 'custom/rerank-model-1', label: '自定义模型 1' },
    ],
    chat: [
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { value: 'local/chat-model-1', label: '本地模型 1' },
      { value: 'custom/chat-model-1', label: '自定义模型 1' },
    ],
  };

  const searchEngineOptions = [
    { value: 'bing', label: 'Bing' },
    { value: 'seaXNG', label: 'SeaXNG' },
    { value: 'duckduckgo', label: 'DuckDuckGo' },
    { value: 'google', label: 'Google' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <PageHeader 
        title="基础设置"
        parentTitle="系统设置"
        description="配置系统的基础功能和模型参数"
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <Card className="mb-6 shadow-sm">
            <div className="space-y-8">
              {/* Model Configuration Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Title level={4} className="mb-0">模型配置</Title>
                  <Space>
                    <Text>仅显示本地模型</Text>
                    <Switch
                      checked={useLocalModels}
                      onChange={setUseLocalModels}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                    />
                  </Space>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Text strong className="block mb-2">Embedding 模型</Text>
                    <Select
                      mode="multiple"
                      className="w-full"
                      defaultValue={['siliconflow/BAAI/bge-m3']}
                      options={modelOptions.embedding}
                      placeholder="请选择 Embedding 模型"
                    />
                    <Text type="secondary" className="block mt-2">
                      模型将按顺序尝试调用，当前模型调用失败时自动切换到下一个
                    </Text>
                  </div>

                  <div>
                    <Text strong className="block mb-2">Re-Ranker 模型</Text>
                    <Select
                      mode="multiple"
                      className="w-full"
                      defaultValue={['siliconflow/BAAI/bge-reranker-v2-m3']}
                      options={modelOptions.rerank}
                      placeholder="请选择 Re-Ranker 模型"
                    />
                  </div>

                  <div>
                    <Text strong className="block mb-2">Chat 模型</Text>
                    <Select
                      mode="multiple"
                      className="w-full"
                      defaultValue={['gpt-4']}
                      options={modelOptions.chat}
                      placeholder="请选择 Chat 模型"
                    />
                  </div>
                </div>
              </div>

              <Divider />

              {/* Feature Configuration Section */}
              <div>
                <Title level={4} className="mb-4">功能配置</Title>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Text strong className="block">知识库</Text>
                      <Text type="secondary">启用知识库功能，支持文档管理和检索</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Text strong className="block">知识图谱</Text>
                      <Text type="secondary">启用知识图谱功能，支持实体关系分析</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Text strong className="block">网页搜索</Text>
                      <Text type="secondary">启用网页搜索功能，支持多搜索引擎集成</Text>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Divider />

              {/* Search Engine Configuration */}
              <div>
                <Title level={4} className="mb-4">搜索引擎配置</Title>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Text strong className="block mb-2">选择搜索引擎</Text>
                  <Select
                    mode="multiple"
                    className="w-full"
                    defaultValue={['bing']}
                    options={searchEngineOptions}
                    placeholder="请选择搜索引擎"
                  />
                  <Text type="secondary" className="block mt-2">
                    可同时启用多个搜索引擎，系统将并行搜索并合并结果
                  </Text>
                </div>
              </div>

              <Divider />

              {/* Retrieval Configuration */}
              <div>
                <Title level={4} className="mb-4">检索配置</Title>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Text strong className="block mb-2">查询重写策略</Text>
                  <Select
                    className="w-full"
                    defaultValue="hyde"
                    options={[
                      { value: 'hyde', label: 'HyDE (Hypothetical Document Embeddings)' },
                      { value: 'query-expansion', label: '查询扩展' },
                      { value: 'query-reformulation', label: '查询重构' },
                    ]}
                  />
                  <Text type="secondary" className="block mt-2">
                    选择查询重写策略，优化检索效果
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasicSettings; 