// 问答相关类型定义
export interface Question {
  id: string;
  assistantId: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'answered' | 'error';
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  createdAt: string;
  sources?: {
    title: string;
    url: string;
  }[];
}

export interface QaPair {
  id: string;
  question: string;
  answer: string;
  datasetId?: string;
  createdAt: string;
}
