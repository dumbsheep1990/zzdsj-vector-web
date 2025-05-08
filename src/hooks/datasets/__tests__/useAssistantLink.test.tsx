import { renderHook, act } from '@testing-library/react-hooks';
import '@testing-library/jest-dom';
import { useAssistantLink } from '../useAssistantLink';
import { QaDataset, AssistantItem } from '../../../utils/types';

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
  ],
  linkedAssistants: []
};

// 测试助手数据
const mockAssistants: AssistantItem[] = [
  { id: 'assistant1', name: '测试助手1', description: '测试助手描述1' },
  { id: 'assistant2', name: '测试助手2', description: '测试助手描述2' }
];

describe('useAssistantLink hook', () => {
  // Mock更新数据集的回调函数
  const mockUpdateDataset = jest.fn();

  beforeEach(() => {
    // 每个测试前重置mock函数
    mockUpdateDataset.mockClear();
  });

  // 测试初始状态
  it('应该返回初始状态', () => {
    const { result } = renderHook(() => useAssistantLink(mockDataset, mockUpdateDataset));
    
    // 初始状态下，对话框不可见
    expect(result.current.showAssistantLinkDialog).toBe(false);
  });

  // 测试打开助手绑定对话框
  it('应该能够打开助手绑定对话框', () => {
    const { result } = renderHook(() => useAssistantLink(mockDataset, mockUpdateDataset));
    
    // 调用打开方法
    act(() => {
      result.current.openAssistantLinkDialog();
    });
    
    // 验证对话框状态
    expect(result.current.showAssistantLinkDialog).toBe(true);
  });

  // 测试关闭助手绑定对话框
  it('应该能够关闭助手绑定对话框', () => {
    const { result } = renderHook(() => useAssistantLink(mockDataset, mockUpdateDataset));
    
    // 先打开对话框
    act(() => {
      result.current.openAssistantLinkDialog();
    });
    
    // 确认对话框已打开
    expect(result.current.showAssistantLinkDialog).toBe(true);
    
    // 关闭对话框
    act(() => {
      result.current.closeAssistantLinkDialog();
    });
    
    // 验证对话框状态
    expect(result.current.showAssistantLinkDialog).toBe(false);
  });

  // 测试保存助手绑定
  it('应该能够保存助手绑定', () => {
    const { result } = renderHook(() => useAssistantLink(mockDataset, mockUpdateDataset));
    
    // 调用保存方法
    act(() => {
      result.current.saveAssistantLinks(mockAssistants);
    });
    
    // 验证updateDataset被调用
    expect(mockUpdateDataset).toHaveBeenCalledTimes(1);
    expect(mockUpdateDataset).toHaveBeenCalledWith(
      mockDataset.id,
      expect.objectContaining({
        linkedAssistants: mockAssistants
      })
    );
    
    // 验证对话框已关闭
    expect(result.current.showAssistantLinkDialog).toBe(false);
  });

  // 测试空数据集情况
  it('当数据集为null时不应执行操作', () => {
    const { result } = renderHook(() => useAssistantLink(null, mockUpdateDataset));
    
    // 尝试保存操作
    act(() => {
      result.current.saveAssistantLinks(mockAssistants);
    });
    
    // 验证updateDataset没有被调用
    expect(mockUpdateDataset).not.toHaveBeenCalled();
  });
});
