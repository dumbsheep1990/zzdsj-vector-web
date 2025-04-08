import React, { useState } from 'react';
import { Card, Button, Space, Select, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface ExportConfig {
  format: 'json' | 'yaml';
  include: ('services' | 'parameters' | 'models')[];
}

const ConfigExport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'json',
    include: ['services', 'parameters', 'models']
  });

  const handleExport = async () => {
    setLoading(true);
    try {
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 创建导出内容
      const exportData = {
        services: [
          { name: 'OpenAI API', type: 'third-party', endpoint: 'https://api.openai.com/v1' },
          { name: 'Local Ollama', type: 'ollama', endpoint: 'http://localhost:11434' }
        ],
        parameters: {
          temperature: 0.7,
          maxTokens: 2000,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0
        },
        models: [
          { name: 'gpt-3.5-turbo', provider: 'OpenAI' },
          { name: 'llama2', provider: 'Meta' }
        ]
      };

      // 根据选择的格式转换数据
      const content = exportConfig.format === 'json' 
        ? JSON.stringify(exportData, null, 2)
        : `services:
  - name: OpenAI API
    type: third-party
    endpoint: https://api.openai.com/v1
  - name: Local Ollama
    type: ollama
    endpoint: http://localhost:11434
parameters:
  temperature: 0.7
  maxTokens: 2000
  topP: 1
  frequencyPenalty: 0
  presencePenalty: 0
models:
  - name: gpt-3.5-turbo
    provider: OpenAI
  - name: llama2
    provider: Meta`;

      // 创建下载链接
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `model-config.${exportConfig.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      message.success('配置导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="配置导出">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <span style={{ marginRight: 8 }}>导出格式：</span>
            <Select
              value={exportConfig.format}
              onChange={(value) => setExportConfig({ ...exportConfig, format: value })}
              style={{ width: 120 }}
            >
              <Select.Option value="json">JSON</Select.Option>
              <Select.Option value="yaml">YAML</Select.Option>
            </Select>
          </div>

          <div>
            <span style={{ marginRight: 8 }}>导出内容：</span>
            <Select
              mode="multiple"
              value={exportConfig.include}
              onChange={(value) => setExportConfig({ ...exportConfig, include: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="services">服务配置</Select.Option>
              <Select.Option value="parameters">模型参数</Select.Option>
              <Select.Option value="models">模型列表</Select.Option>
            </Select>
          </div>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={loading}
          >
            导出配置
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ConfigExport; 