/**
 * 系统导航管理API服务
 */
import { MenuItem, NavigationGroup, NavigationConfig, NavigationSettings } from '../../../shared/types/navigation';
import apiClient from './client';

const BASE_URL = 'navigation';

/**
 * 导航管理API服务
 */
export const navigationApi = {
  /**
   * 获取用户可访问的导航菜单
   */
  getUserNavigation() {
    return apiClient.get<NavigationSettings>(`${BASE_URL}/user`);
  },
  
  /**
   * 获取所有导航菜单（管理员）
   */
  getAllNavigation() {
    return apiClient.get<NavigationSettings>(`${BASE_URL}/all`);
  },
  
  /**
   * 获取导航配置
   */
  getNavigationConfig() {
    return apiClient.get<NavigationConfig>(`${BASE_URL}/config`);
  },
  
  /**
   * 更新导航配置
   */
  updateNavigationConfig(config: Partial<NavigationConfig>) {
    return apiClient.put<NavigationConfig>(`${BASE_URL}/config`, config);
  },
  
  /**
   * 获取导航分组列表
   */
  getNavigationGroups() {
    return apiClient.get<NavigationGroup[]>(`${BASE_URL}/groups`);
  },
  
  /**
   * 创建导航分组
   */
  createNavigationGroup(group: Omit<NavigationGroup, 'id' | 'items'>) {
    return apiClient.post<NavigationGroup>(`${BASE_URL}/groups`, group);
  },
  
  /**
   * 更新导航分组
   */
  updateNavigationGroup(id: string, group: Partial<Omit<NavigationGroup, 'id' | 'items'>>) {
    return apiClient.put<NavigationGroup>(`${BASE_URL}/groups/${id}`, group);
  },
  
  /**
   * 删除导航分组
   */
  deleteNavigationGroup(id: string) {
    return apiClient.delete(`${BASE_URL}/groups/${id}`);
  },
  
  /**
   * 获取菜单项列表
   */
  getMenuItems(groupId?: string) {
    const params = groupId ? { groupId } : undefined;
    return apiClient.get<MenuItem[]>(`${BASE_URL}/items`, params);
  },
  
  /**
   * 获取菜单项详情
   */
  getMenuItemById(id: string) {
    return apiClient.get<MenuItem>(`${BASE_URL}/items/${id}`);
  },
  
  /**
   * 创建菜单项
   */
  createMenuItem(item: Omit<MenuItem, 'id' | 'children' | 'updatedAt' | 'updatedBy'>) {
    return apiClient.post<MenuItem>(`${BASE_URL}/items`, item);
  },
  
  /**
   * 更新菜单项
   */
  updateMenuItem(id: string, item: Partial<Omit<MenuItem, 'id' | 'children' | 'updatedAt' | 'updatedBy'>>) {
    return apiClient.put<MenuItem>(`${BASE_URL}/items/${id}`, item);
  },
  
  /**
   * 删除菜单项
   */
  deleteMenuItem(id: string) {
    return apiClient.delete(`${BASE_URL}/items/${id}`);
  },
  
  /**
   * 排序菜单项
   */
  reorderMenuItems(itemIds: string[]) {
    return apiClient.put<{success: boolean}>(`${BASE_URL}/items/reorder`, { itemIds });
  },
  
  /**
   * 移动菜单项到分组
   */
  moveMenuItemToGroup(itemId: string, groupId: string) {
    return apiClient.put<MenuItem>(`${BASE_URL}/items/${itemId}/group/${groupId}`, {});
  },
  
  /**
   * 设置菜单项父级
   */
  setMenuItemParent(itemId: string, parentId: string | null) {
    return apiClient.put<MenuItem>(
      `${BASE_URL}/items/${itemId}/parent`, 
      { parentId: parentId === null ? '' : parentId }
    );
  },
  
  /**
   * 批量更新菜单项权限
   */
  updateMenuItemPermissions(itemId: string, permissions: { 
    requiredPermissions?: string[],
    requiredRoles?: Array<'admin' | 'user' | 'guest'>
  }) {
    return apiClient.put<MenuItem>(`${BASE_URL}/items/${itemId}/permissions`, permissions);
  },
  
  /**
   * 导入导航配置
   */
  importNavigation(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<{success: boolean}>(
      `${BASE_URL}/import`,
      formData,
      {
        headers: {
          'Content-Type': undefined as any
        }
      }
    );
  },
  
  /**
   * 导出导航配置
   */
  exportNavigation() {
    return apiClient.get<Blob>(
      `${BASE_URL}/export`,
      {},
      {
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    );
  },
  
  /**
   * 重置导航配置到默认状态
   */
  resetNavigation() {
    return apiClient.post<{success: boolean}>(`${BASE_URL}/reset`);
  }
};

export default navigationApi;
