import React from 'react';
import { Modal, Table, Button } from 'antd';
import { ToolConfig } from '../../pages/workflow/types';

interface ToolSelectionModalProps {
  visible: boolean;
  onCancel: () => void;
  tools: ToolConfig[];
  onSelectTool: (tool: ToolConfig) => void;
}

const ToolSelectionModal: React.FC<ToolSelectionModalProps> = ({
  visible,
  onCancel,
  tools,
  onSelectTool
}) => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: ToolConfig) => (
        <Button type="primary" size="small" onClick={() => onSelectTool(record)}>
          添加
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="选择工具"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Table 
        dataSource={tools} 
        columns={columns} 
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
};

export default ToolSelectionModal; 