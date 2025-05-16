import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { 
  Permission, 
  Role, 
  UserRoleAssignment, 
  ResourcePermission, 
  ResourceType, 
  AccessLevel,
  ResourceAccessDetail,
  KnowledgeBaseAccess,
  AssistantAccess,
  PermissionCheckResult
} from '../../../shared/types/auth';
import { logger } from '../utils/logger';

// 模拟权限数据
const mockPermissions: Permission[] = [
  {
    id: '1',
    name: '知识库创建',
    code: 'knowledge:create',
    description: '允许创建新的知识库',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '知识库读取',
    code: 'knowledge:read',
    description: '允许查看知识库内容',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '知识库更新',
    code: 'knowledge:update',
    description: '允许修改知识库',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: '知识库删除',
    code: 'knowledge:delete',
    description: '允许删除知识库',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: '助手创建',
    code: 'assistant:create',
    description: '允许创建新的AI助手',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: '助手读取',
    code: 'assistant:read',
    description: '允许查看AI助手',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: '助手更新',
    code: 'assistant:update',
    description: '允许修改AI助手',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: '助手删除',
    code: 'assistant:delete',
    description: '允许删除AI助手',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    name: '用户管理',
    code: 'user:manage',
    description: '允许管理用户',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    name: '角色管理',
    code: 'role:manage',
    description: '允许管理角色和权限',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '11',
    name: '系统设置',
    code: 'system:settings',
    description: '允许修改系统设置',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: '1',
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    is_default: false,
    created_at: '2024-01-01T00:00:00Z',
    permissions: mockPermissions
  },
  {
    id: '2',
    name: '普通用户',
    description: '普通用户，有限的操作权限',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    permissions: mockPermissions.filter(p => 
      p.code.startsWith('knowledge:read') || 
      p.code.startsWith('assistant:read')
    )
  },
  {
    id: '3',
    name: '高级用户',
    description: '高级用户，可创建和管理自己的资源',
    is_default: false,
    created_at: '2024-01-01T00:00:00Z',
    permissions: mockPermissions.filter(p => 
      !p.code.includes('manage') && 
      !p.code.includes('settings')
    )
  }
];

// 模拟用户角色分配
const mockUserRoleAssignments: UserRoleAssignment[] = [
  {
    user_id: '1', // admin
    role_id: '1', // 管理员
    assigned_at: '2024-01-01T00:00:00Z',
    assigned_by: 'system'
  },
  {
    user_id: '2', // user
    role_id: '2', // 普通用户
    assigned_at: '2024-01-01T00:00:00Z',
    assigned_by: 'system'
  }
];

// 模拟资源权限
const mockResourcePermissions: ResourcePermission[] = [
  {
    id: '1',
    user_id: '2',
    resource_type: ResourceType.KNOWLEDGE_BASE,
    resource_id: 'kb1',
    access_level: AccessLevel.OWNER,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    user_id: '2',
    resource_type: ResourceType.ASSISTANT,
    resource_id: 'ast1',
    access_level: AccessLevel.OWNER,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  }
];

class PermissionsService {
  private apiUrl: string;
  private useMock: boolean;
  
  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    this.useMock = process.env.USE_MOCK_DATA === 'true';
  }
  
  /**
   * 获取所有权限
   */
  async getPermissions(): Promise<Permission[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取所有权限');
      return JSON.parse(JSON.stringify(mockPermissions));
    }
    
    try {
      logger.info('从后端API获取所有权限');
      const response = await axios.get<Permission[]>(`${this.apiUrl}/api/permissions`);
      return response.data;
    } catch (error) {
      logger.error('获取所有权限失败:', error);
      throw new Error('获取权限列表失败');
    }
  }
  
  /**
   * 获取所有角色
   */
  async getRoles(): Promise<Role[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取所有角色');
      return JSON.parse(JSON.stringify(mockRoles));
    }
    
    try {
      logger.info('从后端API获取所有角色');
      const response = await axios.get<Role[]>(`${this.apiUrl}/api/permissions/roles`);
      return response.data;
    } catch (error) {
      logger.error('获取所有角色失败:', error);
      throw new Error('获取角色列表失败');
    }
  }
  
  /**
   * 获取角色详情
   */
  async getRoleById(roleId: string): Promise<Role | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取角色详情, ID: ${roleId}`);
      const role = mockRoles.find(r => r.id === roleId);
      return role ? JSON.parse(JSON.stringify(role)) : null;
    }
    
    try {
      logger.info(`从后端API获取角色详情, ID: ${roleId}`);
      const response = await axios.get<Role>(`${this.apiUrl}/api/permissions/roles/${roleId}`);
      return response.data;
    } catch (error) {
      logger.error(`获取角色详情失败, ID: ${roleId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`获取角色详情失败: ${error}`);
    }
  }
  
  /**
   * 创建角色
   */
  async createRole(role: Partial<Role>): Promise<Role> {
    if (this.useMock) {
      logger.info(`使用模拟数据创建角色, 名称: ${role.name}`);
      
      const newRole: Role = {
        id: uuidv4(),
        name: role.name || '',
        description: role.description,
        is_default: role.is_default || false,
        created_at: new Date().toISOString(),
        permissions: role.permissions || []
      };
      
      mockRoles.push(newRole);
      return JSON.parse(JSON.stringify(newRole));
    }
    
    try {
      logger.info(`向后端API创建角色, 名称: ${role.name}`);
      const response = await axios.post<Role>(`${this.apiUrl}/api/permissions/roles`, role);
      return response.data;
    } catch (error) {
      logger.error(`创建角色失败:`, error);
      throw new Error('创建角色失败');
    }
  }
  
  /**
   * 更新角色
   */
  async updateRole(roleId: string, role: Partial<Role>): Promise<Role | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新角色, ID: ${roleId}`);
      
      const index = mockRoles.findIndex(r => r.id === roleId);
      if (index === -1) {
        return null;
      }
      
      mockRoles[index] = {
        ...mockRoles[index],
        ...role,
        id: roleId // 确保ID不变
      };
      
      return JSON.parse(JSON.stringify(mockRoles[index]));
    }
    
    try {
      logger.info(`向后端API更新角色, ID: ${roleId}`);
      const response = await axios.put<Role>(`${this.apiUrl}/api/permissions/roles/${roleId}`, role);
      return response.data;
    } catch (error) {
      logger.error(`更新角色失败, ID: ${roleId}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error(`更新角色失败: ${error}`);
    }
  }
  
  /**
   * 删除角色
   */
  async deleteRole(roleId: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除角色, ID: ${roleId}`);
      
      const index = mockRoles.findIndex(r => r.id === roleId);
      if (index === -1) {
        return false;
      }
      
      // 检查是否为默认角色
      if (mockRoles[index].is_default) {
        throw new Error('不能删除默认角色');
      }
      
      // 检查角色是否已分配给用户
      if (mockUserRoleAssignments.some(assignment => assignment.role_id === roleId)) {
        throw new Error('此角色已分配给用户，无法删除');
      }
      
      mockRoles.splice(index, 1);
      return true;
    }
    
    try {
      logger.info(`向后端API删除角色, ID: ${roleId}`);
      await axios.delete(`${this.apiUrl}/api/permissions/roles/${roleId}`);
      return true;
    } catch (error) {
      logger.error(`删除角色失败, ID: ${roleId}:`, error);
      throw new Error(`删除角色失败: ${error}`);
    }
  }
  
  /**
   * 获取用户角色
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取用户角色, 用户ID: ${userId}`);
      
      // 查找用户的角色分配
      const assignments = mockUserRoleAssignments.filter(assignment => assignment.user_id === userId);
      
      // 获取对应的角色
      const userRoles: Role[] = [];
      for (const assignment of assignments) {
        const role = mockRoles.find(r => r.id === assignment.role_id);
        if (role) {
          userRoles.push(JSON.parse(JSON.stringify(role)));
        }
      }
      
      return userRoles;
    }
    
    try {
      logger.info(`从后端API获取用户角色, 用户ID: ${userId}`);
      const response = await axios.get<Role[]>(`${this.apiUrl}/api/permissions/users/${userId}/roles`);
      return response.data;
    } catch (error) {
      logger.error(`获取用户角色失败, 用户ID: ${userId}:`, error);
      throw new Error('获取用户角色失败');
    }
  }
  
  /**
   * 分配角色给用户
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据分配角色给用户, 用户ID: ${userId}, 角色ID: ${roleId}`);
      
      // 检查角色是否存在
      const role = mockRoles.find(r => r.id === roleId);
      if (!role) {
        throw new Error('角色不存在');
      }
      
      // 检查是否已经分配
      if (mockUserRoleAssignments.some(a => a.user_id === userId && a.role_id === roleId)) {
        return true; // 已经分配过了
      }
      
      // 创建新的角色分配
      const newAssignment: UserRoleAssignment = {
        user_id: userId,
        role_id: roleId,
        assigned_at: new Date().toISOString(),
        assigned_by: 'system'
      };
      
      mockUserRoleAssignments.push(newAssignment);
      return true;
    }
    
    try {
      logger.info(`向后端API分配角色给用户, 用户ID: ${userId}, 角色ID: ${roleId}`);
      await axios.post(`${this.apiUrl}/api/permissions/users/${userId}/roles`, { role_id: roleId });
      return true;
    } catch (error) {
      logger.error(`分配角色给用户失败, 用户ID: ${userId}, 角色ID: ${roleId}:`, error);
      throw new Error('分配角色给用户失败');
    }
  }
  
  /**
   * 从用户移除角色
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据从用户移除角色, 用户ID: ${userId}, 角色ID: ${roleId}`);
      
      // 查找分配记录
      const index = mockUserRoleAssignments.findIndex(
        a => a.user_id === userId && a.role_id === roleId
      );
      
      if (index === -1) {
        return false; // 没有分配记录
      }
      
      // 移除分配记录
      mockUserRoleAssignments.splice(index, 1);
      return true;
    }
    
    try {
      logger.info(`向后端API从用户移除角色, 用户ID: ${userId}, 角色ID: ${roleId}`);
      await axios.delete(`${this.apiUrl}/api/permissions/users/${userId}/roles/${roleId}`);
      return true;
    } catch (error) {
      logger.error(`从用户移除角色失败, 用户ID: ${userId}, 角色ID: ${roleId}:`, error);
      throw new Error('从用户移除角色失败');
    }
  }
  
  /**
   * 检查权限
   */
  async checkPermission(userId: string, permissionCode: string): Promise<PermissionCheckResult> {
    if (this.useMock) {
      logger.info(`使用模拟数据检查权限, 用户ID: ${userId}, 权限代码: ${permissionCode}`);
      
      // 获取用户角色
      const assignments = mockUserRoleAssignments.filter(assignment => assignment.user_id === userId);
      
      // 获取用户的所有权限
      let userPermissions: string[] = [];
      for (const assignment of assignments) {
        const role = mockRoles.find(r => r.id === assignment.role_id);
        if (role && role.permissions) {
          userPermissions = userPermissions.concat(role.permissions.map(p => p.code));
        }
      }
      
      // 检查是否拥有权限
      const hasPermission = userPermissions.includes(permissionCode);
      
      return {
        has_permission: hasPermission,
        missing_permissions: hasPermission ? undefined : [permissionCode],
        reason: hasPermission ? undefined : '用户缺少所需权限'
      };
    }
    
    try {
      logger.info(`向后端API检查权限, 用户ID: ${userId}, 权限代码: ${permissionCode}`);
      const response = await axios.get<PermissionCheckResult>(
        `${this.apiUrl}/api/permissions/check/${permissionCode}?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      logger.error(`检查权限失败, 用户ID: ${userId}, 权限代码: ${permissionCode}:`, error);
      throw new Error('检查权限失败');
    }
  }
  
  /**
   * 批量检查权限
   */
  async checkPermissions(userId: string, permissionCodes: string[]): Promise<PermissionCheckResult> {
    if (this.useMock) {
      logger.info(`使用模拟数据批量检查权限, 用户ID: ${userId}, 权限代码: ${permissionCodes.join(', ')}`);
      
      // 获取用户角色
      const assignments = mockUserRoleAssignments.filter(assignment => assignment.user_id === userId);
      
      // 获取用户的所有权限
      let userPermissions: string[] = [];
      for (const assignment of assignments) {
        const role = mockRoles.find(r => r.id === assignment.role_id);
        if (role && role.permissions) {
          userPermissions = userPermissions.concat(role.permissions.map(p => p.code));
        }
      }
      
      // 检查哪些权限缺失
      const missingPermissions = permissionCodes.filter(code => !userPermissions.includes(code));
      
      return {
        has_permission: missingPermissions.length === 0,
        missing_permissions: missingPermissions.length > 0 ? missingPermissions : undefined,
        reason: missingPermissions.length > 0 ? '用户缺少所需权限' : undefined
      };
    }
    
    try {
      logger.info(`向后端API批量检查权限, 用户ID: ${userId}, 权限代码: ${permissionCodes.join(', ')}`);
      const response = await axios.post<PermissionCheckResult>(
        `${this.apiUrl}/api/permissions/check-multiple?userId=${userId}`,
        { permission_codes: permissionCodes }
      );
      return response.data;
    } catch (error) {
      logger.error(`批量检查权限失败, 用户ID: ${userId}:`, error);
      throw new Error('批量检查权限失败');
    }
  }
  
  /**
   * 检查资源访问权限
   */
  async checkResourceAccess(
    userId: string, 
    resourceType: ResourceType, 
    resourceId: string
  ): Promise<ResourceAccessDetail> {
    if (this.useMock) {
      logger.info(`使用模拟数据检查资源访问权限, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
      
      // 超级用户拥有所有权限
      if (userId === '1') { // 假设ID为1的是超级用户
        return {
          can_read: true,
          can_write: true,
          can_delete: true,
          can_share: true,
          is_admin: true
        };
      }
      
      // 查找资源权限
      const resourcePerm = mockResourcePermissions.find(
        perm => perm.user_id === userId && 
                perm.resource_type === resourceType && 
                perm.resource_id === resourceId
      );
      
      if (!resourcePerm) {
        return {
          can_read: false,
          can_write: false,
          can_delete: false,
          can_share: false,
          is_admin: false
        };
      }
      
      // 根据访问级别设置权限
      switch (resourcePerm.access_level) {
        case AccessLevel.READ:
          return {
            can_read: true,
            can_write: false,
            can_delete: false,
            can_share: false,
            is_admin: false
          };
        case AccessLevel.WRITE:
          return {
            can_read: true,
            can_write: true,
            can_delete: false,
            can_share: false,
            is_admin: false
          };
        case AccessLevel.ADMIN:
          return {
            can_read: true,
            can_write: true,
            can_delete: true,
            can_share: true,
            is_admin: true
          };
        case AccessLevel.OWNER:
          return {
            can_read: true,
            can_write: true,
            can_delete: true,
            can_share: true,
            is_admin: true
          };
        default:
          return {
            can_read: false,
            can_write: false,
            can_delete: false,
            can_share: false,
            is_admin: false
          };
      }
    }
    
    try {
      logger.info(`向后端API检查资源访问权限, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
      const response = await axios.get<ResourceAccessDetail>(
        `${this.apiUrl}/api/permissions/resources/${resourceType}/${resourceId}/access?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      logger.error(`检查资源访问权限失败, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}:`, error);
      throw new Error('检查资源访问权限失败');
    }
  }
  
  /**
   * 授予资源权限
   */
  async grantResourceAccess(
    userId: string, 
    resourceType: ResourceType, 
    resourceId: string, 
    accessLevel: AccessLevel
  ): Promise<ResourcePermission> {
    if (this.useMock) {
      logger.info(`使用模拟数据授予资源权限, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}, 访问级别: ${accessLevel}`);
      
      // 检查是否已存在权限
      const existingIndex = mockResourcePermissions.findIndex(
        perm => perm.user_id === userId && 
                perm.resource_type === resourceType && 
                perm.resource_id === resourceId
      );
      
      const now = new Date().toISOString();
      
      if (existingIndex !== -1) {
        // 更新现有权限
        mockResourcePermissions[existingIndex].access_level = accessLevel;
        mockResourcePermissions[existingIndex].updated_at = now;
        
        return JSON.parse(JSON.stringify(mockResourcePermissions[existingIndex]));
      } else {
        // 创建新权限
        const newPermission: ResourcePermission = {
          id: uuidv4(),
          user_id: userId,
          resource_type: resourceType,
          resource_id: resourceId,
          access_level: accessLevel,
          created_at: now,
          updated_at: now
        };
        
        mockResourcePermissions.push(newPermission);
        return JSON.parse(JSON.stringify(newPermission));
      }
    }
    
    try {
      logger.info(`向后端API授予资源权限, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}, 访问级别: ${accessLevel}`);
      const response = await axios.post<ResourcePermission>(
        `${this.apiUrl}/api/permissions/resources/${resourceType}/${resourceId}/access`,
        {
          user_id: userId,
          access_level: accessLevel
        }
      );
      return response.data;
    } catch (error) {
      logger.error(`授予资源权限失败, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}:`, error);
      throw new Error('授予资源权限失败');
    }
  }
  
  /**
   * 撤销资源权限
   */
  async revokeResourceAccess(
    userId: string, 
    resourceType: ResourceType, 
    resourceId: string
  ): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据撤销资源权限, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
      
      // 查找权限记录
      const index = mockResourcePermissions.findIndex(
        perm => perm.user_id === userId && 
                perm.resource_type === resourceType && 
                perm.resource_id === resourceId
      );
      
      if (index === -1) {
        return false; // 权限不存在
      }
      
      // 移除权限
      mockResourcePermissions.splice(index, 1);
      return true;
    }
    
    try {
      logger.info(`向后端API撤销资源权限, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
      await axios.delete(
        `${this.apiUrl}/api/permissions/resources/${resourceType}/${resourceId}/access?userId=${userId}`
      );
      return true;
    } catch (error) {
      logger.error(`撤销资源权限失败, 用户ID: ${userId}, 资源类型: ${resourceType}, 资源ID: ${resourceId}:`, error);
      throw new Error('撤销资源权限失败');
    }
  }
  
  /**
   * 获取资源的权限列表
   */
  async getResourcePermissions(
    resourceType: ResourceType, 
    resourceId: string
  ): Promise<ResourcePermission[]> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取资源权限列表, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
      
      // 过滤匹配的资源权限
      const permissions = mockResourcePermissions.filter(
        perm => perm.resource_type === resourceType && perm.resource_id === resourceId
      );
      
      return JSON.parse(JSON.stringify(permissions));
    }
    
    try {
      logger.info(`从后端API获取资源权限列表, 资源类型: ${resourceType}, 资源ID: ${resourceId}`);
      const response = await axios.get<ResourcePermission[]>(
        `${this.apiUrl}/api/permissions/resources/${resourceType}/${resourceId}/permissions`
      );
      return response.data;
    } catch (error) {
      logger.error(`获取资源权限列表失败, 资源类型: ${resourceType}, 资源ID: ${resourceId}:`, error);
      throw new Error('获取资源权限列表失败');
    }
  }
}

export const permissionsService = new PermissionsService();
