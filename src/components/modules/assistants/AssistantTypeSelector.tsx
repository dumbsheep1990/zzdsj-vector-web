import React from 'react';
import { Card, Typography } from 'antd';
import { RobotOutlined, BookOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export type AssistantType = 'regular' | 'knowledge' | 'planning';

interface AssistantTypeSelectorProps {
  onTypeSelect: (type: AssistantType) => void;
}

const AssistantTypeSelector: React.FC<AssistantTypeSelectorProps> = ({ onTypeSelect }) => {
  return (
    <div className="pt-4">
      <Title level={4} className="text-center mb-6">选择助手类型</Title>

      <div className="grid grid-cols-3 gap-6">
        {/* 普通问答助手 */}
        <Card 
          hoverable 
          className="border-blue-200 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden h-full"
          onClick={() => onTypeSelect('regular')}
          bodyStyle={{ padding: '24px', height: '100%' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <div className="absolute -right-12 -top-12 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
          
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-500 rounded-full">
                <RobotOutlined style={{ fontSize: '32px' }} />
              </div>
            </div>
            
            <Title level={5} className="text-blue-600 text-center mb-3">普通问答助手</Title>
            
            <Paragraph className="text-gray-500 mb-4 text-center text-sm flex-grow">
              直接与模型通过对话方式和提示词控制进行问答
            </Paragraph>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Text className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">提示词定制</Text>
              <Text className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">简单问答</Text>
            </div>
            
            <Text type="secondary" className="text-xs text-center mt-auto">
              适合: 简单对话、创意写作
            </Text>
          </div>
        </Card>

        {/* 知识问答助手 */}
        <Card 
          hoverable 
          className="border-green-200 hover:border-green-500 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden h-full"
          onClick={() => onTypeSelect('knowledge')}
          bodyStyle={{ padding: '24px', height: '100%' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="absolute -right-12 -top-12 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
          
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full">
                <BookOutlined style={{ fontSize: '32px' }} />
              </div>
            </div>
            
            <Title level={5} className="text-green-600 text-center mb-3">知识问答助手</Title>
            
            <Paragraph className="text-gray-500 mb-4 text-center text-sm flex-grow">
              关联知识库、知识图谱进行精准问答
            </Paragraph>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Text className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">知识库检索</Text>
              <Text className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">知识图谱</Text>
            </div>
            
            <Text type="secondary" className="text-xs text-center mt-auto">
              适合: 客服问答、知识咨询
            </Text>
          </div>
        </Card>

        {/* 自主规划助手 */}
        <Card 
          hoverable 
          className="border-purple-200 hover:border-purple-500 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden h-full"
          onClick={() => onTypeSelect('planning')}
          bodyStyle={{ padding: '24px', height: '100%' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
          <div className="absolute -right-12 -top-12 w-24 h-24 bg-purple-50 rounded-full opacity-50"></div>
          
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-purple-100 text-purple-500 rounded-full">
                <ThunderboltOutlined style={{ fontSize: '32px' }} />
              </div>
            </div>
            
            <Title level={5} className="text-purple-600 text-center mb-3">自主规划助手</Title>
            
            <Paragraph className="text-gray-500 mb-4 text-center text-sm flex-grow">
              调用系统所有工具和资源完成特定任务
            </Paragraph>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Text className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">多步规划</Text>
              <Text className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">全工具调用</Text>
            </div>
            
            <Text type="secondary" className="text-xs text-center mt-auto">
              适合: 复杂任务、流程自动化
            </Text>
          </div>
        </Card>
      </div>

      <div className="mt-6 text-center">
        <Text type="secondary">选择助手类型后，您将进入详细配置页面</Text>
      </div>
    </div>
  );
};

export default AssistantTypeSelector; 