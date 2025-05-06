/**
 * 全局Z-index层级管理
 * 定义应用中所有组件的z-index值，确保层级关系正确
 */

export const zIndexLevels = {
  // 基础布局
  BASE: 1,
  SIDEBAR: 10,
  HEADER: 20,
  
  // 内容层
  CONTENT: 30,
  
  // 提示和通知
  TOOLTIP: 1000,
  NOTIFICATION: 1100,
  
  // 弹出层
  DROPDOWN: 2000,
  POPOVER: 2100,
  
  // 模态框
  MODAL_BACKDROP: 3000,
  MODAL: 3100,

  // 顶级元素
  TOAST: 4000,
  DIALOG: 4100
};

export default zIndexLevels;
