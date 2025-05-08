import { useState } from 'react';

interface Settings {
  model: string;
  temperature: number;
  maxTokens: number;
  historyRounds: number;
  autoScroll: boolean;
}

const defaultSettings: Settings = {
  model: 'deepseek-coder',
  temperature: 0.7,
  maxTokens: 2048,
  historyRounds: 3,
  autoScroll: true,
};

/**
 * 聊天设置管理Hook
 * 
 * 管理聊天设置状态和设置对话框
 * 
 * @param initialSettings 初始设置
 * @returns {object} 包含设置状态和对话框控制方法的对象
 */
export const useChatSettings = (initialSettings: Partial<Settings> = {}) => {
  const [settings, setSettings] = useState<Settings>({
    ...defaultSettings,
    ...initialSettings
  });
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);

  // 更新设置
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 重置设置
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // 打开设置对话框
  const openSettings = () => {
    setSettingsVisible(true);
  };

  // 关闭设置对话框
  const closeSettings = () => {
    setSettingsVisible(false);
  };

  // 修改单个设置项
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    settings,
    settingsVisible,
    updateSettings,
    resetSettings,
    openSettings,
    closeSettings,
    updateSetting
  };
};
