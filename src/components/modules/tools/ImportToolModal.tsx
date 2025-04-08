import React, { useState } from 'react';
import { Modal, Form, Input, Select, Tag } from 'antd';
import type { ToolCategory } from '../../../utils/mockToolsData';

const { Option } = Select;
const { TextArea } = Input;

interface ImportValues {
  name: string;
  category: ToolCategory;
  description: string;
  tags: string[];
}

interface ImportToolModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: ImportValues) => void;
}

const ImportToolModal: React.FC<ImportToolModalProps> = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputValue('');
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk({ ...values, tags });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="导入工具"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ category: 'crawler' }}
      >
        <Form.Item
          name="name"
          label="工具名称"
          rules={[{ required: true, message: '请输入工具名称' }]}
        >
          <Input placeholder="请输入工具名称" />
        </Form.Item>

        <Form.Item
          name="category"
          label="工具分类"
          rules={[{ required: true, message: '请选择工具分类' }]}
        >
          <Select placeholder="请选择工具分类">
            <Option value="crawler">数据爬取</Option>
            <Option value="cleaner">数据清洗</Option>
            <Option value="formatter">数据格式化</Option>
            <Option value="generator">数据集生成</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="工具描述"
          rules={[{ required: true, message: '请输入工具描述' }]}
        >
          <TextArea rows={4} placeholder="请输入工具描述" />
        </Form.Item>

        <Form.Item label="标签">
          <div>
            {tags.map(tag => (
              <Tag
                key={tag}
                closable
                onClose={() => handleTagClose(tag)}
                style={{ marginBottom: 8 }}
              >
                {tag}
              </Tag>
            ))}
            <Input
              type="text"
              size="small"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
              placeholder="输入标签后按回车"
              style={{ width: 120 }}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ImportToolModal; 