// 系统导航管理相关类型定义
export interface MenuItem {
  id: string;
  key: string;
  parentId?: string;
  title: string;
  icon?: string;
  path?: string;
  component?: string;
  redirect?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: boolean;
  disabled?: boolean;
  order: number;
  children?: MenuItem[];
  requiredPermissions?: string[];
  requiredRoles?: Array<'admin' | 'user' | 'guest'>;
  meta?: {
    keepAlive?: boolean;
    hideBreadcrumb?: boolean;
    hideChildrenInMenu?: boolean;
    hideMenu?: boolean;
    title?: string;
    icon?: string;
    badge?: string | number;
    tagColor?: string;
    tag?: string;
    currentActiveMenu?: string;
    [key: string]: any;
  };
  updatedAt?: string;
  updatedBy?: string;
}

export interface NavigationGroup {
  id: string;
  key: string;
  title: string;
  order: number;
  items: MenuItem[];
}

export interface NavigationConfig {
  mode: 'horizontal' | 'vertical' | 'inline';
  theme: 'light' | 'dark';
  collapsed: boolean;
  showSearch: boolean;
  showGroupTitle: boolean;
  accordionMode: boolean;
  collapsedWidth: number;
  headerHeight: number;
  siderWidth: number;
  defaultSelectedKeys: string[];
  defaultOpenKeys: string[];
}

export interface NavigationPermission {
  menuId: string;
  userId: string;
  allowed: boolean;
}

export interface NavigationSettings {
  config: NavigationConfig;
  groups: NavigationGroup[];
}
