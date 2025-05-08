import { useState } from 'react';
import { QaDataset, AssistantItem } from '../../utils/types';

/**
 * 助手绑定管理Hook
 * 
 * 管理助手绑定逻辑和对话框状态
 * 
 * @param dataset 当前数据集
 * @param onUpdateDataset 数据集更新回调
 * @returns {object} 包含助手绑定操作方法和对话框状态的对象
 */
export const useAssistantLink = (
  dataset: QaDataset | null,
  onUpdateDataset: (datasetId: string, updates: Partial<QaDataset>) => void
) => {
  const [showAssistantLinkDialog, setShowAssistantLinkDialog] = useState(false);

  // 打开助手绑定对话框
  const openAssistantLinkDialog = () => {
    setShowAssistantLinkDialog(true);
  };

  // 关闭助手绑定对话框
  const closeAssistantLinkDialog = () => {
    setShowAssistantLinkDialog(false);
  };

  // 保存助手绑定
  const saveAssistantLinks = (linkedAssistants: AssistantItem[]) => {
    if (!dataset) return;

    // 更新数据集的助手绑定
    onUpdateDataset(dataset.id, { 
      linkedAssistants: linkedAssistants 
    });

    // 关闭对话框
    closeAssistantLinkDialog();
  };

  return {
    showAssistantLinkDialog,
    openAssistantLinkDialog,
    closeAssistantLinkDialog,
    saveAssistantLinks
  };
};
