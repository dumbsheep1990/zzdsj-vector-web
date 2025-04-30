import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { WorkflowFormValues } from '../../pages/workflow/types';
import { FormInstance } from 'antd/lib/form';

interface WorkflowSaveModalProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: WorkflowFormValues) => void;
  form: FormInstance;
  isCreateMode: boolean;
}

const WorkflowSaveModal: React.FC<WorkflowSaveModalProps> = ({
  visible,
  onCancel,
  onFinish,
  form,
  isCreateMode
}) => {
  return (
    <Modal
      title={isCreateMode ? "保存新工作流" : "更新工作流"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form 
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item 
          name="name" 
          label="工作流名称" 
          rules={[{ required: true, message: '请输入工作流名称' }]}
        >
          <Input placeholder="输入工作流名称" />
        </Form.Item>
        
        <Form.Item 
          name="description" 
          label="工作流描述"
        >
          <Input.TextArea rows={4} placeholder="描述此工作流的用途和功能" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WorkflowSaveModal; 