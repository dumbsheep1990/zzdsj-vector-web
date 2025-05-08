import { renderHook, act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom';
import { useVectorsData } from '../useVectorsData';
// 注意: mockVectorData只在useVectorsData中用于模拟数据加载，这里不需要直接引用
// import { mockVectorData } from '../../../utils/mockData';

// 定义测试使用的向量数据类型
type TestVectorItem = {
  id: string;
  name: string;
  description: string;
  dimension: number;
  count: number;
};

// 创建测试数据
const testVectorData: TestVectorItem[] = [
  { id: 'vector1', name: '测试向量1', description: '测试描述1', dimension: 128, count: 1000 },
  { id: 'vector2', name: '测试向量2', description: '测试描述2', dimension: 256, count: 2000 }
];

// 模拟mockData模块
jest.mock('../../../utils/mockData', () => ({
  vectorData: testVectorData
}));

describe('useVectorsData hook', () => {
  // 测试初始状态
  it('应该返回初始状态', () => {
    const { result } = renderHook(() => useVectorsData());
    
    // 初始状态下，数据应为空数组，加载状态为true
    expect(result.current.vectorData).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.selectedVector).toBe(null);
  });

  // 测试数据加载
  it('应该加载向量数据', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVectorsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 数据加载后，应该有两个向量，加载状态为false
    expect(result.current.vectorData).toEqual(testVectorData);
    expect(result.current.isLoading).toBe(false);
  });

  // 测试选择向量
  it('应该能够选择向量', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVectorsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 选择第一个向量
    act(() => {
      result.current.setSelectedVector(testVectorData[0]);
    });
    
    // 验证选中状态
    expect(result.current.selectedVector).toEqual(testVectorData[0]);
  });

  // 测试创建向量
  it('应该能够创建新向量', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVectorsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 创建新向量
    const newVector = {
      name: '新向量',
      description: '新向量描述',
      dimension: 512,
      count: 3000,
      // 添加VectorItem类型需要的属性
      status: 'active',
      fileCount: 0,
      size: '0 KB',
      lastUpdated: new Date().toISOString()
    };
    
    act(() => {
      result.current.createVector(newVector);
    });
    
    // 验证向量是否被添加到列表
    expect(result.current.vectorData.length).toBe(testVectorData.length + 1);
    expect(result.current.vectorData[0].name).toBe('新向量');
    expect(result.current.vectorData[0].description).toBe('新向量描述');
  });

  // 测试更新向量
  it('应该能够更新向量', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVectorsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 先选择一个向量
    act(() => {
      result.current.setSelectedVector(testVectorData[0]);
    });
    
    // 更新该向量
    act(() => {
      result.current.updateVector(testVectorData[0].id, { name: '更新后的向量' });
    });
    
    // 验证向量是否被更新
    expect(result.current.vectorData[0].name).toBe('更新后的向量');
    // 选中向量也应该被更新
    expect(result.current.selectedVector?.name).toBe('更新后的向量');
  });

  // 测试删除向量
  it('应该能够删除向量', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVectorsData());
    
    // 等待加载完成
    await waitForNextUpdate();
    
    // 先记录原来的长度
    const originalLength = result.current.vectorData.length;
    
    // 选择第一个向量
    act(() => {
      result.current.setSelectedVector(testVectorData[0]);
    });
    
    // 删除该向量
    act(() => {
      result.current.deleteVector(testVectorData[0].id);
    });
    
    // 验证向量是否被删除
    expect(result.current.vectorData.length).toBe(originalLength - 1);
    // 选中向量应该被清空
    expect(result.current.selectedVector).toBe(null);
  });
});
