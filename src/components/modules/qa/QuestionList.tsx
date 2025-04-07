import React, { useState } from 'react';
import { List, Button, Input, Modal, Tag, Tooltip, message, Pagination } from 'antd';
import { 
  QuestionCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { mockQuestions, mockDocuments, QAQuestion } from '../../../utils/mockData';

interface QuestionListProps {
  assistantId: string;
  onSelectQuestion: (questionId: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ assistantId, onSelectQuestion }) => {
  const [questions, setQuestions] = useState<QAQuestion[]>(mockQuestions);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QAQuestion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 删除问题
  const handleDelete = (questionId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个问题吗？',
      okText: '确认',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => {
        setQuestions(questions.filter(q => q.id !== questionId));
        message.success('问题已删除');
      }
    });
  };

  // 编辑问题
  const handleEdit = (question: QAQuestion) => {
    setEditingQuestion(question);
    setIsModalVisible(true);
  };

  // 过滤问题
  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchText.toLowerCase())
  );

  // 分页数据
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 获取文档标题
  const getDocumentTitle = (documentId: string | null) => {
    if (!documentId) return null;
    const document = mockDocuments.find(doc => doc.id === documentId);
    return document?.title || null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* 搜索和添加区域 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="搜索问题..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            添加
          </Button>
        </div>
      </div>

      {/* 问题列表 */}
      <div className="flex-1 overflow-auto">
        <List
          dataSource={paginatedQuestions}
          renderItem={question => (
            <List.Item
              key={question.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onSelectQuestion(question.id)}
              actions={[
                <Tooltip title="关联文档" key="link">
                  <Button
                    type="text"
                    icon={<LinkOutlined />}
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // 处理文档关联
                    }}
                  />
                </Tooltip>,
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEdit(question)}
                />,
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(question.id)}
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                    <QuestionCircleOutlined className="text-blue-500 text-xl" />
                  </div>
                }
                title={
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-medium">{question.question}</span>
                    {question.documentId && (
                      <Tag color="blue">
                        {getDocumentTitle(question.documentId)}
                        {question.segmentId && ` - 段落 ${question.segmentId}`}
                      </Tag>
                    )}
                    <Tag 
                      color={question.answerType === 'original' ? 'success' : 'warning'}
                    >
                      {question.answerType === 'original' ? '原文返回' : '模型总结'}
                    </Tag>
                    <Tag 
                      color={question.status === 'active' ? 'success' : 'default'}
                    >
                      {question.status === 'active' ? '活跃' : '未启用'}
                    </Tag>
                  </div>
                }
                description={
                  <div className="text-xs text-gray-500 mt-2 space-y-2">
                    <div className="flex items-center space-x-4">
                      <span>创建：{question.createTime}</span>
                      <span>更新：{question.updateTime}</span>
                    </div>
                    {question.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        {question.tags.map(tag => (
                          <Tag key={tag} className="m-0">{tag}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div className="py-8 text-center text-gray-400">
                <QuestionCircleOutlined style={{ fontSize: 32 }} />
                <div className="mt-2">暂无问题</div>
              </div>
            )
          }}
        />
      </div>

      {/* 分页 */}
      <div className="p-4 border-t border-gray-100">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredQuestions.length}
          onChange={setCurrentPage}
          size="small"
          showSizeChanger={false}
        />
      </div>

      {/* 添加/编辑问题模态框 */}
      <Modal
        title={editingQuestion ? '编辑问题' : '添加问题'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingQuestion(null);
        }}
        footer={null}
      >
        {/* 这里可以添加问题表单组件 */}
      </Modal>
    </div>
  );
}; 