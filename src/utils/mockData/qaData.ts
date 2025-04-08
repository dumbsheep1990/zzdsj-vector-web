// 文档类型定义
export interface QADocument {
    id: string;
    title: string;
    type: string;
    size: string;
    uploadTime: string;
    status: 'processed' | 'processing' | 'failed';
    segmentCount: number;
    questionCount: number;
    tags: string[];
}

// 问题类型定义
export interface QAQuestion {
    id: string;
    question: string;
    documentId: string | null;
    segmentId: string | null;
    answerType: 'original' | 'summary';
    createTime: string;
    updateTime: string;
    tags: string[];
    status: 'active' | 'inactive';
}

// 文档分段类型定义
export interface QASegment {
    id: string;
    documentId: string;
    content: string;
    startIndex: number;
    endIndex: number;
    questionCount: number;
}

// 测试数据：文档列表
export const mockDocuments: QADocument[] = [
    {
        id: 'doc1',
        title: '产品使用手册.pdf',
        type: 'PDF',
        size: '2.5MB',
        uploadTime: '2024-03-25 10:30:00',
        status: 'processed',
        segmentCount: 15,
        questionCount: 25,
        tags: ['产品文档', '用户指南']
    },
    {
        id: 'doc2',
        title: '技术规范说明.docx',
        type: 'Word',
        size: '1.8MB',
        uploadTime: '2024-03-24 15:20:00',
        status: 'processed',
        segmentCount: 12,
        questionCount: 18,
        tags: ['技术文档', '规范']
    },
    {
        id: 'doc3',
        title: '常见问题解答.md',
        type: 'Markdown',
        size: '256KB',
        uploadTime: '2024-03-23 09:15:00',
        status: 'processed',
        segmentCount: 8,
        questionCount: 32,
        tags: ['FAQ', '问答']
    },
    {
        id: 'doc4',
        title: '系统架构设计.pdf',
        type: 'PDF',
        size: '5.2MB',
        uploadTime: '2024-03-22 14:45:00',
        status: 'processing',
        segmentCount: 0,
        questionCount: 0,
        tags: ['技术文档', '架构']
    }
];

export interface DocumentInfo {
    title: string;
    page: number;
    segment: string;
    segmentId: string;
    similarity: number;
    relevanceScore: number;
}

export interface Answer {
    id: string;
    content: string;
    source: string;
    confidence: number;
    rank: number;
    feedback: 'positive' | 'negative' | null;
    isManual: boolean;
    createTime: string;
    documentInfo: DocumentInfo;
}

export interface Question {
    id: string;
    question: string;
    answers: Answer[];
    status: 'active' | 'inactive';
    documentId?: string;
    segmentId?: string;
    createTime: string;
    updateTime: string;
    tags: string[];
}

export const mockAnswers: Answer[] = [
    {
        id: '1',
        content: '向量数据库是一种专门用于存储和检索向量数据的数据库系统。它能够高效地进行相似度搜索，支持海量高维向量的存储和快速检索。',
        source: '向量数据库介绍.pdf',
        confidence: 0.95,
        rank: 1,
        feedback: null,
        isManual: false,
        createTime: '2024-03-15T10:00:00Z',
        documentInfo: {
            title: '向量数据库介绍.pdf',
            page: 1,
            segment: '第一章 基础概念',
            segmentId: 'seg_001',
            similarity: 0.95,
            relevanceScore: 0.92
        }
    },
    {
        id: '2',
        content: '向量数据库的主要应用场景包括：图像检索、文本语义搜索、推荐系统、人脸识别等领域。它通过将数据转换为高维向量，实现基于语义的相似度匹配。',
        source: '向量数据库介绍.pdf',
        confidence: 0.88,
        rank: 2,
        feedback: 'positive',
        isManual: false,
        createTime: '2024-03-15T10:01:00Z',
        documentInfo: {
            title: '向量数据库介绍.pdf',
            page: 2,
            segment: '第一章 应用场景',
            segmentId: 'seg_002',
            similarity: 0.88,
            relevanceScore: 0.85
        }
    },
    {
        id: '3',
        content: '向量数据库使用特殊的索引结构（如HNSW、IVF等）来加速向量检索过程，能够在毫秒级别内完成海量数据的相似度搜索。',
        source: '向量数据库技术原理.pdf',
        confidence: 0.82,
        rank: 3,
        feedback: null,
        isManual: false,
        createTime: '2024-03-15T10:02:00Z',
        documentInfo: {
            title: '向量数据库技术原理.pdf',
            page: 15,
            segment: '第三章 索引结构',
            segmentId: 'seg_003',
            similarity: 0.82,
            relevanceScore: 0.79
        }
    }
];

export const mockQuestions: Question[] = [
    {
        id: '1',
        question: '什么是向量数据库？',
        answers: mockAnswers,
        status: 'active',
        documentId: 'doc_001',
        segmentId: 'seg_001',
        createTime: '2024-03-15T09:00:00Z',
        updateTime: '2024-03-15T10:00:00Z',
        tags: ['基础概念', '数据库']
    },
    {
        id: '2',
        question: '向量数据库有哪些优势？',
        answers: mockAnswers.slice(1),
        status: 'active',
        documentId: 'doc_002',
        segmentId: 'seg_002',
        createTime: '2024-03-15T09:30:00Z',
        updateTime: '2024-03-15T10:30:00Z',
        tags: ['性能', '特性']
    }
];

// 测试数据：文档分段
export const mockSegments: QASegment[] = [
    {
        id: 'seg1',
        documentId: 'doc1',
        content: '1. 系统安装\n首先，下载安装包并解压。运行setup.exe，按照向导提示完成安装。\n初始化时，需要配置数据库连接和基本参数。',
        startIndex: 0,
        endIndex: 500,
        questionCount: 3
    },
    {
        id: 'seg2',
        documentId: 'doc3',
        content: '错误码说明：\nE001: 数据库连接失败\nE002: 参数验证错误\nE003: 权限不足\n处理方法：检查相应配置和权限设置。',
        startIndex: 0,
        endIndex: 300,
        questionCount: 5
    },
    {
        id: 'seg3',
        documentId: 'doc1',
        content: '系统要求：\n- CPU: 2.0GHz及以上\n- 内存: 8GB及以上\n- 硬盘: 50GB可用空间\n- 操作系统: Windows 10/11',
        startIndex: 501,
        endIndex: 800,
        questionCount: 2
    }
];

// 测试数据：统计信息
export const mockQAStats = {
    totalAssistants: 5,
    onlineAssistants: 3,
    totalDocuments: 90,
    totalQuestions: 864,
    totalSegments: 450,
    processingDocuments: 8,
    activeQuestions: 720,
    averageQuestionsPerDoc: 9.6,
    topTags: ['产品', '技术', '培训', '流程', '政策']
}; 