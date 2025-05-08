import { renderHook, act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom';
import { useDatasetsData } from '../useDatasetsData';
// 注意：实际使用时，我们只需要引入这个模块，但不会直接使用它，因为它会被mock
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mockDatasets } from '../../../utils/mockQaData';

// 定义测试使用的数据集数据类型
type TestDatasetItem = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  questionCount: number;
  qaPairs: Array<{
    id: string;
    question: string;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

// 创建测试数据
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testDatasets: TestDatasetItem[] = [
  {
    id: 'dataset1',
    name: '测试数据集1',
    description: '测试描述1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questionCount: 2,
    qaPairs: [
      {
        id: 'qa1',
        question: '问题1',
        answer: '答案1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'qa2',
        question: '问题2',
        answer: '答案2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'dataset2',
    name: '测试数据集2',
    description: '测试描述2',
    createdAt: new Date(),
    updatedAt: new Date(),
    questionCount: 1,
    qaPairs: [
      {
        id: 'qa3',
        question: '问题3',
        answer: '答案3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

// 模拟mockQaData模块
jest.mock('../../../utils/mockQaData', () => ({
  mockDatasets: [
    {
      id: 'dataset1',
      name: '测试数据集1',
      description: '测试描述1',
      createdAt: new Date(),
      updatedAt: new Date(),
      questionCount: 2,
      qaPairs: [
        {
          id: 'qa1',
          question: '问题1',
          answer: '答案1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'qa2',
          question: '问题2',
          answer: '答案2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: 'dataset2',
      name: '测试数据集2',
      description: '测试描述2',
      createdAt: new Date(),
      updatedAt: new Date(),
      questionCount: 1,
      qaPairs: [
        {
          id: 'qa3',
          question: '问题3',
          answer: '答案3',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ]
}));

describe('useDatasetsData hook', () => {
  // 测试初始状态
  it('应该返回初始状态', () => {
    const { result } = renderHook(() => useDatasetsData());
    
    // 初始状态下，数据应为空数组，加载状态为true
    expect(result.current.datasetsData).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.selectedDataset).toBe(null);
  });

  // 测试数据加载
  it('应该加载数据集数据', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDatasetsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 数据加载后，应该有两个数据集，加载状态为false
    expect(result.current.datasetsData.length).toBe(2);
    expect(result.current.isLoading).toBe(false);
  });

  // 测试选择数据集
  it('应该能够选择数据集', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDatasetsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 选择第一个数据集
    act(() => {
      result.current.setSelectedDataset(result.current.datasetsData[0]);
    });
    
    // 验证选中状态
    expect(result.current.selectedDataset).toEqual(result.current.datasetsData[0]);
  });

  // 测试创建数据集
  it('应该能够创建新数据集', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDatasetsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 创建新数据集
    act(() => {
      result.current.createDataset('新数据集', '新数据集描述');
    });
    
    // 验证数据集是否被添加到列表
    expect(result.current.datasetsData.length).toBe(3);
    expect(result.current.datasetsData[0].name).toBe('新数据集');
    expect(result.current.datasetsData[0].description).toBe('新数据集描述');
  });

  // 测试更新数据集
  it('应该能够更新数据集', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDatasetsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 先选择一个数据集
    act(() => {
      result.current.setSelectedDataset(result.current.datasetsData[0]);
    });
    
    // 更新该数据集
    act(() => {
      result.current.updateDataset(result.current.datasetsData[0].id, { name: '更新后的数据集' });
    });
    
    // 验证数据集是否被更新
    expect(result.current.datasetsData[0].name).toBe('更新后的数据集');
    // 选中数据集也应该被更新
    expect(result.current.selectedDataset?.name).toBe('更新后的数据集');
  });

  // 测试删除数据集
  it('应该能够删除数据集', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDatasetsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 先记录原来的长度
    const originalLength = result.current.datasetsData.length;
    
    // 选择第一个数据集
    act(() => {
      result.current.setSelectedDataset(result.current.datasetsData[0]);
    });
    
    // 删除该数据集
    act(() => {
      result.current.deleteDataset(result.current.datasetsData[0].id);
    });
    
    // 验证数据集是否被删除
    expect(result.current.datasetsData.length).toBe(originalLength - 1);
    // 选中数据集应该被清空
    expect(result.current.selectedDataset).toBe(null);
  });
});
