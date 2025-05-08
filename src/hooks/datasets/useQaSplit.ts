import { useState } from 'react';
import { QaPair, QaDataset } from '../../utils/types';

/**
 * 问答拆分管理Hook
 * 
 * 管理问答拆分功能和对话框状态
 * 
 * @param dataset 当前数据集
 * @param onUpdateDataset 数据集更新回调
 * @returns {object} 包含问答拆分操作方法和对话框状态的对象
 */
export const useQaSplit = (
  dataset: QaDataset | null,
  onUpdateDataset: (datasetId: string, updates: Partial<QaDataset>) => void
) => {
  const [showQaSplitDialog, setShowQaSplitDialog] = useState(false);

  // 打开问答拆分对话框
  const openQaSplitDialog = () => {
    setShowQaSplitDialog(true);
  };

  // 关闭问答拆分对话框
  const closeQaSplitDialog = () => {
    setShowQaSplitDialog(false);
  };

  // 保存拆分的问答对
  const saveSplitQaPairs = (qaPairs: Partial<QaPair>[]) => {
    if (!dataset) return;

    // 为每个拆分的问答对生成ID
    const newQaPairs: QaPair[] = qaPairs.map(pair => ({
      id: `qa_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      question: pair.question || '',
      answer: pair.answer || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // 合并到现有的问答对中
    const updatedQaPairs = [...dataset.qaPairs, ...newQaPairs];
    
    // 更新数据集
    onUpdateDataset(dataset.id, { 
      qaPairs: updatedQaPairs,
      questionCount: updatedQaPairs.length
    });

    // 关闭对话框
    closeQaSplitDialog();
  };

  return {
    showQaSplitDialog,
    openQaSplitDialog,
    closeQaSplitDialog,
    saveSplitQaPairs
  };
};
