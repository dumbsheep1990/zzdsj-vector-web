// 扩展工具配置接口
export interface ExtensionToolsConfig {
  voiceSupport: {
    enabled: boolean;
    speechToText: boolean;
    textToSpeech: boolean;
  };
  multimodal: {
    enabled: boolean;
    imageAnalysis: boolean;
    videoProcessing: boolean;
    chartGeneration: boolean;
  };
  fileAnalysis: {
    enabled: boolean;
    realtimeProcessing: boolean;
    batchProcessing: boolean;
    formatSupport: string[];
    intelligentExtraction: boolean;
  };
  smartSearch: {
    enabled: boolean;
    webSearch: boolean;
    knowledgeBase: boolean;
    apiIntegration: boolean;
    databaseQuery: boolean;
  };
  workflowAutomation: {
    enabled: boolean;
    taskScheduling: boolean;
    triggerSettings: boolean;
    processOrchestration: boolean;
    batchOperations: boolean;
  };
  dataAnalytics: {
    enabled: boolean;
    dataMining: boolean;
    statisticalAnalysis: boolean;
    reportGeneration: boolean;
    predictiveAnalytics: boolean;
  };
}

// 默认配置
export const defaultExtensionConfig: ExtensionToolsConfig = {
  voiceSupport: {
    enabled: false,
    speechToText: true,
    textToSpeech: true,
  },
  multimodal: {
    enabled: false,
    imageAnalysis: true,
    videoProcessing: false,
    chartGeneration: true,
  },
  fileAnalysis: {
    enabled: false,
    realtimeProcessing: true,
    batchProcessing: true,
    formatSupport: ['PDF', 'DOCX', 'XLSX', 'TXT'],
    intelligentExtraction: true,
  },
  smartSearch: {
    enabled: false,
    webSearch: true,
    knowledgeBase: true,
    apiIntegration: false,
    databaseQuery: false,
  },
  workflowAutomation: {
    enabled: false,
    taskScheduling: true,
    triggerSettings: true,
    processOrchestration: false,
    batchOperations: true,
  },
  dataAnalytics: {
    enabled: false,
    dataMining: false,
    statisticalAnalysis: true,
    reportGeneration: true,
    predictiveAnalytics: false,
  }
}; 