import React, { useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QuillEditor = ReactQuill as any;

interface AddQuestionModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: {
    question: string;
    answer: string;
    mode: 'manual' | 'smart';
  }) => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  open,
  onCancel,
  onOk
}) => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<'manual' | 'smart'>('manual');
  const [answer, setAnswer] = useState('');

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk({
        ...values,
        answer,
        mode
      });
      form.resetFields();
      setAnswer('');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAnswer('');
    onCancel();
  };

  return (
    <Modal
      title="新增问题"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      width={800}
      okText="保存"
      cancelText="取消"
      okButtonProps={{ style: { backgroundColor: '#1890ff', borderColor: '#1890ff' } }}
      styles={{
        mask: {
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        },
        content: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ mode: 'manual' }}
      >
        <Form.Item
          name="question"
          label="问题"
          rules={[{ required: true, message: '请输入问题' }]}
        >
          <TextArea
            placeholder="请输入问题"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="mode"
          label="回答模式"
          tooltip={{
            title: '手动模式：直接输入答案；智能模式：系统自动检索匹配',
            icon: <QuestionCircleOutlined />
          }}
        >
          <Select
            value={mode}
            onChange={(value) => setMode(value)}
            options={[
              { label: '手动输入', value: 'manual' },
              { label: '智能检索', value: 'smart' }
            ]}
          />
        </Form.Item>

        {mode === 'manual' ? (
          <Form.Item
            label="答案"
            required
            tooltip={{
              title: '使用富文本编辑器输入答案',
              icon: <QuestionCircleOutlined />
            }}
          >
            <QuillEditor
              theme="snow"
              value={answer}
              onChange={setAnswer}
              style={{ height: '200px', marginBottom: '50px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
            />
          </Form.Item>
        ) : (
          <Form.Item
            label="智能检索"
            tooltip={{
              title: '系统将自动检索知识库并生成答案',
              icon: <QuestionCircleOutlined />
            }}
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                系统将根据问题内容自动检索知识库，并生成最佳答案。
                您可以在答案生成后进行编辑和调整。
              </p>
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddQuestionModal; 