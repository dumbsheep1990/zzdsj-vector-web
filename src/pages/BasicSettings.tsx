import React from 'react';
import { Card, Select, Switch } from 'antd';
import PageHeader from '../components/layout/PageHeader';

const BasicSettings: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="基础设置"
        parentTitle="系统设置"
        description="配置系统的基础功能和模型参数"
      />
      <div className="p-6">
        <Card className="mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">基础模型配置</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-32">Embedding 模型:</span>
                  <Select
                    className="flex-1"
                    defaultValue="siliconflow/BAAI/bge-m3"
                    options={[
                      { value: 'siliconflow/BAAI/bge-m3', label: 'siliconflow/BAAI/bge-m3' }
                    ]}
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-32">Re-Ranker 模型:</span>
                  <Select
                    className="flex-1"
                    defaultValue="siliconflow/BAAI/bge-reranker-v2-m3"
                    options={[
                      { value: 'siliconflow/BAAI/bge-reranker-v2-m3', label: 'siliconflow/BAAI/bge-reranker-v2-m3' }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">功能配置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>是否开启知识库</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>是否开启知识图谱</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>是否开启网页搜索（注：现阶段会根据 TAVILY_API_KEY 自动开启，无法手动配置，将会在下个版本中移除此配置项）</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>是否开启重排序</span>
                  <Switch />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">检索配置</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-32">重写查询:</span>
                  <Select
                    className="flex-1"
                    defaultValue="hyde"
                    options={[
                      { value: 'hyde', label: 'hyde' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BasicSettings; 