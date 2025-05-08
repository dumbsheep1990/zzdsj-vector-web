import { useState } from 'react';
import { QaPair, QaDataset } from '../../utils/types';

/**
 * 问答对管理Hook
 * 
 * 管理问答对的CRUD操作和对话框状态
 * 
 * @param dataset 当前数据集
 * @param onUpdateDataset 数据集更新回调
 * @returns {object} 包含问答对操作方法和对话框状态的对象
 */
export const useQaPairs = (
  dataset: QaDataset | null,
  onUpdateDataset: (datasetId: string, updates: Partial<QaDataset>) => void
) => {
  const [showQaPairDialog, setShowQaPairDialog] = useState(false);
  const [editingQaPair, setEditingQaPair] = useState<QaPair | undefined>(undefined);

  // 打开创建问答对对话框
  const createQaPair = () => {
    setEditingQaPair(undefined);
    setShowQaPairDialog(true);
  };

  // 打开编辑问答对对话框
  const editQaPair = (pair: QaPair) => {
    setEditingQaPair(pair);
    setShowQaPairDialog(true);
  };

  // 关闭问答对对话框
  const closeQaPairDialog = () => {
    setShowQaPairDialog(false);
    setEditingQaPair(undefined);
  };

  // 保存问答对
  const saveQaPair = (qaPair: Partial<QaPair>) => {
    if (!dataset) return;

    // 确保qaPairs存在，如果不存在则创建空数组
    let updatedQaPairs = [...(dataset.qaPairs || [])];
    
    if (editingQaPair) {
      // 更新已有问答对
      updatedQaPairs = updatedQaPairs.map(pair => 
        pair.id === editingQaPair.id ? { ...pair, ...qaPair, updatedAt: new Date() } : pair
      );
    } else {
      // 创建新问答对
      const newPair: QaPair = {
        id: `qa_${Date.now()}`,
        question: qaPair.question || '',
        answer: qaPair.answer || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updatedQaPairs = [newPair, ...updatedQaPairs];
    }

    // 更新数据集
    onUpdateDataset(dataset.id, { 
      qaPairs: updatedQaPairs,
      questionCount: updatedQaPairs.length
    });

    // 关闭对话框
    closeQaPairDialog();
  };

  // 删除问答对
  const deleteQaPair = (pairId: string) => {
    if (!dataset || !dataset.qaPairs) return;
    
    const updatedQaPairs = dataset.qaPairs.filter(pair => pair.id !== pairId);
    
    // 更新数据集
    onUpdateDataset(dataset.id, { 
      qaPairs: updatedQaPairs,
      questionCount: updatedQaPairs.length
    });
  };

  return {
    showQaPairDialog,
    editingQaPair,
    createQaPair,
    editQaPair,
    closeQaPairDialog,
    saveQaPair,
    deleteQaPair
  };
};
