import React, { useState, useEffect } from 'react';
import { Card, List, Button, Tag, Modal, message, Badge, Tabs } from 'antd';
import { 
  QuestionCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { mockDocuments, mockSegments, mockQuestions, QASegment, QAQuestion } from '../../../utils/mockData';

interface DocumentDetailProps {
  questionId: string;
  assistantId: string;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({ questionId, assistantId }) => {
  const [activeTab, setActiveTab] = useState('answer');
  const [question, setQuestion] = useState<QAQuestion | null>(null);
  const [document, setDocument] = useState<any>(null);
  const [segment, setSegment] = useState<QASegment | null>(null);

  useEffect(() => {
    // 加载问题信息
    const currentQuestion = mockQuestions.find(q => q.id === questionId);
    setQuestion(currentQuestion || null);

    // 如果问题关联了文档，加载文档信息
    if (currentQuestion?.documentId) {
      const relatedDocument = mockDocuments.find(doc => doc.id === currentQuestion.documentId);
      setDocument(relatedDocument || null);

      // 如果问题关联了文档段落，加载段落信息
      if (currentQuestion.segmentId) {
        const relatedSegment = mockSegments.find(seg => seg.id === currentQuestion.segmentId);
        setSegment(relatedSegment || null);
      }
    }
  }, [questionId]);

  if (!question) {
    return <div className="text-center text-gray-500 mt-8">问题不存在</div>;
  }

  return (
    <div className="space-y-4">
      {/* 问题信息卡片 */}
      <Card className="shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium m-0">{question.question}</h2>
              <Tag color={question.status === 'active' ? 'success' : 'default'}>
                {question.status === 'active' ? '活跃' : '未启用'}
              </Tag>
            </div>
            <div className="mt-2 text-sm text-gray-500 space-x-4">
              <span>创建：{question.createTime}</span>
              <span>更新：{question.updateTime}</span>
            </div>
            {question.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <Tag key={index} className="m-0">{tag}</Tag>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              type="primary"
              ghost
              icon={<EditOutlined />}
            >
              编辑问题
            </Button>
            <Button 
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </div>
        </div>
      </Card>

      {/* 答案和知识库标签页 */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'answer',
              label: (
                <span className="flex items-center">
                  <QuestionCircleOutlined className="mr-2" />
                  问答设置
                </span>
              ),
              children: (
                <div className="space-y-4">
                  <div>
                    <div className="font-medium mb-2">回答方式</div>
                    <Tag color={question.answerType === 'original' ? 'success' : 'warning'}>
                      {question.answerType === 'original' ? '原文返回' : '模型总结'}
                    </Tag>
                  </div>
                  {document && (
                    <div>
                      <div className="font-medium mb-2">关联文档</div>
                      <Card size="small" className="bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{document.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span>{document.type}</span>
                              <span className="mx-2">·</span>
                              <span>{document.size}</span>
                            </div>
                          </div>
                          <Button 
                            type="link" 
                            icon={<LinkOutlined />}
                          >
                            更换文档
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                  {segment && (
                    <div>
                      <div className="font-medium mb-2">关联段落</div>
                      <Card size="small" className="bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge status="processing" text={`段落 ${segment.id}`} />
                          <Button 
                            type="link" 
                            icon={<LinkOutlined />}
                          >
                            更换段落
                          </Button>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {segment.content}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )
            },
            {
              key: 'knowledge',
              label: (
                <span className="flex items-center">
                  <FileTextOutlined className="mr-2" />
                  知识库
                </span>
              ),
              children: (
                <div>
                  <Button 
                    type="primary"
                    ghost
                    icon={<LinkOutlined />}
                    className="mb-4"
                  >
                    关联知识
                  </Button>
                  <List
                    dataSource={[]}
                    locale={{
                      emptyText: (
                        <div className="py-8 text-center text-gray-400">
                          <FileTextOutlined style={{ fontSize: 32 }} />
                          <div className="mt-2">暂无关联知识</div>
                        </div>
                      )
                    }}
                  />
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
}; 