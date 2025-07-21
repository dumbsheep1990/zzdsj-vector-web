import React, { useState } from 'react';
import { Workflow, useWorkflows } from '../../services/kaibanService';

interface WorkflowManagerProps {
  selectedWorkflow?: Workflow | null;
  onWorkflowSelect: (workflow: Workflow | null) => void;
  onWorkflowCreate?: (workflow: Workflow) => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  selectedWorkflow,
  onWorkflowSelect,
  onWorkflowCreate,
}) => {
  const { workflows, loading, error, createWorkflow, updateWorkflow, deleteWorkflow } = useWorkflows();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    trigger_type: 'manual' as Workflow['trigger_type'],
    status: 'draft' as Workflow['status'],
    config: {},
  });

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWorkflow = await createWorkflow(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        version: '1.0.0',
        trigger_type: 'manual',
        status: 'draft',
        config: {},
      });
      onWorkflowCreate?.(newWorkflow);
      onWorkflowSelect(newWorkflow);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleEditWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkflow) return;
    
    try {
      const updatedWorkflow = await updateWorkflow(editingWorkflow.id, formData);
      setEditingWorkflow(null);
      setFormData({
        name: '',
        description: '',
        version: '1.0.0',
        trigger_type: 'manual',
        status: 'draft',
        config: {},
      });
      if (selectedWorkflow?.id === updatedWorkflow.id) {
        onWorkflowSelect(updatedWorkflow);
      }
    } catch (error) {
      console.error('Failed to update workflow:', error);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (window.confirm('确定要删除这个工作流吗？此操作不可撤销。')) {
      try {
        await deleteWorkflow(workflowId);
        if (selectedWorkflow?.id === workflowId) {
          onWorkflowSelect(null);
        }
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      }
    }
  };

  const startEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setFormData({
      name: workflow.name,
      description: workflow.description,
      version: workflow.version,
      trigger_type: workflow.trigger_type,
      status: workflow.status,
      config: workflow.config,
    });
  };

  const cancelEdit = () => {
    setEditingWorkflow(null);
    setShowCreateForm(false);
    setFormData({
      name: '',
      description: '',
      version: '1.0.0',
      trigger_type: 'manual',
      status: 'draft',
      config: {},
    });
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    height: 'fit-content',
    maxWidth: '400px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  };

  const createButtonStyle: React.CSSProperties = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const workflowListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const workflowItemStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '12px',
    border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isSelected ? '#eff6ff' : 'white',
  });

  const workflowHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  };

  const workflowNameStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
    flex: 1,
    marginRight: '8px',
  };

  const workflowActionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
  };

  const actionButtonStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const editButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    backgroundColor: '#f59e0b',
    color: 'white',
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    backgroundColor: '#ef4444',
    color: 'white',
  };

  const workflowMetaStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#64748b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const statusBadgeStyle = (status: Workflow['status']): React.CSSProperties => {
    const colors = {
      draft: { bg: '#f1f5f9', color: '#475569' },
      active: { bg: '#dcfce7', color: '#16a34a' },
      paused: { bg: '#fef3c7', color: '#d97706' },
      archived: { bg: '#fef2f2', color: '#dc2626' },
    };
    const statusColor = colors[status];
    
    return {
      backgroundColor: statusColor.bg,
      color: statusColor.color,
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 500,
    };
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: 'white',
  };

  const formButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const saveButtonStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const cancelButtonStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: '#f8fafc',
    color: '#64748b',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
    padding: '40px 20px',
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#64748b',
    padding: '20px',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px' }}>
          加载失败: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* 头部 */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>工作流管理</h2>
        {!showCreateForm && !editingWorkflow && (
          <button
            style={createButtonStyle}
            onClick={() => setShowCreateForm(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            + 新建
          </button>
        )}
      </div>

      {/* 创建/编辑表单 */}
      {(showCreateForm || editingWorkflow) && (
        <form style={formStyle} onSubmit={editingWorkflow ? handleEditWorkflow : handleCreateWorkflow}>
          <input
            type="text"
            placeholder="工作流名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={inputStyle}
            required
          />
          
          <textarea
            placeholder="工作流描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={textareaStyle}
          />

          <select
            value={formData.trigger_type}
            onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value as Workflow['trigger_type'] })}
            style={selectStyle}
          >
            <option value="manual">手动触发</option>
            <option value="scheduled">定时触发</option>
            <option value="event">事件触发</option>
          </select>

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Workflow['status'] })}
            style={selectStyle}
          >
            <option value="draft">草稿</option>
            <option value="active">活跃</option>
            <option value="paused">暂停</option>
            <option value="archived">归档</option>
          </select>

          <div style={formButtonsStyle}>
            <button type="submit" style={saveButtonStyle}>
              {editingWorkflow ? '更新' : '创建'}
            </button>
            <button type="button" style={cancelButtonStyle} onClick={cancelEdit}>
              取消
            </button>
          </div>
        </form>
      )}

      {/* 工作流列表 */}
      {!showCreateForm && !editingWorkflow && (
        <div style={workflowListStyle}>
          {workflows.length === 0 ? (
            <div style={emptyStateStyle}>
              暂无工作流<br/>点击"新建"创建第一个工作流
            </div>
          ) : (
            workflows.map((workflow) => (
              <div
                key={workflow.id}
                style={workflowItemStyle(selectedWorkflow?.id === workflow.id)}
                onClick={() => onWorkflowSelect(workflow)}
              >
                <div style={workflowHeaderStyle}>
                  <h3 style={workflowNameStyle}>{workflow.name}</h3>
                  <div style={workflowActionsStyle}>
                    <button
                      style={editButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(workflow);
                      }}
                      title="编辑"
                    >
                      ✏️
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkflow(workflow.id);
                      }}
                      title="删除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>
                  {workflow.description}
                </p>
                
                <div style={workflowMetaStyle}>
                  <span>v{workflow.version}</span>
                  <span style={statusBadgeStyle(workflow.status)}>
                    {workflow.status === 'draft' && '草稿'}
                    {workflow.status === 'active' && '活跃'}
                    {workflow.status === 'paused' && '暂停'}
                    {workflow.status === 'archived' && '归档'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowManager; 