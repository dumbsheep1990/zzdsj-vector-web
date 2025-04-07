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

// 测试数据：问题列表
export const mockQuestions: QAQuestion[] = [
    {
        id: 'q1',
        question: '如何安装和初始化系统？',
        documentId: 'doc1',
        segmentId: 'seg1',
        answerType: 'original',
        createTime: '2024-03-25 11:00:00',
        updateTime: '2024-03-25 11:00:00',
        tags: ['安装', '初始化'],
        status: 'active'
    },
    {
        id: 'q2',
        question: '系统支持哪些数据格式？',
        documentId: 'doc2',
        segmentId: 'seg5',
        answerType: 'summary',
        createTime: '2024-03-24 16:30:00',
        updateTime: '2024-03-24 16:30:00',
        tags: ['数据格式', '兼容性'],
        status: 'active'
    },
    {
        id: 'q3',
        question: '如何处理常见的错误码？',
        documentId: 'doc3',
        segmentId: 'seg2',
        answerType: 'original',
        createTime: '2024-03-23 10:20:00',
        updateTime: '2024-03-23 10:20:00',
        tags: ['错误处理', '故障排除'],
        status: 'active'
    },
    {
        id: 'q4',
        question: '系统的最低硬件要求是什么？',
        documentId: 'doc1',
        segmentId: 'seg3',
        answerType: 'summary',
        createTime: '2024-03-22 15:45:00',
        updateTime: '2024-03-22 15:45:00',
        tags: ['硬件要求', '系统要求'],
        status: 'active'
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
    totalDocuments: 4,
    totalQuestions: 75,
    totalSegments: 35,
    processingDocuments: 1,
    activeQuestions: 72,
    averageQuestionsPerDoc: 18.75,
    topTags: ['技术文档', 'FAQ', '用户指南', '错误处理']
}; 