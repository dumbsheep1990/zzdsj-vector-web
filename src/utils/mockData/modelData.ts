import { ModelItem } from "../types";

// 模型数据
export const modelsData: ModelItem[] = [
  {
    id: 1,
    name: 'GPT-4',
    type: '大型语言模型',
    status: '已部署',
    lastUsed: '2023-03-15',
    provider: 'OpenAI',
    version: '4.0',
    usageCount: 145,
    parameters: 1750000000000
  },
  {
    id: 2,
    name: 'BERT-Large',
    type: '编码器模型',
    status: '已部署',
    lastUsed: '2023-03-14',
    provider: 'Hugging Face',
    version: '1.2',
    usageCount: 87,
    parameters: 340000000
  },
  {
    id: 3,
    name: 'T5-Large',
    type: '编码器-解码器模型',
    status: '训练中',
    lastUsed: '2023-03-10',
    provider: 'Hugging Face',
    version: '1.1',
    usageCount: 42,
    parameters: 770000000
  },
  {
    id: 4,
    name: 'RoBERTa',
    type: '编码器模型',
    status: '已部署',
    lastUsed: '2023-03-08',
    provider: 'Hugging Face',
    version: '1.0',
    usageCount: 63,
    parameters: 355000000
  },
  {
    id: 5,
    name: 'GPT-3.5',
    type: '大型语言模型',
    status: '已部署',
    lastUsed: '2023-03-05',
    provider: 'OpenAI',
    version: '3.5',
    usageCount: 210,
    parameters: 175000000000
  }
];
