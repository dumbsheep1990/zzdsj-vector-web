import React from 'react';
import { Task } from '../../services/kaibanService';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  isDragging = false 
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '无';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
    transform: isDragging ? 'rotate(3deg)' : 'none',
    opacity: isDragging ? 0.8 : 1,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    lineHeight: '1.4',
    flex: 1,
    marginRight: '8px',
  };

  const priorityBadgeStyle: React.CSSProperties = {
    backgroundColor: getPriorityColor(task.priority),
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 500,
    flexShrink: 0,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.4',
    marginBottom: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: '#64748b',
  };

  const tagsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '8px',
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 400,
  };

  const assigneeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const avatarStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 500,
  };

  const dueDateStyle: React.CSSProperties = {
    color: task.due_date && new Date(task.due_date) < new Date() ? '#ef4444' : '#64748b',
    fontWeight: task.due_date && new Date(task.due_date) < new Date() ? 500 : 400,
  };

  const actionsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    gap: '4px',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  };

  const actionButtonStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    transition: 'all 0.2s ease',
  };

  const editButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    backgroundColor: '#ef4444',
    color: 'white',
  };

  return (
    <div 
      style={{ ...cardStyle, position: 'relative' }}
      onMouseEnter={(e) => {
        const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
        if (actions) actions.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        const actions = e.currentTarget.querySelector('.task-actions') as HTMLElement;
        if (actions) actions.style.opacity = '0';
      }}
      onClick={() => onEdit?.(task)}
    >
      {/* 操作按钮 */}
      <div className="task-actions" style={actionsStyle}>
        {onEdit && (
          <button
            style={editButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            title="编辑任务"
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button
            style={deleteButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            title="删除任务"
          >
            🗑️
          </button>
        )}
      </div>

      {/* 任务头部 */}
      <div style={headerStyle}>
        <div style={titleStyle}>{task.title}</div>
        <div style={priorityBadgeStyle}>
          {getPriorityText(task.priority)}
        </div>
      </div>

      {/* 任务描述 */}
      {task.description && (
        <div style={descriptionStyle}>
          {task.description}
        </div>
      )}

      {/* 标签 */}
      {task.tags && task.tags.length > 0 && (
        <div style={tagsStyle}>
          {task.tags.map((tag, index) => (
            <span key={index} style={tagStyle}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 任务底部信息 */}
      <div style={footerStyle}>
        <div style={assigneeStyle}>
          {task.assignee && (
            <>
              <div style={avatarStyle}>
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span>{task.assignee}</span>
            </>
          )}
        </div>
        
        <div style={dueDateStyle}>
          {task.due_date && formatDate(task.due_date)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 