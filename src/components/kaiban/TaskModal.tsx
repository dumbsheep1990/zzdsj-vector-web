import React, { useState, useEffect } from 'react';
import { Task } from '../../services/kaibanService';

interface TaskModalProps {
  task?: Task | null;
  initialStatus?: Task['status'] | null;
  onSave: (taskData: Partial<Task>) => void;
  onCancel: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  initialStatus,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: '',
    tags: [],
    due_date: '',
  });

  const [tagInput, setTagInput] = useState('');

  // 初始化表单数据
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee || '',
        tags: task.tags || [],
        due_date: task.due_date || '',
      });
    } else if (initialStatus) {
      setFormData(prev => ({
        ...prev,
        status: initialStatus,
      }));
    }
  }, [task, initialStatus]);

  const handleInputChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('请输入任务标题');
      return;
    }
    onSave(formData);
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: 'white',
  };

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  };

  const tagContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const tagRemoveStyle: React.CSSProperties = {
    cursor: 'pointer',
    color: '#64748b',
    fontWeight: 'bold',
  };

  const tagInputContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  };

  const addTagButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const saveButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div style={modalStyle}>
        {/* 模态框头部 */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            {task ? '编辑任务' : '创建新任务'}
          </h2>
          <button
            style={closeButtonStyle}
            onClick={onCancel}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {/* 表单 */}
        <form style={formStyle} onSubmit={handleSubmit}>
          {/* 任务标题 */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>任务标题 *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              style={inputStyle}
              placeholder="输入任务标题..."
              required
            />
          </div>

          {/* 任务描述 */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>任务描述</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={textareaStyle}
              placeholder="输入任务描述..."
            />
          </div>

          {/* 状态和优先级 */}
          <div style={rowStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>状态</label>
              <select
                value={formData.status || 'todo'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                style={selectStyle}
              >
                <option value="todo">待办</option>
                <option value="in_progress">进行中</option>
                <option value="review">审核中</option>
                <option value="done">已完成</option>
              </select>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>优先级</label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                style={selectStyle}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </div>
          </div>

          {/* 分配者和截止日期 */}
          <div style={rowStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>分配者</label>
              <input
                type="text"
                value={formData.assignee || ''}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                style={inputStyle}
                placeholder="输入分配者姓名..."
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>截止日期</label>
              <input
                type="date"
                value={formData.due_date || ''}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* 标签 */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>标签</label>
            
            {/* 现有标签 */}
            {formData.tags && formData.tags.length > 0 && (
              <div style={tagContainerStyle}>
                {formData.tags.map((tag, index) => (
                  <span key={index} style={tagStyle}>
                    #{tag}
                    <span
                      style={tagRemoveStyle}
                      onClick={() => handleRemoveTag(tag)}
                      title="删除标签"
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}

            {/* 添加新标签 */}
            <div style={tagInputContainerStyle}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                style={inputStyle}
                placeholder="输入标签名称..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                style={addTagButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                添加
              </button>
            </div>
          </div>

          {/* 按钮组 */}
          <div style={buttonContainerStyle}>
            <button
              type="button"
              onClick={onCancel}
              style={cancelButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
            >
              取消
            </button>
            <button
              type="submit"
              style={saveButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              {task ? '更新任务' : '创建任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 