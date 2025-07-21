import React, { useState, useEffect } from 'react';
import { Task, Board, useTasks, useBoards } from '../../services/kaibanService';
import BoardColumn from './BoardColumn';
import TaskModal from './TaskModal';

interface KaibanBoardProps {
  boardId?: string;
  workflowId?: string;
  onBoardChange?: (board: Board) => void;
}

const KaibanBoard: React.FC<KaibanBoardProps> = ({
  boardId,
  workflowId,
  onBoardChange,
}) => {
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask, moveTask } = useTasks();
  const { boards, loading: boardsLoading, createBoard } = useBoards();
  
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string | 'all'>('all');

  // 状态列配置
  const columns = [
    { status: 'todo' as Task['status'], title: '待办', color: '#64748b' },
    { status: 'in_progress' as Task['status'], title: '进行中', color: '#3b82f6' },
    { status: 'review' as Task['status'], title: '审核中', color: '#f59e0b' },
    { status: 'done' as Task['status'], title: '已完成', color: '#10b981' },
  ];

  // 初始化当前看板
  useEffect(() => {
    if (boardId && boards.length > 0) {
      const board = boards.find(b => b.id === boardId);
      if (board) {
        setCurrentBoard(board);
        onBoardChange?.(board);
      }
    } else if (!boardId && boards.length > 0) {
      // 如果没有指定boardId，使用第一个看板
      setCurrentBoard(boards[0]);
      onBoardChange?.(boards[0]);
    }
  }, [boardId, boards, onBoardChange]);

  // 创建默认看板（如果没有看板）
  useEffect(() => {
    if (!boardsLoading && boards.length === 0 && workflowId) {
      createBoard({
        name: '默认看板',
        description: '工作流默认看板',
        workflow_id: workflowId,
        columns: ['todo', 'in_progress', 'review', 'done'],
      });
    }
  }, [boardsLoading, boards.length, workflowId, createBoard]);

  // 过滤任务
  const getFilteredTasks = (status: Task['status']) => {
    return tasks
      .filter(task => task.status === status)
      .filter(task => {
        if (currentBoard && task.board_id && task.board_id !== currentBoard.id) {
          return false;
        }
        return true;
      })
      .filter(task => {
        if (searchQuery) {
          return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 task.description.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
      .filter(task => {
        if (filterPriority !== 'all') {
          return task.priority === filterPriority;
        }
        return true;
      })
      .filter(task => {
        if (filterAssignee !== 'all') {
          return task.assignee === filterAssignee;
        }
        return true;
      });
  };

  // 获取所有分配者
  const getAllAssignees = () => {
    const assignees = tasks
      .map(task => task.assignee)
      .filter(assignee => assignee)
      .filter((assignee, index, array) => array.indexOf(assignee) === index);
    return assignees as string[];
  };

  // 处理任务移动
  const handleTaskMove = async (taskId: string, newStatus: Task['status']) => {
    try {
      await moveTask(taskId, newStatus, currentBoard?.id);
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  // 处理添加任务
  const handleAddTask = (status: Task['status']) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setShowTaskModal(true);
  };

  // 处理编辑任务
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskStatus(null);
    setShowTaskModal(true);
  };

  // 处理删除任务
  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('确定要删除这个任务吗？')) {
      try {
        // 这里应该调用删除API
        console.log('Delete task:', taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  // 处理保存任务
  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask({
          ...taskData,
          status: newTaskStatus || 'todo',
          board_id: currentBoard?.id,
        } as Omit<Task, 'id' | 'created_at' | 'updated_at'>);
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setNewTaskStatus(null);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  // 获取看板统计信息
  const getBoardStats = () => {
    const allTasks = tasks.filter(task => 
      !currentBoard || !task.board_id || task.board_id === currentBoard.id
    );
    
    return {
      total: allTasks.length,
      todo: allTasks.filter(t => t.status === 'todo').length,
      inProgress: allTasks.filter(t => t.status === 'in_progress').length,
      review: allTasks.filter(t => t.status === 'review').length,
      done: allTasks.filter(t => t.status === 'done').length,
    };
  };

  const containerStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#f1f5f9',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#64748b',
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const searchInputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minWidth: '200px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
  };

  const boardStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    paddingBottom: '20px',
  };

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '16px',
    color: '#64748b',
  };

  const errorStyle: React.CSSProperties = {
    color: '#ef4444',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    margin: '20px 0',
  };

  if (tasksLoading || boardsLoading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          🔄 加载中...
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          ❌ 加载失败: {tasksError}
        </div>
      </div>
    );
  }

  const stats = getBoardStats();

  return (
    <div style={containerStyle}>
      {/* 看板头部 */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            📋 {currentBoard?.name || '工作流看板'}
          </h1>
          <div style={statsStyle}>
            <div style={statItemStyle}>
              📊 总计: <strong>{stats.total}</strong>
            </div>
            <div style={statItemStyle}>
              ⏳ 待办: <strong>{stats.todo}</strong>
            </div>
            <div style={statItemStyle}>
              ⚙️ 进行中: <strong>{stats.inProgress}</strong>
            </div>
            <div style={statItemStyle}>
              👀 审核中: <strong>{stats.review}</strong>
            </div>
            <div style={statItemStyle}>
              ✅ 完成: <strong>{stats.done}</strong>
            </div>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div style={filtersStyle}>
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Task['priority'] | 'all')}
            style={selectStyle}
          >
            <option value="all">所有优先级</option>
            <option value="urgent">紧急</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            style={selectStyle}
          >
            <option value="all">所有分配者</option>
            {getAllAssignees().map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 看板列 */}
      <div style={boardStyle}>
        {columns.map(column => (
          <BoardColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={getFilteredTasks(column.status)}
            onTaskMove={handleTaskMove}
            onTaskEdit={handleEditTask}
            onTaskDelete={handleDeleteTask}
            onAddTask={handleAddTask}
          />
        ))}
      </div>

      {/* 任务编辑模态框 */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          initialStatus={newTaskStatus}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowTaskModal(false);
            setEditingTask(null);
            setNewTaskStatus(null);
          }}
        />
      )}
    </div>
  );
};

export default KaibanBoard; 