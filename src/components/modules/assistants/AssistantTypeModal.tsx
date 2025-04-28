import React from 'react';
import { Modal } from 'antd';
import AssistantTypeSelector, { AssistantType } from './AssistantTypeSelector';

export interface AssistantTypeModalProps {
  open: boolean;
  onCancel: () => void;
  onTypeSelect: (type: AssistantType) => void;
}

const AssistantTypeModal: React.FC<AssistantTypeModalProps> = ({
  open,
  onCancel,
  onTypeSelect,
}) => {
  return (
    <Modal
      title="选择助手类型"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      bodyStyle={{ padding: '24px 32px 32px' }}
    >
      <AssistantTypeSelector onTypeSelect={onTypeSelect} />
    </Modal>
  );
};

export default AssistantTypeModal;