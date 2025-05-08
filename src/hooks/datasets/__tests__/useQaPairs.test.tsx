import { renderHook, act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom';
import { useQaPairs } from '../useQaPairs';
import { QaDataset, QaPair } from '../../../utils/types';

// 测试数据集
const mockDataset: QaDataset = {
  id: 'dataset1',
  name: '测试数据集',
  description: '用于测试的数据集',
  createdAt: new Date(),
  updatedAt: new Date(),
  questionCount: 2,
  pairsCount: 2,
  status: 'active',
  linkedAssistants: [],
  qaPairs: [
    {
      id: 'qa1',
      question: '测试问题1',
      answer: '测试答案1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'qa2',
      question: '测试问题2',
      answer: '测试答案2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

describe('useQaPairs hook', () => {
  // Mock更新数据集的回调函数
  const mockUpdateDataset = jest.fn();

  beforeEach(() => {
    // 每个测试前重置mock函数
    mockUpdateDataset.mockClear();
  });

  // 测试初始状态
  it('应该返回初始状态', () => {
    const { result } = renderHook(() => useQaPairs(mockDataset, mockUpdateDataset));
    
    // 初始状态下，对话框不可见，没有编辑中的问答对
    expect(result.current.showQaPairDialog).toBe(false);
    expect(result.current.editingQaPair).toBeUndefined();
  });

  // 测试创建问答对功能
  it('应该能够打开创建问答对对话框', () => {
    const { result } = renderHook(() => useQaPairs(mockDataset, mockUpdateDataset));
    
    // 调用创建方法
    act(() => {
      result.current.createQaPair();
    });
    
    // 验证对话框状态
    expect(result.current.showQaPairDialog).toBe(true);
    expect(result.current.editingQaPair).toBeUndefined();
  });

  // 测试编辑问答对功能
  it('应该能够打开编辑问答对对话框', () => {
    const { result } = renderHook(() => useQaPairs(mockDataset, mockUpdateDataset));
    
    const pairToEdit = mockDataset.qaPairs[0];
    
    // 调用编辑方法
    act(() => {
      result.current.editQaPair(pairToEdit);
    });
    
    // 验证对话框状态和编辑中的问答对
    expect(result.current.showQaPairDialog).toBe(true);
    expect(result.current.editingQaPair).toEqual(pairToEdit);
  });

  // 测试关闭对话框功能
  it('应该能够关闭问答对对话框', () => {
    const { result } = renderHook(() => useQaPairs(mockDataset, mockUpdateDataset));
    
    // 先打开对话框
    act(() => {
      result.current.createQaPair();
    });
    
    // 确认对话框已打开
    expect(result.current.showQaPairDialog).toBe(true);
    
    // 关闭对话框
    act(() => {
      result.current.closeQaPairDialog();
    });
    
    // 验证对话框状态
    expect(result.current.showQaPairDialog).toBe(false);
    expect(result.current.editingQaPair).toBeUndefined();
  });

  // 测试保存新问答对功能
  it('应该能够保存新的问答对', () => {
    const { result } = renderHook(() => useQaPairs(mockDataset, mockUpdateDataset));
    
    const newQaPair = {
      question: '新问题',
      answer: '新答案'
    };
    
    // 调用保存方法
    act(() => {
      result.current.saveQaPair(newQaPair);
    });
    
    // 验证updateDataset被调用
    expect(mockUpdateDataset).toHaveBeenCalledTimes(1);
    expect(mockUpdateDataset).toHaveBeenCalledWith(
      mockDataset.id,
      expect.objectContaining({
        qaPairs: expect.arrayContaining([
          expect.objectContaining({
            question: '新问题',
            answer: '新答案'
          })
        ]),
        questionCount: mockDataset.qaPairs.length + 1
      })
    );
    
    // 验证对话框已关闭
    expect(result.current.showQaPairDialog).toBe(false);
  });

  // 测试更新现有问答对功能
  it('应该能够更新现有问答对', () => {
    const { result } = renderHook(() => useQaPairs(mockDataset, mockUpdateDataset));
    
    const pairToEdit = mockDataset.qaPairs[0];
    const updatedData = {
      question: '更新后的问题',
      answer: '更新后的答案'
    };
    
    // 先开始编辑
    act(() => {
      result.current.editQaPair(pairToEdit);
    });
    
    // 然后保存更新
    act(() => {
      result.current.saveQaPair(updatedData);
    });
    
    // 验证updateDataset被调用
    expect(mockUpdateDataset).toHaveBeenCalledTimes(1);
    expect(mockUpdateDataset).toHaveBeenCalledWith(
      mockDataset.id,
      expect.objectContaining({
        qaPairs: expect.arrayContaining([
          expect.objectContaining({
            id: pairToEdit.id,
            question: '更新后的问题',
            answer: '更新后的答案'
          })
        ])
      })
    );
  });

  // 测试删除问答对功能
  it('应该能够删除问答对', () => {
    const { result } = renderHook(() => useQaPairs(mockDataset, mockUpdateDataset));
    
    const pairToDelete = mockDataset.qaPairs[0];
    
    // 调用删除方法
    act(() => {
      result.current.deleteQaPair(pairToDelete.id);
    });
    
    // 验证updateDataset被调用
    expect(mockUpdateDataset).toHaveBeenCalledTimes(1);
    expect(mockUpdateDataset).toHaveBeenCalledWith(
      mockDataset.id,
      expect.objectContaining({
        qaPairs: expect.not.arrayContaining([
          expect.objectContaining({
            id: pairToDelete.id
          })
        ]),
        questionCount: mockDataset.qaPairs.length - 1
      })
    );
  });

  // 测试空数据集情况
  it('当数据集为null时不应执行操作', () => {
    const { result } = renderHook(() => useQaPairs(null, mockUpdateDataset));
    
    // 尝试保存和删除操作
    act(() => {
      result.current.saveQaPair({ question: '测试问题', answer: '测试答案' });
      result.current.deleteQaPair('someId');
    });
    
    // 验证updateDataset没有被调用
    expect(mockUpdateDataset).not.toHaveBeenCalled();
  });
});
