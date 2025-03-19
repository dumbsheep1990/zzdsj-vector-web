// 关键词管理和搜索记录类型

// 文件类型
export interface FileItem {
    id: string | null;
    name: string;
    type: string;
    size: string;
    date: string;
    category: string;
    status: string;
    isFolder: boolean;
    parentId: string | null;
    path: string;
    children?: FileItem[];
    keywords?: KeywordRelevance[];
}

// 关键词关联度类型
export interface KeywordRelevance {
    keyword: string;
    relevance: number; // 0-100的关联度分数
}

// 模型类型
export interface ModelItem {
    id: number;
    name: string;
    type: string;
    status: string;
    lastUsed: string;
    provider: string;
    version: string;
    usageCount: number;
    parameters?: number;
}

// 向量库类型
export interface VectorItem {
    id: number;
    name: string;
    fileCount: number;
    lastUpdated: string;
    size: string;
    status: string;
}

// 关键词类型
export interface KeywordItem {
    id: number;
    keyword: string;
    frequency: number;
    lastUsed: string;
    category: string;
    importance: string;
    relatedKeywords: number[];
}

// 搜索记录类型
export interface SearchRecordItem {
    id: number;
    query: string;
    timestamp: string;
    results: number;
    duration: string;
    user: string;
    source: string;
}

// 元数据模板类型
export interface MetadataItem {
    id: number;
    name: string;
    fields: number;
    lastUpdated: string;
    usage: string;
}

// 导航项类型
export interface NavItem {
    id: string;
    label: string;
    iconType: string; 
    children?: NavItem[];
}

// 知识图谱节点类型
export interface GraphNode {
    id: string;
    label: string;
    type: string;
}

// 知识图谱连接类型
export interface GraphLink {
    source: string;
    target: string;
    value?: number;
}

// 统计卡片类型
export interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
    bgGradient: string;
}

// 通用详情面板Props
export interface DetailPanelProps {
    selectedItem: FileItem | ModelItem | VectorItem | MetadataItem | KeywordItem | SearchRecordItem | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<any | null>>;
    activeSection: string;
}

// 知识库类型
export interface KnowledgeBaseItem {
    id: string;
    name: string;
    description: string;
    fileCount: number;
    vectorCount: number;
    lastUpdated: string;
    category?: string;
    size?: string;
    status?: string;
    vectorized?: number;
    pendingFiles?: number;
    tags?: string[];
    recentKeywords?: string[];
}

// 应用全局状态
export interface AppState {
    activeSection: string;
    sidebarExpanded: boolean;
    darkMode: boolean;
    username: string;
}