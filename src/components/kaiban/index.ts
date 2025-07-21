// Kaiban 看板组件导出
export { default as KaibanBoard } from './KaibanBoard';
export { default as BoardColumn } from './BoardColumn';
export { default as TaskCard } from './TaskCard';
export { default as TaskModal } from './TaskModal';
export { default as WorkflowManager } from './WorkflowManager';

// 从服务层导出类型和hooks
export {
  // 类型定义
  type Workflow,
  type Board,
  type Task,
  type Event,
  type EventSubscription,
  
  // API 服务
  kaibanService,
  
  // React Hooks
  useWorkflows,
  useBoards,
  useTasks,
} from '../../services/kaibanService'; 