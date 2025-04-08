import React, { useState } from 'react';
import { List, Button, Modal, Tag, Tooltip, message, Pagination, Collapse, Input, Progress } from 'antd';
import { 
  QuestionCircleOutlined,
  EditOutlined,
  PlusOutlined,
  LikeOutlined,
  DislikeOutlined,
  OrderedListOutlined,
  FileTextOutlined,
  PartitionOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { mockQuestions, type Question, type Answer } from '../../../utils/mockData/qaData';
import { useNavigate } from 'react-router-dom';

interface QuestionListProps {
  assistantId: string;
  onSelectQuestion?: (questionId: string) => void;
  onDocumentManage?: (documentId: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ 
  assistantId, 
  onSelectQuestion,
  onDocumentManage 
}) => {
  const navigate = useNavigate();
  
  // 转换 mockQuestions 数据结构以匹配 Question 接口
  const initialQuestions: Question[] = mockQuestions.map(q => ({
    ...q,
    answers: (q.answers || []).map((a: Answer) => ({
      ...a,
      feedback: a.feedback as 'positive' | 'negative' | null
    })),
    tags: q.tags || [],
    documentId: q.documentId || undefined,
    segmentId: q.segmentId || undefined,
    status: q.status as 'active' | 'inactive'
  }));

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAnswer, setEditingAnswer] = useState<{questionId: string, answer: Answer | null}>({
    questionId: '',
    answer: null
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const pageSize = 10;

  // 处理问题点击
  const handleQuestionClick = (questionId: string) => {
    if (onSelectQuestion) {
      onSelectQuestion(questionId);
    }
  };

  // 处理答案反馈
  const handleFeedback = (questionId: string, answerId: string, feedback: 'positive' | 'negative') => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map((a: Answer) => {
            if (a.id === answerId) {
              return {
                ...a,
                feedback: a.feedback === feedback ? null : feedback
              };
            }
            return a;
          })
        };
      }
      return q;
    }));
  };

  // 添加手动答案
  const handleAddAnswer = (questionId: string) => {
    setEditingAnswer({ questionId, answer: null });
    setNewAnswerContent('');
    setIsModalVisible(true);
  };

  // 编辑答案
  const handleEditAnswer = (questionId: string, answer: Answer) => {
    setEditingAnswer({ questionId, answer });
    setNewAnswerContent(answer.content);
    setIsModalVisible(true);
  };

  // 保存答案
  const handleSaveAnswer = () => {
    if (!newAnswerContent.trim()) {
      message.error('答案内容不能为空');
      return;
    }

    setQuestions(prev => prev.map(q => {
      if (q.id === editingAnswer.questionId) {
        const answers = editingAnswer.answer
          ? q.answers.map((a: Answer) => a.id === editingAnswer.answer?.id 
              ? { ...a, content: newAnswerContent }
              : a)
          : [...q.answers, {
              id: Date.now().toString(),
              content: newAnswerContent,
              source: '手动添加',
              confidence: 1,
              rank: q.answers.length + 1,
              feedback: null,
              isManual: true,
              createTime: new Date().toISOString(),
              documentInfo: {
                title: '',
                page: 0,
                segment: '',
                segmentId: '',
                similarity: 0,
                relevanceScore: 0
              }
            }];
        return { ...q, answers };
      }
      return q;
    }));

    setIsModalVisible(false);
    setEditingAnswer({ questionId: '', answer: null });
    setNewAnswerContent('');
    message.success('保存成功');
  };

  // 处理文档信息展示
  const handleDocumentInfo = (e: React.MouseEvent, questionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectQuestion) {
      onSelectQuestion(questionId);
    }
  };

  const renderScoreBar = (score: number, title: string) => (
    <Tooltip title={`${title}: ${(score * 100).toFixed(1)}%`}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 whitespace-nowrap">{title}</span>
          <span className="text-xs text-blue-500 font-medium">{(score * 100).toFixed(1)}%</span>
        </div>
        <Progress 
          percent={score * 100} 
          size="small" 
          showInfo={false}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          className="w-16"
        />
      </div>
    </Tooltip>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <List
          dataSource={questions}
          renderItem={question => (
            <div 
              className="mb-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all cursor-pointer"
              onClick={() => handleQuestionClick(question.id)}
            >
              <div className="p-4">
                {/* 问题头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <QuestionCircleOutlined className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {question.question}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>创建：{new Date(question.createTime).toLocaleString()}</span>
                        <span>•</span>
                        <span>更新：{new Date(question.updateTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {question.documentId && (
                      <Button
                        type="text"
                        icon={<FileTextOutlined />}
                        onClick={(e) => handleDocumentInfo(e, question.id)}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        文档信息
                      </Button>
                    )}
                    <Button 
                      type="text" 
                      icon={<PlusOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddAnswer(question.id);
                      }}
                    >
                      添加答案
                    </Button>
                  </div>
                </div>

                {/* 标签 */}
                {question.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag: string) => (
                      <Tag key={tag} className="px-2 py-1">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                )}

                {/* 答案列表 */}
                <Collapse 
                  defaultActiveKey={[question.id]}
                  className="border-none bg-transparent"
                >
                  <Collapse.Panel 
                    key={question.id}
                    header={
                      <div className="flex items-center gap-2 text-sm">
                        <OrderedListOutlined />
                        <span>{question.answers?.length || 0} 个答案</span>
                      </div>
                    }
                    className="border-none bg-transparent"
                  >
                    <div className="space-y-3 mt-2">
                      {question.answers?.map((answer: Answer) => (
                        <div 
                          key={answer.id}
                          className={`p-4 rounded-lg ${
                            answer.isManual ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* 答案头部信息 */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Tag color={answer.isManual ? 'blue' : 'default'}>
                                {answer.isManual ? '手动添加' : '智能回答'}
                              </Tag>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <OrderedListOutlined />
                                <span>排名：{answer.rank}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip title="赞同">
                                <Button
                                  type="text"
                                  icon={<LikeOutlined />}
                                  className={answer.feedback === 'positive' ? 'text-blue-500' : ''}
                                  onClick={() => handleFeedback(question.id, answer.id, 'positive')}
                                />
                              </Tooltip>
                              <Tooltip title="不赞同">
                                <Button
                                  type="text"
                                  icon={<DislikeOutlined />}
                                  className={answer.feedback === 'negative' ? 'text-red-500' : ''}
                                  onClick={() => handleFeedback(question.id, answer.id, 'negative')}
                                />
                              </Tooltip>
                              {answer.isManual && (
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditAnswer(question.id, answer)}
                                />
                              )}
                            </div>
                          </div>

                          {/* 答案内容 */}
                          <div className="text-gray-700 whitespace-pre-wrap mb-3">
                            {answer.content}
                          </div>

                          {/* 文档和检索信息 */}
                          {!answer.isManual && answer.documentInfo && (
                            <div className="border-t border-gray-100 pt-3">
                              <div className="flex flex-col gap-2">
                                {/* 文档信息 */}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <FileTextOutlined />
                                    <span>{answer.documentInfo.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <PartitionOutlined />
                                    <span>
                                      {answer.documentInfo.segment}
                                      {answer.documentInfo.page && ` (第 ${answer.documentInfo.page} 页)`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                      段落ID: {answer.documentInfo.segmentId}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* 评分信息 */}
                                <div className="flex items-center gap-6 bg-gray-50 p-2 rounded">
                                  {renderScoreBar(answer.confidence, '置信度')}
                                  {renderScoreBar(answer.documentInfo.similarity, '相似度')}
                                  {renderScoreBar(answer.documentInfo.relevanceScore, '相关度')}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
            </div>
          )}
        />
      </div>

      {/* 分页 */}
      <div className="p-4 border-t border-gray-100">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={questions.length}
          onChange={setCurrentPage}
          size="small"
          showSizeChanger={false}
        />
      </div>

      {/* 添加/编辑答案模态框 */}
      <Modal
        title={editingAnswer.answer ? '编辑答案' : '添加答案'}
        open={isModalVisible}
        onOk={handleSaveAnswer}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAnswer({ questionId: '', answer: null });
          setNewAnswerContent('');
        }}
        okText="保存"
        cancelText="取消"
      >
        <Input.TextArea
          rows={6}
          value={newAnswerContent}
          onChange={e => setNewAnswerContent(e.target.value)}
          placeholder="请输入答案内容..."
          className="mb-4"
        />
      </Modal>
    </div>
  );
}; 