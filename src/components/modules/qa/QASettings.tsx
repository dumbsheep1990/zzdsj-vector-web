import React, { useState } from 'react';
import { Form, Switch, Button, Card, Space, Radio, message, Tag, Divider } from 'antd';
import { QuestionCircleOutlined, FileTextOutlined, DatabaseOutlined, PartitionOutlined } from '@ant-design/icons';

interface QASettingsFormValues {
  enableCache: boolean;
  answerMode: 'original' | 'summary';
}

interface QASettingsProps {
  assistantId: string;
  selectedQuestion: string | null;
}

// 测试数据：文档段
const mockSegments = [
  {
    id: 'seg1',
    content: '数据库连接配置需要设置以下参数：host、port、username、password。默认端口为3306。',
    similarity: 0.92,
    rank: 1,
    enabled: true,
    fileInfo: {
      name: '数据库配置指南.pdf',
      type: 'PDF',
      size: '2.5MB',
      path: '/docs/database/config.pdf'
    },
    indexInfo: {
      collection: 'database_config',
      partition: 'basic',
      indexType: 'vector',
      dimension: 1536
    }
  },
  {
    id: 'seg2',
    content: '在配置文件中，需要添加数据库连接池的配置，包括最大连接数、最小连接数、空闲超时等参数。',
    similarity: 0.85,
    rank: 2,
    enabled: true,
    fileInfo: {
      name: '数据库优化手册.docx',
      type: 'Word',
      size: '1.8MB',
      path: '/docs/database/optimization.docx'
    },
    indexInfo: {
      collection: 'database_config',
      partition: 'advanced',
      indexType: 'vector',
      dimension: 1536
    }
  },
  {
    id: 'seg3',
    content: '建议使用连接池管理数据库连接，避免频繁创建和关闭连接。常用的连接池有HikariCP、Druid等。',
    similarity: 0.78,
    rank: 3,
    enabled: false,
    fileInfo: {
      name: '数据库最佳实践.md',
      type: 'Markdown',
      size: '256KB',
      path: '/docs/database/best-practices.md'
    },
    indexInfo: {
      collection: 'database_config',
      partition: 'best-practices',
      indexType: 'vector',
      dimension: 1536
    }
  }
];

export const QASettings: React.FC<QASettingsProps> = ({ 
  selectedQuestion
}) => {
  const [form] = Form.useForm<QASettingsFormValues>();
  const [answerMode, setAnswerMode] = useState<'original' | 'summary'>('original');
  const [enabledSegments, setEnabledSegments] = useState<Record<string, boolean>>(
    mockSegments.reduce((acc, seg) => ({ ...acc, [seg.id]: seg.enabled }), {})
  );

  // 处理回答方式切换
  const handleAnswerModeChange = (mode: 'original' | 'summary') => {
    setAnswerMode(mode);
    // TODO: 保存设置到后端
    message.success(`已切换为${mode === 'original' ? '原文返回' : '模型总结'}模式`);
  };

  // 处理文档段启用/禁用
  const handleSegmentToggle = (segmentId: string, enabled: boolean) => {
    setEnabledSegments(prev => ({
      ...prev,
      [segmentId]: enabled
    }));
    // TODO: 保存设置到后端
    message.success(`已${enabled ? '启用' : '禁用'}该文档段`);
  };

  const handleSave = (values: QASettingsFormValues) => {
    console.log('Save settings:', values);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-auto">
        {/* 问答设置区域 */}
        <Card className="mb-6">
          <Form
            form={form}
            layout="horizontal"
            initialValues={{
              enableCache: true,
              answerMode: 'original'
            }}
            onFinish={handleSave}
          >
            <div className="flex items-center gap-6">
              <Form.Item
                label="启用缓存"
                name="enableCache"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label="回答方式" 
                name="answerMode"
                className="mb-0"
              >
                <Radio.Group 
                  value={answerMode}
                  onChange={e => handleAnswerModeChange(e.target.value)}
                >
                  <Radio.Button value="original">
                    <Space>
                      <FileTextOutlined />
                      原文返回
                    </Space>
                  </Radio.Button>
                  <Radio.Button value="summary">
                    <Space>
                      <QuestionCircleOutlined />
                      模型总结
                    </Space>
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item className="mb-0">
                <Button type="primary" htmlType="submit">
                  保存设置
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>

        {selectedQuestion && (
          <Card title="文档段设置">
            <div className="space-y-4">
              {mockSegments.map(segment => (
                <div 
                  key={segment.id}
                  className="p-4 border rounded-lg hover:border-blue-200 transition-colors"
                >
                  {/* 文档段基本信息 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Tag color="blue">排名 {segment.rank}</Tag>
                      <span className="text-sm text-gray-500">
                        相似度：{(segment.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Switch
                      checked={enabledSegments[segment.id] ?? true}
                      onChange={checked => handleSegmentToggle(segment.id, checked)}
                    />
                  </div>

                  {/* 文档段信息（单行布局） */}
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    {/* 文件信息 */}
                    <div className="flex items-center gap-2">
                      <FileTextOutlined />
                      <span className="font-medium">{segment.fileInfo.name}</span>
                      <span className="text-gray-400">•</span>
                      <span>{segment.fileInfo.type}</span>
                      <span className="text-gray-400">•</span>
                      <span>{segment.fileInfo.size}</span>
                    </div>

                    {/* 索引信息 */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DatabaseOutlined />
                        <span>{segment.indexInfo.collection}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PartitionOutlined />
                        <span>{segment.indexInfo.partition}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{segment.indexInfo.indexType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{segment.indexInfo.dimension}D</span>
                      </div>
                    </div>
                  </div>

                  {/* 文档段内容 */}
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {segment.content}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}; 