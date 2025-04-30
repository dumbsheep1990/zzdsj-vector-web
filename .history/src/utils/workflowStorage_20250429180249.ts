import { Node, Edge } from '@xyflow/react';

// 工作流数据类型
export interface WorkflowData {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

// 从本地存储获取所有工作流
export const getWorkflows = (): WorkflowData[] => {
  try {
    const storedWorkflows = localStorage.getItem('workflows');
    return storedWorkflows ? JSON.parse(storedWorkflows) : [];
  } catch (error) {
    console.error('获取工作流数据失败:', error);
    return [];
  }
};

// 从本地存储获取特定工作流
export const getWorkflow = (id: string): WorkflowData | null => {
  try {
    const workflows = getWorkflows();
    return workflows.find(workflow => workflow.id === id) || null;
  } catch (error) {
    console.error('获取工作流数据失败:', error);
    return null;
  }
};

// 保存工作流到本地存储
export const saveWorkflow = (workflow: WorkflowData): boolean => {
  try {
    const workflows = getWorkflows();
    const existingIndex = workflows.findIndex(wf => wf.id === workflow.id);
    
    if (existingIndex >= 0) {
      // 更新现有工作流
      workflows[existingIndex] = {
        ...workflow,
        updatedAt: new Date().toISOString()
      };
    } else {
      // 添加新工作流
      workflows.push({
        ...workflow,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('workflows', JSON.stringify(workflows));
    return true;
  } catch (error) {
    console.error('保存工作流数据失败:', error);
    return false;
  }
};

// 删除工作流
export const deleteWorkflow = (id: string): boolean => {
  try {
    const workflows = getWorkflows();
    const filteredWorkflows = workflows.filter(workflow => workflow.id !== id);
    localStorage.setItem('workflows', JSON.stringify(filteredWorkflows));
    return true;
  } catch (error) {
    console.error('删除工作流数据失败:', error);
    return false;
  }
};

// 获取所有可用的Agent列表
export const getAgents = (): any[] => {
  try {
    const storedAgents = localStorage.getItem('agents');
    return storedAgents ? JSON.parse(storedAgents) : [];
  } catch (error) {
    console.error('获取Agent数据失败:', error);
    return [];
  }
};

// 保存Agent配置
export const saveAgent = (agent: any): boolean => {
  try {
    const agents = getAgents();
    const existingIndex = agents.findIndex(a => a.id === agent.id);
    
    if (existingIndex >= 0) {
      // 更新现有Agent
      agents[existingIndex] = {
        ...agent,
        updatedAt: new Date().toISOString()
      };
    } else {
      // 添加新Agent
      agents.push({
        ...agent,
        id: agent.id || `agent_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('agents', JSON.stringify(agents));
    return true;
  } catch (error) {
    console.error('保存Agent数据失败:', error);
    return false;
  }
};

// 在实际应用中，这些函数应该通过API与后端交互
// 这里仅为演示，使用localStorage作为临时存储 