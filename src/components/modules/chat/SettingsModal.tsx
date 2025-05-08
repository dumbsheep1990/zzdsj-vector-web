import React, { useEffect } from 'react';
import { Modal, Form, Select, Switch, Slider, InputNumber, message } from 'antd';
import { Settings } from '../../../hooks/chat/useChatSettings';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

/**
 * 聊天设置对话框组件
 * 
 * 提供对话参数设置界面，包括模型选择、温度、最大Token等
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ 
  visible, 
  onClose, 
  settings, 
  onSave 
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(settings);
    }
  }, [visible, settings, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={<div style={{ fontSize: '17px', fontWeight: 600, color: '#1677ff' }}>对话设置</div>}
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ 
        style: { 
          background: '#1677ff', 
          borderColor: '#1677ff',
          boxShadow: '0 2px 4px rgba(24, 144, 255, 0.35)',
          fontWeight: 500
        } 
      }}
      width={600}
      destroyOnClose
      styles={{
        header: {
          background: '#1677ff',
          borderRadius: '10px 10px 0 0',
          padding: '16px 24px',
          borderBottom: '1px solid #d9d9d9',
        },
        body: {
          padding: '24px',
        },
        footer: {
          borderTop: '1px solid #d9d9d9',
          padding: '12px 24px',
        },
        mask: {
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(3px)'
        },
        content: {
          borderRadius: '10px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
      >
        <Form.Item
          label="语言模型"
          name="model"
          tooltip="选择不同的语言模型将影响回答的质量和速度"
        >
          <Select>
            <Select.Option value="deepseek-coder">Deepseek Coder</Select.Option>
            <Select.Option value="deepseek-chat">Deepseek Chat</Select.Option>
            <Select.Option value="qwen-plus">Qwen Plus</Select.Option>
            <Select.Option value="qwen-max">Qwen Max</Select.Option>
            <Select.Option value="qwen-turbo">Qwen Turbo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="温度"
          name="temperature"
          tooltip="较高的值会使输出更加随机，较低的值会使其更加集中和确定"
        >
          <Slider
            min={0}
            max={1}
            step={0.1}
            marks={{
              0: '精确',
              0.5: '平衡',
              1: '创造'
            }}
          />
        </Form.Item>

        <Form.Item
          label="最大Token数"
          name="maxTokens"
          tooltip="单次回复的最大字符数量"
        >
          <InputNumber
            min={500}
            max={8000}
            defaultValue={2048}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="历史轮数"
          name="historyRounds"
          tooltip="设置固定数量的历史轮数，超过该数量的轮数将被删除"
        >
          <Slider
            min={1}
            max={12}
            step={1}
            marks={{
              1: '1',
              6: '6',
              12: '12'
            }}
          />
        </Form.Item>

        <Form.Item
          label="自动滚动"
          name="autoScroll"
          valuePropName="checked"
          tooltip="新消息出现时是否自动滚动到底部"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
