import React from 'react';
import { Card, Button, Tooltip } from 'antd';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';

const ModelSettings: React.FC = () => {
  const primaryActions = [
    {
      icon: <SettingOutlined />,
      label: '重新加载',
      onClick: () => window.location.reload()
    }
  ];

  return (
    <div>
      <PageHeader 
        title="模型设置"
        parentTitle="系统设置"
        description="配置各个模型服务的API密钥"
        primaryActions={primaryActions}
      />
      <div className="p-6">
        <div className="text-gray-600 mb-4">
          请在 src/.env 文件中配置对应的APIKEY，并重新启动服务
        </div>

        <div className="space-y-4">
          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/siliconflow-logo.png" alt="SiliconFlow" className="w-8 h-8" />
                <span className="font-medium">SiliconFlow</span>
                <Tooltip title="SiliconFlow相关信息">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <SettingOutlined className="text-gray-400" />
                <Button type="text">展开</Button>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/openai-logo.png" alt="OpenAI" className="w-8 h-8" />
                <span className="font-medium">OpenAI</span>
                <Tooltip title="OpenAI相关信息">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Button type="text" icon={<SettingOutlined />}>配置</Button>
                <span className="text-gray-400">OPENAI_API_KEY</span>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/deepseek-logo.png" alt="DeepSeek" className="w-8 h-8" />
                <span className="font-medium">DeepSeek</span>
                <Tooltip title="DeepSeek相关信息">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Button type="text" icon={<SettingOutlined />}>配置</Button>
                <span className="text-gray-400">DEEPSEEK_API_KEY</span>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/zhipu-logo.png" alt="智谱AI" className="w-8 h-8" />
                <span className="font-medium">智谱AI (Zhipu)</span>
                <Tooltip title="智谱AI相关信息">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Button type="text" icon={<SettingOutlined />}>配置</Button>
                <span className="text-gray-400">ZHIPUAI_API_KEY</span>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/together-logo.png" alt="Together" className="w-8 h-8" />
                <span className="font-medium">Together.ai</span>
                <Tooltip title="Together.ai相关信息">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Button type="text" icon={<SettingOutlined />}>配置</Button>
                <span className="text-gray-400">TOGETHER_API_KEY</span>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/dashscope-logo.png" alt="阿里百炼" className="w-8 h-8" />
                <span className="font-medium">阿里百炼 (DashScope)</span>
                <Tooltip title="阿里百炼相关信息">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Button type="text" icon={<SettingOutlined />}>配置</Button>
                <span className="text-gray-400">DASHSCOPE_API_KEY</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/ark-logo.png" alt="豆包" className="w-8 h-8" />
                <span className="font-medium">豆包 (Ark)</span>
                <Tooltip title="豆包相关信息">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Button type="text" icon={<SettingOutlined />}>配置</Button>
                <span className="text-gray-400">ARK_API_KEY</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelSettings; 