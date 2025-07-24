/**
 * 智能体服务API集成
 * 直接对接智能体微服务，实现完整的智能体管理功能
 */

import { apiClient } from '../utils/api';

// 智能体模板类型
export type TemplateType = 'simple-qa' | 'deep-thinking' | 'intelligent-planning';

// 基础配置接口
export interface BasicConfiguration {
  agent_name: string;
  agent_description: string;
  system_prompt: string;
  language: string;
  response_style: string;
  max_context_length: number;
}

// 模型配置接口
export interface ModelConfiguration {
  provider: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
}

// 工具配置接口
export interface ToolConfiguration {
  type: string;
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

// 能力配置接口
export interface CapabilityConfiguration {
  tools: ToolConfiguration[];
  integrations: string[];
  custom_instructions: string;
}

// 高级配置接口
export interface AdvancedConfiguration {
  execution_timeout: number;
  max_iterations: number;
  enable_streaming: boolean;
  enable_citations: boolean;
  privacy_level: string;
}

// 完整智能体配置
export interface CompleteAgentConfig {
  template_selection: {
    template_id: string;
    template_name: string;
    description: string;
    use_cases: string[];
    estimated_cost: string;
  };
  basic_configuration: BasicConfiguration;
  model_configuration: ModelConfiguration;
  capability_configuration: CapabilityConfiguration;
  advanced_configuration: AdvancedConfiguration;
}

// 智能体响应接口
export interface AgentResponse {
  agent_id: string;
  name: string;
  description: string;
  template_type: TemplateType;
  status: string;
  created_at: string;
  capabilities: string[];
}

// 模板响应接口
export interface TemplateResponse {
  template_id: TemplateType;
  name: string;
  description: string;
  use_cases: string[];
  estimated_cost: string;
  capabilities: string[];
  default_tools: string[];
  level: number;
}

// 流程设计接口
export interface FlowDesignRequest {
  nodes: FlowNode[];
  edges: FlowEdge[];
  metadata: Record<string, any>;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

// 智能体服务类
export class AgentService {
  private baseURL = (import.meta.env.VITE_AGENT_SERVICE_URL?.replace('/api/v1', '') || 'http://localhost:8081');
  private offlineMode = false;

  // 设置离线模式
  setOfflineMode(offline: boolean) {
    this.offlineMode = offline;
  }

  // 获取智能体模板列表
  async getTemplates(category?: string): Promise<TemplateResponse[]> {
    if (this.offlineMode) {
      return this.getMockTemplates();
    }
    
    const params = category ? { category } : {};
    const response = await apiClient.get(`${this.baseURL}/api/v1/agents/templates`, { params });
    return response.data;
  }

  // 获取指定模板详情
  async getTemplate(templateId: string): Promise<TemplateResponse> {
    if (this.offlineMode) {
      const templates = this.getMockTemplates();
      const template = templates.find(t => t.template_id === templateId);
      if (!template) {
        throw new Error(`模板 ${templateId} 未找到`);
      }
      return template;
    }
    
    const response = await apiClient.get(`${this.baseURL}/api/v1/agents/templates/${templateId}`);
    return response.data;
  }

  // 创建智能体
  async createAgent(config: CompleteAgentConfig): Promise<AgentResponse> {
    if (this.offlineMode) {
      return this.getMockAgent(config);
    }
    
    const response = await apiClient.post(`${this.baseURL}/api/v1/agents/create`, config);
    return response.data;
  }

  // 获取智能体列表
  async getAgents(params: {
    page?: number;
    page_size?: number;
    search?: string;
    status_filter?: string;
  } = {}): Promise<{ agents: AgentResponse[]; total: number; page: number; size: number }> {
    if (this.offlineMode) {
      return {
        agents: [],
        total: 0,
        page: 1,
        size: 10
      };
    }
    
    const response = await apiClient.get(`${this.baseURL}/api/v1/agents/`, { params });
    return response.data;
  }

  // 获取智能体详情
  async getAgent(agentId: string): Promise<AgentResponse> {
    if (this.offlineMode) {
      throw new Error('离线模式下无法获取智能体详情');
    }
    
    const response = await apiClient.get(`${this.baseURL}/api/v1/agents/${agentId}`);
    return response.data;
  }

  // 更新智能体
  async updateAgent(agentId: string, config: Partial<CompleteAgentConfig>): Promise<AgentResponse> {
    if (this.offlineMode) {
      throw new Error('离线模式下无法更新智能体');
    }
    
    const response = await apiClient.put(`${this.baseURL}/api/v1/agents/${agentId}`, config);
    return response.data;
  }

  // 删除智能体
  async deleteAgent(agentId: string): Promise<{ message: string }> {
    if (this.offlineMode) {
      throw new Error('离线模式下无法删除智能体');
    }
    
    const response = await apiClient.delete(`${this.baseURL}/api/v1/agents/${agentId}`);
    return response.data;
  }

  // 设计智能体工作流
  async designFlow(agentId: string, flowConfig: FlowDesignRequest): Promise<any> {
    if (this.offlineMode) {
      console.log('离线模式：保存工作流配置', flowConfig);
      return { message: '工作流已保存（离线模式）' };
    }
    
    const response = await apiClient.post(`${this.baseURL}/api/v1/agents/${agentId}/flow/design`, flowConfig);
    return response.data;
  }

  // 获取智能体工作流
  async getFlow(agentId: string): Promise<any> {
    if (this.offlineMode) {
      return {
        nodes: [],
        edges: [],
        metadata: {}
      };
    }
    
    const response = await apiClient.get(`${this.baseURL}/api/v1/agents/${agentId}/flow`);
    return response.data;
  }

  // 与智能体对话
  async chatWithAgent(agentId: string, message: string, sessionId?: string): Promise<any> {
    if (this.offlineMode) {
      return {
        response: '这是离线模式的模拟回复',
        session_id: sessionId || 'mock-session-id'
      };
    }
    
    const response = await apiClient.post(`${this.baseURL}/api/v1/agents/${agentId}/chat`, {
      message,
      session_id: sessionId
    });
    return response.data;
  }

  // 测试智能体
  async testAgent(agentId: string, testMessage: string): Promise<any> {
    if (this.offlineMode) {
      return {
        result: 'success',
        response: '测试成功（离线模式）'
      };
    }
    
    const response = await apiClient.post(`${this.baseURL}/api/v1/agents/${agentId}/test`, {
      test_message: testMessage
    });
    return response.data;
  }

  // 更改智能体状态
  async changeAgentStatus(agentId: string, action: 'activate' | 'deactivate' | 'pause' | 'resume'): Promise<any> {
    if (this.offlineMode) {
      return {
        message: `智能体状态已${action}（离线模式）`
      };
    }
    
    const response = await apiClient.post(`${this.baseURL}/api/v1/agents/${agentId}/status/${action}`);
    return response.data;
  }

  // 获取智能体统计信息
  async getAgentStats(agentId: string, period: '1d' | '7d' | '30d' = '7d'): Promise<any> {
    if (this.offlineMode) {
      return {
        period,
        stats: {
          total_conversations: 0,
          total_tokens: 0,
          success_rate: 0
        }
      };
    }
    
    const response = await apiClient.get(`${this.baseURL}/api/v1/agents/${agentId}/stats`, {
      params: { period }
    });
    return response.data;
  }

  // 配置验证
  async validateConfig(config: CompleteAgentConfig): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      // 基础验证
      const errors: string[] = [];
      
      if (!config.basic_configuration.agent_name.trim()) {
        errors.push('智能体名称不能为空');
      }
      
      if (!config.model_configuration.model) {
        errors.push('必须选择一个模型');
      }
      
      if (!config.template_selection.template_id) {
        errors.push('必须选择一个模板');
      }

      return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
    } catch (error) {
      return { valid: false, errors: ['配置验证失败'] };
    }
  }

  // Mock模板数据
  private getMockTemplates(): TemplateResponse[] {
    return [
      {
        template_id: 'simple-qa' as any,
        name: '简单问答智能体',
        description: '快速响应的轻量级问答助手',
        use_cases: ['日常咨询服务', '标准化问答', '信息快速检索'],
        estimated_cost: 'standard',
        capabilities: ['毫秒级响应速度', '直接准确回答', '轻量化架构', '高并发支持', '成本效益优化'],
        default_tools: ['text-analyzer'],
        level: 1
      },
      {
        template_id: 'deep-thinking' as any,
        name: '深度思考智能体',
        description: '具备复杂推理能力的分析专家',
        use_cases: ['深度分析研究', '战略规划制定', '创新解决方案'],
        estimated_cost: 'premium',
        capabilities: ['多步骤推理链', '逻辑分析能力', '创新思维生成', '多角度思考', '深度洞察分析'],
        default_tools: ['text-analyzer', 'data-analysis'],
        level: 2
      },
      {
        template_id: 'intelligent-planning' as any,
        name: '智能规划智能体',
        description: '自动化任务编排和执行管理专家',
        use_cases: ['流程自动化管理', '任务智能调度', '系统集成协调'],
        estimated_cost: 'enterprise',
        capabilities: ['智能任务分解', '动态流程规划', '执行进度监控', '异常自动处理', '资源优化配置'],
        default_tools: ['web-search', 'data-analysis', 'api-call'],
        level: 3
      }
    ];
  }

  // Mock智能体数据
  private getMockAgent(config: CompleteAgentConfig): AgentResponse {
    return {
      agent_id: `mock-agent-${Date.now()}`,
      name: config.basic_configuration.agent_name,
      description: config.basic_configuration.agent_description,
      template_type: config.template_selection.template_id as TemplateType,
      status: 'active',
      created_at: new Date().toISOString(),
      capabilities: config.capability_configuration.tools
    };
  }
}

// 导出服务实例
export const agentService = new AgentService();

// 导出默认实例
export default agentService;