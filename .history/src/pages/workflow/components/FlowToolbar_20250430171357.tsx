import React from 'react';
import { Button, Tooltip } from 'antd';
import {
  UndoOutlined,
  RedoOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  ClearOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { FlowToolbarProps } from '../types';

const FlowToolbar: React.FC<FlowToolbarProps> = ({
  onUndo,
  onRedo,
  onLock,
  onUnlock,
  onDeleteNode,
  onClearAll,
  onZoomIn,
  onZoomOut,
  onFitView,
  onSave,
  onCancel,
  isLocked,
  hasSelectedNode,
  canUndo,
  canRedo
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        background: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}
    >
      <Tooltip title={canUndo ? "撤销" : "没有可撤销的操作"}>
        <Button
          icon={<UndoOutlined />}
          onClick={onUndo}
          disabled={!canUndo}
          type={canUndo ? "default" : "text"}
        />
      </Tooltip>
      <Tooltip title={canRedo ? "重做" : "没有可重做的操作"}>
        <Button
          icon={<RedoOutlined />}
          onClick={onRedo}
          disabled={!canRedo}
          type={canRedo ? "default" : "text"}
        />
      </Tooltip>
      {isLocked ? (
        <Tooltip title="解锁节点">
          <Button
            icon={<UnlockOutlined />}
            onClick={onUnlock}
            type="primary"
          />
        </Tooltip>
      ) : (
        <Tooltip title="锁定节点">
          <Button
            icon={<LockOutlined />}
            onClick={onLock}
          />
        </Tooltip>
      )}
      <Tooltip title={hasSelectedNode ? "删除选中节点" : "请先选择节点"}>
        <Button
          icon={<DeleteOutlined />}
          onClick={onDeleteNode}
          disabled={!hasSelectedNode}
          danger={hasSelectedNode}
        />
      </Tooltip>
      <Tooltip title="清空所有">
        <Button
          icon={<ClearOutlined />}
          onClick={onClearAll}
          danger
        />
      </Tooltip>
      <div style={{ width: '1px', background: '#eee', margin: '0 5px' }}></div>
      <Tooltip title="放大">
        <Button icon={<ZoomInOutlined />} onClick={onZoomIn} />
      </Tooltip>
      <Tooltip title="缩小">
        <Button icon={<ZoomOutOutlined />} onClick={onZoomOut} />
      </Tooltip>
      <Tooltip title="适应视图">
        <Button icon={<FullscreenOutlined />} onClick={onFitView} />
      </Tooltip>
      <div style={{ width: '1px', background: '#eee', margin: '0 5px' }}></div>
      <Tooltip title="取消">
        <Button icon={<CloseOutlined />} onClick={onCancel} />
      </Tooltip>
      <Tooltip title="保存工作流">
        <Button type="primary" icon={<SaveOutlined />} onClick={onSave} />
      </Tooltip>
    </div>
  );
};

export default FlowToolbar; 