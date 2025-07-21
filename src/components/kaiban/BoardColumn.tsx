import React, { useState } from 'react';
import { Task } from '../../services/kaibanService';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onAddTask?: (status: Task['status']) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  status,
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return '#64748b';
      case 'in_progress': return '#3b82f6';
      case 'review': return '#f59e0b';
      case 'done': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return '📋';
      case 'in_progress': return '⚙️';
      case 'review': return '👀';
      case 'done': return '✅';
      default: return '📝';
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceStatus', status);
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // 只有当鼠标离开整个列区域时才设置dragOver为false
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus');
    
    if (taskId && sourceStatus !== status) {
      onTaskMove(taskId, status);
    }
  };

  const columnStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    border: '2px solid transparent',
    borderColor: dragOver ? getStatusColor(status) : '#e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '600px',
    width: '280px',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    padding: '8px 0',
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const countBadgeStyle: React.CSSProperties = {
    backgroundColor: getStatusColor(status),
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 500,
  };

  const addButtonStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px dashed #cbd5e1',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    transition: 'all 0.2s ease',
  };

  const tasksContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '4px',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '14px',
    fontStyle: 'italic',
    padding: '40px 20px',
    border: '2px dashed #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
  };

  const dropZoneStyle: React.CSSProperties = {
    minHeight: '100px',
    border: dragOver ? '2px dashed ' + getStatusColor(status) : '2px dashed transparent',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: dragOver ? getStatusColor(status) : '#cbd5e1',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    marginTop: '8px',
  };

  return (
    <div
      style={columnStyle}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 列标题 */}
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <div style={titleStyle}>
            <span>{getStatusIcon(status)}</span>
            {title}
          </div>
          <div style={countBadgeStyle}>
            {tasks.length}
          </div>
        </div>
        
        {onAddTask && (
          <button
            style={addButtonStyle}
            onClick={() => onAddTask(status)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = getStatusColor(status);
              e.currentTarget.style.backgroundColor = getStatusColor(status) + '10';
              e.currentTarget.style.color = getStatusColor(status);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
            title={`添加${title}任务`}
          >
            +
          </button>
        )}
      </div>

      {/* 任务列表 */}
      <div style={tasksContainerStyle}>
        {tasks.length === 0 ? (
          <div style={emptyStateStyle}>
            {dragOver ? `拖拽任务到${title}` : `暂无${title}任务`}
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragEnd={handleDragEnd}
            >
              <TaskCard
                task={task}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                isDragging={draggedTask === task.id}
              />
            </div>
          ))
        )}
        
        {/* 拖拽放置区域 */}
        {dragOver && tasks.length > 0 && (
          <div style={dropZoneStyle}>
            拖拽到此处
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardColumn; 