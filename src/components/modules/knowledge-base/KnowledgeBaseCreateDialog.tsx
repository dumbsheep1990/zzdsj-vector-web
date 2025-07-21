import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Settings, 
  Upload, 
  CheckCircle, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Brain,
  Zap,
  FileText,
  Sparkles
} from 'lucide-react';
import { knowledgeServiceApi, KnowledgeBaseCreateRequest } from '../../../utils/api/knowledge';
import { useKnowledgeBase, KnowledgeBaseCreateParams } from '../../../hooks/knowledge/useKnowledgeBase';
import { cn } from '../../../lib/utils';

interface KnowledgeBaseCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (knowledgeBase: any) => void;
}

interface EmbeddingModel {
  provider: string;
  model: string;
  dimension: number;
  description: string;
}

const KnowledgeBaseCreateDialog: React.FC<KnowledgeBaseCreateDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [embeddingModels, setEmbeddingModels] = useState<EmbeddingModel[]>([]);
  
  // 使用知识库hook
  const { createKnowledgeBase, isCreating } = useKnowledgeBase();
  
  // 硅基流动固定模型配置
  const SILICONFLOW_CONFIG = {
    embedding_provider: 'siliconflow',
    embedding_model: 'Qwen/Qwen3-Embedding-8B',
    embedding_dimension: 8192,
    vector_store_type: 'milvus',
    chunk_size: 1024,
    chunk_overlap: 128,
    similarity_threshold: 0.7,
    llm_model: 'Qwen/Qwen3-32B',
    rerank_model: 'Qwen/Qwen3-Reranker-8B'
  };

  const [formData, setFormData] = useState<KnowledgeBaseCreateRequest>({
    name: '',
    description: '',
    embedding_provider: SILICONFLOW_CONFIG.embedding_provider,
    embedding_model: SILICONFLOW_CONFIG.embedding_model,
    embedding_dimension: SILICONFLOW_CONFIG.embedding_dimension,
    vector_store_type: SILICONFLOW_CONFIG.vector_store_type,
    chunk_size: SILICONFLOW_CONFIG.chunk_size,
    chunk_overlap: SILICONFLOW_CONFIG.chunk_overlap,
    similarity_threshold: SILICONFLOW_CONFIG.similarity_threshold,
    enable_hybrid_search: false,
    enable_agno_integration: false,
    agno_search_type: 'vector',
    settings: {}
  });

  const steps = ['基本信息', '模型配置', '高级设置', '确认创建'];

  // 硅基流动固定模型列表
  const siliconFlowModels = [
    {
      provider: 'siliconflow',
      model: 'Qwen/Qwen3-Embedding-8B',
      dimension: 8192,
      description: '通用嵌入模型，支持中文文档理解'
    }
  ];

  useEffect(() => {
    if (open) {
      setEmbeddingModels(siliconFlowModels);
    }
  }, [open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    
    try {
      // 将表单数据转换为KnowledgeBaseCreateParams格式
      const createParams: KnowledgeBaseCreateParams = {
        name: formData.name,
        description: formData.description,
        embedding_provider: formData.embedding_provider,
        embedding_model: formData.embedding_model,
        embedding_dimension: formData.embedding_dimension,
        vector_store_type: formData.vector_store_type,
        chunk_size: formData.chunk_size,
        chunk_overlap: formData.chunk_overlap,
        similarity_threshold: formData.similarity_threshold,
        enable_hybrid_search: formData.enable_hybrid_search,
        enable_agno_integration: formData.enable_agno_integration,
        agno_search_type: formData.agno_search_type,
        settings: formData.settings
      };
      
      console.log('创建知识库参数:', createParams);
      
      const result = await createKnowledgeBase(createParams);
      
      console.log('创建知识库结果:', result);
      
      if (result) {
        onSuccess(result);
        onClose();
        // 重置表单
        setFormData({
          name: '',
          description: '',
          embedding_provider: SILICONFLOW_CONFIG.embedding_provider,
          embedding_model: SILICONFLOW_CONFIG.embedding_model,
          embedding_dimension: SILICONFLOW_CONFIG.embedding_dimension,
          vector_store_type: SILICONFLOW_CONFIG.vector_store_type,
          chunk_size: SILICONFLOW_CONFIG.chunk_size,
          chunk_overlap: SILICONFLOW_CONFIG.chunk_overlap,
          similarity_threshold: SILICONFLOW_CONFIG.similarity_threshold,
          enable_hybrid_search: false,
          enable_agno_integration: false,
          agno_search_type: 'vector',
          settings: {}
        });
        setActiveStep(0);
      }
    } catch (error: any) {
      console.error('创建知识库失败:', error);
      setError(error.message || '创建知识库失败');
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      onClose();
      setActiveStep(0);
      setError(null);
      // 重置表单数据
      setFormData({
        name: '',
        description: '',
        embedding_provider: SILICONFLOW_CONFIG.embedding_provider,
        embedding_model: SILICONFLOW_CONFIG.embedding_model,
        embedding_dimension: SILICONFLOW_CONFIG.embedding_dimension,
        vector_store_type: SILICONFLOW_CONFIG.vector_store_type,
        chunk_size: SILICONFLOW_CONFIG.chunk_size,
        chunk_overlap: SILICONFLOW_CONFIG.chunk_overlap,
        similarity_threshold: SILICONFLOW_CONFIG.similarity_threshold,
        enable_hybrid_search: false,
        enable_agno_integration: false,
        agno_search_type: 'vector',
        settings: {}
      });
      // 重置模型列表
      setEmbeddingModels([]);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.name.trim() && formData.description.trim();
      case 1:
        return formData.embedding_provider && formData.embedding_model;
      case 2:
        return true; // 高级设置都是可选的
      case 3:
        return true;
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(activeStep);

  const renderBasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            知识库名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="请输入知识库名称"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述信息 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="请描述知识库的用途和特点..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50/50 hover:bg-white"
          />
        </div>
      </div>
      
      <motion.div 
        className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">智能知识管理</h4>
            <p className="text-sm text-gray-600">
              知识库将用于存储和检索文档内容，支持向量搜索、关键词搜索和混合检索，为您的AI应用提供强大的知识支撑。
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderModelConfig = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 固定提供商信息 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            模型提供商
          </label>
          <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 shadow-lg flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="font-medium text-blue-700">硅基流动</span>
              <p className="text-sm text-blue-600">企业级AI模型服务平台</p>
            </div>
          </div>
        </div>

        {/* 固定嵌入模型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            嵌入模型
          </label>
          <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium mb-1 text-blue-700">
                  {SILICONFLOW_CONFIG.embedding_model}
                </h4>
                <p className="text-sm text-blue-600">通用嵌入模型，支持中文文档理解</p>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {SILICONFLOW_CONFIG.embedding_dimension}维
              </div>
            </div>
          </div>
        </div>

        {/* 固定向量存储 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            向量存储类型
          </label>
          <div className="p-4 rounded-xl border-2 border-purple-500 bg-purple-50 shadow-lg text-center">
            <h4 className="font-medium mb-1 text-purple-700">Milvus</h4>
            <p className="text-xs text-purple-600">高性能向量数据库</p>
          </div>
        </div>
      </div>

      {/* Configuration Summary */}
      <motion.div 
        className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Settings className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800 mb-2">配置概要</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">维度：</span>
                <span className="font-medium text-gray-800 ml-1">{SILICONFLOW_CONFIG.embedding_dimension}</span>
              </div>
              <div>
                <span className="text-gray-500">提供商：</span>
                <span className="font-medium text-gray-800 ml-1">硅基流动</span>
              </div>
              <div>
                <span className="text-gray-500">模型：</span>
                <span className="font-medium text-gray-800 ml-1">{SILICONFLOW_CONFIG.embedding_model}</span>
              </div>
              <div>
                <span className="text-gray-500">存储：</span>
                <span className="font-medium text-gray-800 ml-1">Milvus</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderAdvancedSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2"
    >
      {/* 配置说明 */}
      <motion.div 
        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-6"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">硅基流动预配置模型</h4>
            <p className="text-sm text-blue-600">
              系统已为您配置好硅基流动的最优参数，您可以根据需要微调以下设置。
            </p>
          </div>
        </div>
      </motion.div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">文档分块设置</h3>
        
        {/* 分块大小设置 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分块大小: {formData.chunk_size} 字符
          </label>
          <div className="relative">
            <input
              type="range"
              min={512}
              max={2048}
              step={128}
              value={formData.chunk_size}
              onChange={(e) => handleInputChange('chunk_size', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>512</span>
              <span>1024</span>
              <span>2048</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">推荐值: 1024 (配置文件默认)</p>
        </div>

        {/* 分块重叠设置 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分块重叠: {formData.chunk_overlap} 字符
          </label>
          <div className="relative">
            <input
              type="range"
              min={64}
              max={256}
              step={32}
              value={formData.chunk_overlap}
              onChange={(e) => handleInputChange('chunk_overlap', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>64</span>
              <span>128</span>
              <span>256</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">推荐值: 128 (配置文件默认)</p>
        </div>

        {/* 相似度阈值设置 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            相似度阈值: {(formData.similarity_threshold || 0.7).toFixed(2)}
          </label>
          <div className="relative">
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={formData.similarity_threshold}
              onChange={(e) => handleInputChange('similarity_threshold', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1</span>
              <span>0.7</span>
              <span>1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 检索设置 */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">检索设置</h3>
        
        {/* 混合搜索开关 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">启用混合搜索</label>
            <p className="text-xs text-gray-500 mt-1">默认关闭，推荐新用户保持关闭</p>
          </div>
          <button
            type="button"
            onClick={() => handleInputChange('enable_hybrid_search', !formData.enable_hybrid_search)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              formData.enable_hybrid_search ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                formData.enable_hybrid_search ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        {/* Agno框架集成开关 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">启用Agno框架集成</label>
            <p className="text-xs text-gray-500 mt-1">默认关闭，需要时再启用</p>
          </div>
          <button
            type="button"
            onClick={() => handleInputChange('enable_agno_integration', !formData.enable_agno_integration)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              formData.enable_agno_integration ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                formData.enable_agno_integration ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {/* Agno搜索类型选择 */}
        {formData.enable_agno_integration && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agno搜索类型
            </label>
            <select
              value={formData.agno_search_type}
              onChange={(e) => handleInputChange('agno_search_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="vector">向量搜索</option>
              <option value="keyword">关键词搜索</option>
              <option value="hybrid">混合搜索</option>
            </select>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2"
    >
      {/* Info Alert */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
        <div className="p-1 bg-blue-100 rounded-full">
          <CheckCircle className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-blue-800">确认配置</h4>
          <p className="text-sm text-blue-600 mt-1">
            请确认以下配置信息，创建后部分配置无法修改。
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 基本信息 */}
        <motion.div 
          className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
          whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">基本信息</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-20">名称：</span>
              <span className="text-gray-800">{formData.name}</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-gray-600 w-20 flex-shrink-0">描述：</span>
              <span className="text-gray-800 break-words">{formData.description}</span>
            </div>
          </div>
        </motion.div>

        {/* 模型配置 */}
        <motion.div 
          className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
          whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">模型配置</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="font-medium text-gray-600">提供商：</span>
              <span className="text-gray-800 ml-2">{formData.embedding_provider}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">维度：</span>
              <span className="text-gray-800 ml-2">{formData.embedding_dimension}</span>
            </div>
            <div className="flex items-center col-span-2">
              <span className="font-medium text-gray-600">模型：</span>
              <span className="text-gray-800 ml-2 break-all">{formData.embedding_model}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">向量存储：</span>
              <span className="text-gray-800 ml-2">{formData.vector_store_type}</span>
            </div>
          </div>
        </motion.div>

        {/* 高级配置 */}
        <motion.div 
          className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
          whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">高级配置</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="font-medium text-gray-600">分块大小：</span>
              <span className="text-gray-800 ml-2">{formData.chunk_size} 字符</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">分块重叠：</span>
              <span className="text-gray-800 ml-2">{formData.chunk_overlap} 字符</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">相似度阈值：</span>
              <span className="text-gray-800 ml-2">{(formData.similarity_threshold || 0.7).toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">混合搜索：</span>
              <span className={cn(
                "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                formData.enable_hybrid_search 
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              )}>
                {formData.enable_hybrid_search ? '启用' : '禁用'}
              </span>
            </div>
            <div className="flex items-center col-span-2">
              <span className="font-medium text-gray-600">Agno集成：</span>
              <span className={cn(
                "ml-2 px-2 py-1 rounded-full text-xs font-medium",
                formData.enable_agno_integration 
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              )}>
                {formData.enable_agno_integration ? `启用 (${formData.agno_search_type})` : '禁用'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderModelConfig();
      case 2:
        return renderAdvancedSettings();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-8 py-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              disabled={isCreating}
              className="absolute right-6 top-6 p-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl backdrop-blur-sm border shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
                <Database className="w-8 h-8" style={{ color: '#4338ca' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">创建智能知识库</h2>
                <p className="text-gray-600">构建您的专属知识管理系统</p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                        index < activeStep
                          ? "bg-indigo-600 text-white shadow-lg"
                          : index === activeStep
                            ? "bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-200/50"
                            : "bg-gray-200 text-gray-500"
                      )}
                      animate={{
                        scale: index === activeStep ? 1.1 : 1
                      }}
                    >
                      {index < activeStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </motion.div>
                    <span className="text-xs text-gray-700 mt-2 text-center font-medium">
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 mx-4 bg-gray-200 relative overflow-hidden">
                      <motion.div
                        className="h-full bg-indigo-600"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: index < activeStep ? "100%" : "0%" 
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[calc(90vh-300px)] overflow-y-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
              >
                <div className="p-1 bg-red-100 rounded-full">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-red-800">创建失败</h4>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </motion.div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              disabled={isCreating}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
            >
              取消
            </motion.button>
            
            <div className="flex items-center space-x-3">
              {activeStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  disabled={isCreating}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>上一步</span>
                </motion.button>
              )}
              
              {activeStep < steps.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={!canProceed || isCreating}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all",
                    canProceed && !isCreating
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <span>下一步</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: isCreating ? 1 : 1.02 }}
                  whileTap={{ scale: isCreating ? 1 : 0.98 }}
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                      <span>创建中...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>创建知识库</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KnowledgeBaseCreateDialog;
