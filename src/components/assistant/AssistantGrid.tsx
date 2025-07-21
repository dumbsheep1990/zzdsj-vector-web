import React from 'react';
import { List, Empty, Spin } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantGridProps } from '../../types/assistant';
import AssistantCard from './AssistantCard';
import AssistantGridSkeleton from './AssistantGridSkeleton';
import { getCategoryConfig } from '../../constants/assistantCategories';

const AssistantGrid: React.FC<AssistantGridProps> = ({
  assistants,
  category,
  loading,
  onAssistantSelect
}) => {
  const categoryConfig = getCategoryConfig(category);

  // Animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  if (loading) {
    return <AssistantGridSkeleton count={8} />;
  }

  if (assistants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>
                {categoryConfig?.emptyStateMessage || '暂无助手'}
              </div>
              <div style={{ fontSize: '14px', color: '#999' }}>
                {categoryConfig?.description}
              </div>
            </div>
          }
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
        role="grid"
        aria-label={`${categoryConfig?.name || ''}助手列表`}
      >
        {assistants.map((assistant, index) => (
          <AnimatePresence key={assistant.id} mode="wait">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="h-full"
              role="gridcell"
            >
              <AssistantCard
                assistant={assistant}
                category={category}
                onSelect={onAssistantSelect}
                showCategoryBadge={false} // Don't show badge when filtering by category
              />
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
};

export default AssistantGrid;