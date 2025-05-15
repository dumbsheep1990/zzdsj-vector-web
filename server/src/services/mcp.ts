import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

// 导入共享类型
import { McpService, McpTool, McpToolParameter, McpAuthConfig, McpServiceCategory, McpServiceStats } from '../../../shared/types/mcp';

// 服务端内部MCP服务类型
interface ServerMcpService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  api_key?: string;
  status: 'active' | 'inactive' | 'error';
  service_type: 'llm' | 'embedding' | 'image' | 'audio' | 'vision' | 'tool';
  provider: string;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
  error_message?: string;
  last_used_at?: string;
}

// 服务端内部MCP工具类型
interface ServerMcpTool {
  id: string;
  name: string;
  description: string;
  service_id: string;
  tool_type: 'function' | 'retrieval' | 'code' | 'plugin';
  config: Record<string, any>;
  schema: Record<string, any>;
  created_at: string;
  updated_at: string;
  usage_count: number;
}

// 服务端内部MCP授权类型
interface ServerMcpAuthorization {
  id: string;
  service_id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  expires_at?: string;
  status: 'valid' | 'invalid' | 'expired';
}

// 类型转换函数 - 服务端到前端共享类型
function toSharedMcpService(service: ServerMcpService): McpService {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    icon: '', // 设置默认值
    type: service.service_type,
    usageCount: 0, // 默认值
    version: '1.0', // 默认值
    tags: [],
    toolsCount: 0,
    isConnected: service.status === 'active',
    provider: service.provider,
    createdAt: service.created_at,
    updatedAt: service.updated_at
  };
}

// 类型转换函数 - 前端共享类型到服务端
function toServerMcpService(service: McpService): ServerMcpService {
  return {
    id: service.id || uuidv4(),
    name: service.name,
    description: service.description,
    endpoint: '',
    status: service.isConnected ? 'active' : 'inactive',
    service_type: service.type as any,
    provider: service.provider || '',
    config: {},
    created_at: service.createdAt || new Date().toISOString(),
    updated_at: service.updatedAt || new Date().toISOString()
  };
}

// 工具类型转换 - 服务端到前端共享类型
function toSharedMcpTool(tool: ServerMcpTool): McpTool {
  return {
    id: tool.id,
    serviceId: tool.service_id,
    name: tool.name,
    description: tool.description,
    enabled: true,
    usage: {
      count: tool.usage_count,
      lastUsed: tool.updated_at
    },
    parameters: [],
    category: ''
  };
}

// 工具类型转换 - 前端共享类型到服务端
function toServerMcpTool(tool: McpTool): ServerMcpTool {
  return {
    id: tool.id || uuidv4(),
    name: tool.name,
    description: tool.description,
    service_id: tool.serviceId,
    tool_type: 'function',
    config: {},
    schema: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    usage_count: tool.usage?.count || 0
  };
}

// 授权类型转换 - 服务端到前端
function toSharedMcpAuth(auth: ServerMcpAuthorization): McpAuthConfig {
  return {
    serviceId: auth.service_id,
    authType: 'api_key',
    status: auth.status,
    credentials: {
      role: auth.role
    },
    expiresAt: auth.expires_at,
    scopes: []
  };
}

// 授权类型转换 - 前端到服务端
function toServerMcpAuth(auth: McpAuthConfig): ServerMcpAuthorization {
  return {
    id: uuidv4(),
    service_id: auth.serviceId,
    user_id: '', // 需要在实际调用时设置
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: auth.expiresAt,
    status: auth.status || 'valid'
  };
}

// 模拟MCP服务数据
const mockServerMcpServices: ServerMcpService[] = [
  {
    id: '1',
    name: 'OpenAI GPT-4',
    description: 'OpenAI的GPT-4大型语言模型',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    api_key: 'sk-xxxx',
    status: 'active',
    service_type: 'llm',
    provider: 'OpenAI',
    config: {
      model: 'gpt-4',
      max_tokens: 4096,
      temperature: 0.7
    },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-05-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'OpenAI DALL-E 3',
    description: 'OpenAI的DALL-E 3图像生成模型',
    endpoint: 'https://api.openai.com/v1/images/generations',
    api_key: 'sk-xxxx',
    status: 'active',
    service_type: 'image',
    provider: 'OpenAI',
    config: {
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard'
    },
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Azure OpenAI Embeddings',
    description: 'Azure OpenAI的文本嵌入服务',
    endpoint: 'https://my-resource.openai.azure.com/openai/deployments/text-embedding-ada-002/embeddings',
    api_key: 'azure-key-xxxx',
    status: 'inactive',
    service_type: 'embedding',
    provider: 'Microsoft Azure',
    config: {
      model: 'text-embedding-ada-002',
      dimensions: 1536
    },
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2023-07-01T00:00:00Z',
    error_message: '连接超时'
  }
];

// 转换为前端可用格式的模拟数据
const mockMcpServices = mockServerMcpServices.map(service => toSharedMcpService(service));

// 模拟服务端内部MCP工具数据
const mockServerMcpTools: ServerMcpTool[] = [
  {
    id: '1',
    name: '网络搜索',
    description: '一个网络搜索工具',
    service_id: '1',
    tool_type: 'function',
    config: {},
    schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '搜索查询'
        }
      },
      required: ['query']
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    usage_count: 156
  },
  {
    id: '2',
    name: '文件分析',
    description: '文件内容分析工具',
    service_id: '1',
    tool_type: 'function',
    config: {},
    schema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: '文件路径'
        },
        analysis_type: {
          type: 'string',
          enum: ['summary', 'keywords', 'sentiment'],
          description: '分析类型'
        }
      },
      required: ['file_path']
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    usage_count: 89
  }
];

// 转换为前端可用格式的模拟工具数据
const mockMcpTools = mockServerMcpTools.map(tool => toSharedMcpTool(tool));

// 模拟服务端内部MCP授权数据
const mockServerMcpAuthorizations: ServerMcpAuthorization[] = [
  {
    id: '1',
    service_id: '1',
    user_id: '1',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    status: 'valid'
  },
  {
    id: '2',
    service_id: '2',
    user_id: '1',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    status: 'valid'
  }
];

// 转换为前端可用格式的模拟授权数据
const mockMcpAuthorizations = mockServerMcpAuthorizations.map(auth => toSharedMcpAuth(auth));

/**
 * MCP服务类 - 管理与外部MCP服务的交互
 */
class McpServiceImplementation {
  private apiUrl: string;
  private useMockData: boolean;

  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    this.useMockData = process.env.USE_MOCK_DATA === 'true';
  }

  /**
   * 获取所有MCP服务
   */
  async getMcpServices(): Promise<McpService[]> {
    try {
      if (this.useMockData) {
        logger.info('Using mock data for getMcpServices');
        return mockMcpServices;
      }

      const response = await axios.get<ServerMcpService[]>(`${this.apiUrl}/api/mcp/services`);
      return response.data.map(service => toSharedMcpService(service));
    } catch (error) {
      logger.error('Error getting MCP services:', error);
      throw error;
    }
  }

  /**
   * 获取MCP服务详情
   */
  async getMcpServiceById(serviceId: string): Promise<McpService | null> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for getMcpServiceById: ${serviceId}`);
        const service = mockMcpServices.find(s => s.id === serviceId);
        return service || null;
      }

      const response = await axios.get<ServerMcpService>(`${this.apiUrl}/api/mcp/services/${serviceId}`);
      return toSharedMcpService(response.data);
    } catch (error) {
      logger.error(`Error getting MCP service by ID ${serviceId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * 创建MCP服务
   */
  async createMcpService(serviceData: Omit<McpService, 'id' | 'createdAt' | 'updatedAt'>): Promise<McpService> {
    try {
      if (this.useMockData) {
        logger.info('Using mock data for createMcpService');
        const newService: McpService = {
          id: uuidv4(),
          ...serviceData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockMcpServices.push(newService);
        return newService;
      }

      const serverServiceData = toServerMcpService({
        id: '',
        ...serviceData,
        createdAt: '',
        updatedAt: ''
      });
      
      const response = await axios.post<ServerMcpService>(
        `${this.apiUrl}/api/mcp/services`,
        serverServiceData
      );
      
      return toSharedMcpService(response.data);
    } catch (error) {
      logger.error('Error creating MCP service:', error);
      throw error;
    }
  }

  /**
   * 更新MCP服务
   */
  async updateMcpService(serviceId: string, serviceData: Partial<McpService>): Promise<McpService> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for updateMcpService: ${serviceId}`);
        const serviceIndex = mockMcpServices.findIndex(s => s.id === serviceId);
        
        if (serviceIndex === -1) {
          throw new Error(`Service with ID ${serviceId} not found`);
        }
        
        const updatedService: McpService = {
          ...mockMcpServices[serviceIndex],
          ...serviceData,
          updatedAt: new Date().toISOString()
        };
        
        mockMcpServices[serviceIndex] = updatedService;
        return updatedService;
      }

      const response = await axios.put<ServerMcpService>(
        `${this.apiUrl}/api/mcp/services/${serviceId}`,
        serviceData
      );
      
      return toSharedMcpService(response.data);
    } catch (error) {
      logger.error(`Error updating MCP service ${serviceId}:`, error);
      throw error;
    }
  }

  /**
   * 删除MCP服务
   */
  async deleteMcpService(serviceId: string): Promise<boolean> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for deleteMcpService: ${serviceId}`);
        const serviceIndex = mockMcpServices.findIndex(s => s.id === serviceId);
        
        if (serviceIndex === -1) {
          return false;
        }
        
        mockMcpServices.splice(serviceIndex, 1);
        return true;
      }

      await axios.delete(`${this.apiUrl}/api/mcp/services/${serviceId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting MCP service ${serviceId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * 获取服务的所有工具
   */
  async getMcpTools(serviceId: string): Promise<McpTool[]> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for getMcpTools: ${serviceId}`);
        return mockMcpTools.filter(tool => tool.serviceId === serviceId);
      }

      const response = await axios.get<ServerMcpTool[]>(`${this.apiUrl}/api/mcp/services/${serviceId}/tools`);
      return response.data.map(tool => toSharedMcpTool(tool));
    } catch (error) {
      logger.error(`Error getting MCP tools for service ${serviceId}:`, error);
      throw error;
    }
  }

  /**
   * 获取工具详情
   */
  async getMcpToolById(serviceId: string, toolId: string): Promise<McpTool | null> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for getMcpToolById: ${serviceId}/${toolId}`);
        const tool = mockMcpTools.find(t => t.serviceId === serviceId && t.id === toolId);
        return tool || null;
      }

      const response = await axios.get<ServerMcpTool>(
        `${this.apiUrl}/api/mcp/services/${serviceId}/tools/${toolId}`
      );
      
      return toSharedMcpTool(response.data);
    } catch (error) {
      logger.error(`Error getting MCP tool ${toolId} for service ${serviceId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * 创建工具
   */
  async createMcpTool(serviceId: string, toolData: Omit<McpTool, 'id' | 'serviceId'>): Promise<McpTool> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for createMcpTool: ${serviceId}`);
        const newTool: McpTool = {
          id: uuidv4(),
          serviceId,
          ...toolData,
          usage: toolData.usage || { count: 0 }
        };
        
        mockMcpTools.push(newTool);
        return newTool;
      }

      const serverToolData = toServerMcpTool({
        id: '',
        serviceId,
        ...toolData
      });
      
      const response = await axios.post<ServerMcpTool>(
        `${this.apiUrl}/api/mcp/services/${serviceId}/tools`,
        serverToolData
      );
      
      return toSharedMcpTool(response.data);
    } catch (error) {
      logger.error(`Error creating MCP tool for service ${serviceId}:`, error);
      throw error;
    }
  }

  /**
   * 更新工具
   */
  async updateMcpTool(serviceId: string, toolId: string, toolData: Partial<McpTool>): Promise<McpTool> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for updateMcpTool: ${serviceId}/${toolId}`);
        const toolIndex = mockMcpTools.findIndex(t => t.serviceId === serviceId && t.id === toolId);
        
        if (toolIndex === -1) {
          throw new Error(`Tool ${toolId} not found for service ${serviceId}`);
        }
        
        const updatedTool: McpTool = {
          ...mockMcpTools[toolIndex],
          ...toolData
        };
        
        mockMcpTools[toolIndex] = updatedTool;
        return updatedTool;
      }

      const response = await axios.put<ServerMcpTool>(
        `${this.apiUrl}/api/mcp/services/${serviceId}/tools/${toolId}`,
        toolData
      );
      
      return toSharedMcpTool(response.data);
    } catch (error) {
      logger.error(`Error updating MCP tool ${toolId} for service ${serviceId}:`, error);
      throw error;
    }
  }

  /**
   * 删除工具
   */
  async deleteMcpTool(serviceId: string, toolId: string): Promise<boolean> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for deleteMcpTool: ${serviceId}/${toolId}`);
        const toolIndex = mockMcpTools.findIndex(t => t.serviceId === serviceId && t.id === toolId);
        
        if (toolIndex === -1) {
          return false;
        }
        
        mockMcpTools.splice(toolIndex, 1);
        return true;
      }

      await axios.delete(`${this.apiUrl}/api/mcp/services/${serviceId}/tools/${toolId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting MCP tool ${toolId} for service ${serviceId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * 获取服务授权配置
   */
  async getMcpAuthConfig(serviceId: string): Promise<McpAuthConfig | null> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for getMcpAuthConfig: ${serviceId}`);
        const auth = mockMcpAuthorizations.find(a => a.serviceId === serviceId);
        return auth || null;
      }

      const response = await axios.get<ServerMcpAuthorization>(
        `${this.apiUrl}/api/mcp/services/${serviceId}/auth`
      );
      
      return toSharedMcpAuth(response.data);
    } catch (error) {
      logger.error(`Error getting MCP auth config for service ${serviceId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * 设置服务授权配置
   */
  async setMcpAuthConfig(serviceId: string, authConfig: Omit<McpAuthConfig, 'serviceId'>): Promise<McpAuthConfig> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for setMcpAuthConfig: ${serviceId}`);
        const existingAuthIndex = mockMcpAuthorizations.findIndex(a => a.serviceId === serviceId);
        
        const newAuthConfig: McpAuthConfig = {
          serviceId,
          ...authConfig
        };
        
        if (existingAuthIndex >= 0) {
          mockMcpAuthorizations[existingAuthIndex] = newAuthConfig;
        } else {
          mockMcpAuthorizations.push(newAuthConfig);
        }
        
        return newAuthConfig;
      }

      const serverAuthConfig = toServerMcpAuth({
        serviceId,
        ...authConfig
      });
      
      const response = await axios.post<ServerMcpAuthorization>(
        `${this.apiUrl}/api/mcp/services/${serviceId}/auth`,
        serverAuthConfig
      );
      
      return toSharedMcpAuth(response.data);
    } catch (error) {
      logger.error(`Error setting MCP auth config for service ${serviceId}:`, error);
      throw error;
    }
  }

  /**
   * 删除服务授权配置
   */
  async deleteMcpAuthConfig(serviceId: string): Promise<boolean> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for deleteMcpAuthConfig: ${serviceId}`);
        const authIndex = mockMcpAuthorizations.findIndex(a => a.serviceId === serviceId);
        
        if (authIndex === -1) {
          return false;
        }
        
        mockMcpAuthorizations.splice(authIndex, 1);
        return true;
      }

      await axios.delete(`${this.apiUrl}/api/mcp/services/${serviceId}/auth`);
      return true;
    } catch (error) {
      logger.error(`Error deleting MCP auth config for service ${serviceId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * 获取服务统计信息
   */
  async getMcpServiceStats(serviceId: string): Promise<McpServiceStats | null> {
    try {
      if (this.useMockData) {
        logger.info(`Using mock data for getMcpServiceStats: ${serviceId}`);
        // 生成模拟统计信息
        return {
          totalCalls: 1250,
          successRate: 0.98,
          avgResponseTime: 235,
          lastCalled: new Date().toISOString(),
          errorRate: 0.02,
          dailyUsage: Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
              date: date.toISOString().split('T')[0],
              count: Math.floor(Math.random() * 200) + 50
            };
          })
        };
      }

      const response = await axios.get<McpServiceStats>(
        `${this.apiUrl}/api/mcp/services/${serviceId}/stats`
      );
      
      return response.data;
    } catch (error) {
      logger.error(`Error getting MCP stats for service ${serviceId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * 获取可用的MCP服务类别
   */
  async getMcpServiceCategories(): Promise<McpServiceCategory[]> {
    try {
      if (this.useMockData) {
        logger.info('Using mock data for getMcpServiceCategories');
        return [
          { id: '1', name: '语言模型', count: 3, color: '#1890ff' },
          { id: '2', name: '嵌入模型', count: 1, color: '#52c41a' },
          { id: '3', name: '图像模型', count: 2, color: '#722ed1' },
          { id: '4', name: '工具服务', count: 5, color: '#fa8c16' }
        ];
      }

      const response = await axios.get<McpServiceCategory[]>(
        `${this.apiUrl}/api/mcp/categories`
      );
      
      return response.data;
    } catch (error) {
      logger.error('Error getting MCP service categories:', error);
      throw error;
    }
  }
}

// 导出服务实例
export const mcpService = new McpServiceImplementation();
