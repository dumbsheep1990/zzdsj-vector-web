import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { AssistantCategory } from '../../types/assistant';
import { getCategoryConfig } from '../../constants/assistantCategories';

interface EmptyStateProps {
  category: AssistantCategory;
  onCreateAssistant?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  category,
  onCreateAssistant,
  className
}) => {
  const categoryConfig = getCategoryConfig(category);
  const CategoryIcon = categoryConfig?.icon;

  const getCategoryColor = (category: AssistantCategory) => {
    switch (category) {
      case AssistantCategory.BASIC_CHAT:
        return '#1890ff';
      case AssistantCategory.KNOWLEDGE_QA:
        return '#52c41a';
      case AssistantCategory.AUTONOMOUS_PLANNING:
        return '#faad14';
      default:
        return '#8c8c8c';
    }
  };

  const categoryColor = getCategoryColor(category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`${className} flex flex-col items-center justify-center min-h-[500px] px-8 py-12`}
    >
      {/* Category Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}15, ${categoryColor}05)`,
          border: `2px solid ${categoryColor}20`,
        }}
      >
        {CategoryIcon && (
          <CategoryIcon 
            className="w-10 h-10"
            style={{ color: categoryColor }} 
          />
        )}
      </motion.div>

      {/* Empty State Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-center max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {categoryConfig?.emptyStateMessage || '暂无助手'}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-8">
          {categoryConfig?.description}
        </p>
      </motion.div>

      {/* Create Button */}
      {onCreateAssistant && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={onCreateAssistant}
            className="h-12 px-8 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
              borderColor: categoryColor,
              boxShadow: `0 4px 12px ${categoryColor}30`
            }}
          >
            创建{categoryConfig?.name}助手
          </Button>
        </motion.div>
      )}

      {/* Additional Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mt-8 p-6 rounded-2xl max-w-lg bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm"
      >
        <div className="flex items-start space-x-3 text-sm text-gray-700">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
            <span className="text-xs">💡</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">提示：</span>
            <span className="ml-1">
              {category === AssistantCategory.BASIC_CHAT && '基础对话助手适合日常交流和简单问答场景'}
              {category === AssistantCategory.KNOWLEDGE_QA && '知识库问答助手需要先创建和配置相关知识库'}
              {category === AssistantCategory.AUTONOMOUS_PLANNING && '自主规划智能体具备复杂任务处理和工具调用能力'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;