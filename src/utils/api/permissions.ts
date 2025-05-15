/**
 * 权限管理API服务
 */
import {
  Permission,
  Role,
  UserRoleAssignment,
  ResourcePermission,
  ResourceType,
  AccessLevel,
  KnowledgeBaseAccess,
  AssistantAccess,
  PermissionCheckResult
} from '../../../shared/types/auth';
import apiClient from './client';

const BASE_URL = 'permissions';

/**
 * 权限管理API服务
 */
export const permissionsApi = {
  /**
   * 获取所有权限
   */
  getPermissions() {
    return apiClient.get<Permission[]>(`${BASE_URL}`);
  },

  /**
   * 检查当前用户是否拥有指定权限
   */
  checkPermission(permissionCode: string) {
    return apiClient.get<PermissionCheckResult>(`${BASE_URL}/check/${permissionCode}`);
  },

  /**
   * 检查当前用户是否拥有多个权限
   */
  checkPermissions(permissionCodes: string[]) {
    return apiClient.post<PermissionCheckResult>(`${BASE_URL}/check-multiple`, { 
      permission_codes: permissionCodes 
    });
  },

  /**
   * 获取所有角色
   */
  getRoles() {
    return apiClient.get<Role[]>(`${BASE_URL}/roles`);
  },

  /**
   * 获取角色详情
   */
  getRoleById(roleId: string) {
    return apiClient.get<Role>(`${BASE_URL}/roles/${roleId}`);
  },

  /**
   * 创建新角色
   */
  createRole(role: Pick<Role, 'name' | 'description' | 'is_default'>) {
    return apiClient.post<Role>(`${BASE_URL}/roles`, role);
  },

  /**
   * 更新角色
   */
  updateRole(roleId: string, data: Partial<Pick<Role, 'name' | 'description' | 'is_default'>>) {
    return apiClient.put<Role>(`${BASE_URL}/roles/${roleId}`, data);
  },

  /**
   * 删除角色
   */
  deleteRole(roleId: string) {
    return apiClient.delete(`${BASE_URL}/roles/${roleId}`);
  },

  /**
   * 为角色分配权限
   */
  assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    return apiClient.post<Role>(`${BASE_URL}/roles/${roleId}/permissions`, { 
      permission_ids: permissionIds 
    });
  },

  /**
   * 获取角色的所有权限
   */
  getRolePermissions(roleId: string) {
    return apiClient.get<Permission[]>(`${BASE_URL}/roles/${roleId}/permissions`);
  },

  /**
   * 为用户分配角色
   */
  assignRoleToUser(userId: string, roleId: string) {
    return apiClient.post<UserRoleAssignment>(`${BASE_URL}/users/${userId}/roles`, { role_id: roleId });
  },

  /**
   * 移除用户的角色
   */
  removeRoleFromUser(userId: string, roleId: string) {
    return apiClient.delete(`${BASE_URL}/users/${userId}/roles/${roleId}`);
  },

  /**
   * 获取用户的所有角色
   */
  getUserRoles(userId: string) {
    return apiClient.get<Role[]>(`${BASE_URL}/users/${userId}/roles`);
  },

  /**
   * 创建资源权限
   */
  createResourcePermission(resourcePermission: {
    user_id: string;
    resource_type: ResourceType;
    resource_id: string;
    access_level: AccessLevel;
  }) {
    return apiClient.post<ResourcePermission>(`${BASE_URL}/resources`, resourcePermission);
  },

  /**
   * 获取资源权限
   */
  getResourcePermissions(
    resourceType: ResourceType,
    resourceId: string
  ) {
    return apiClient.get<ResourcePermission[]>(
      `${BASE_URL}/resources/${resourceType}/${resourceId}`
    );
  },

  /**
   * 更新资源权限
   */
  updateResourcePermission(
    permissionId: string,
    data: { access_level: AccessLevel }
  ) {
    return apiClient.put<ResourcePermission>(`${BASE_URL}/resources/${permissionId}`, data);
  },

  /**
   * 删除资源权限
   */
  deleteResourcePermission(permissionId: string) {
    return apiClient.delete(`${BASE_URL}/resources/${permissionId}`);
  },

  /**
   * 检查用户对资源的访问权限
   */
  checkResourceAccess(
    resourceType: ResourceType,
    resourceId: string,
    requiredLevel: AccessLevel
  ) {
    return apiClient.get<{ has_access: boolean }>(
      `${BASE_URL}/resources/${resourceType}/${resourceId}/check`,
      { required_level: requiredLevel }
    );
  },

  /**
   * 获取知识库访问权限
   */
  getKnowledgeBaseAccess(knowledgeBaseId: string) {
    return apiClient.get<KnowledgeBaseAccess[]>(
      `${BASE_URL}/knowledge-bases/${knowledgeBaseId}/access`
    );
  },

  /**
   * 设置知识库访问权限
   */
  setKnowledgeBaseAccess(
    knowledgeBaseId: string,
    userId: string,
    access: Omit<KnowledgeBaseAccess, 'id' | 'user_id' | 'knowledge_base_id'>
  ) {
    return apiClient.post<KnowledgeBaseAccess>(
      `${BASE_URL}/knowledge-bases/${knowledgeBaseId}/access`,
      {
        user_id: userId,
        ...access
      }
    );
  },

  /**
   * 获取助手访问权限
   */
  getAssistantAccess(assistantId: string) {
    return apiClient.get<AssistantAccess[]>(
      `${BASE_URL}/assistants/${assistantId}/access`
    );
  },

  /**
   * 设置助手访问权限
   */
  setAssistantAccess(
    assistantId: string,
    userId: string,
    access: Omit<AssistantAccess, 'id' | 'user_id' | 'assistant_id'>
  ) {
    return apiClient.post<AssistantAccess>(
      `${BASE_URL}/assistants/${assistantId}/access`,
      {
        user_id: userId,
        ...access
      }
    );
  },
  
  /**
   * 获取用户可访问的资源
   */
  getUserAccessibleResources(userId: string, resourceType: ResourceType) {
    return apiClient.get<string[]>(
      `${BASE_URL}/users/${userId}/resources/${resourceType}`
    );
  },
  
  /**
   * 检查当前用户可访问性
   */
  checkCurrentUserAccess(resourceType: ResourceType, resourceId: string) {
    return apiClient.get<{
      can_read: boolean;
      can_write: boolean;
      can_delete: boolean;
      can_share: boolean;
      is_admin: boolean;
    }>(`${BASE_URL}/access-check/${resourceType}/${resourceId}`);
  }
};

export default permissionsApi;
