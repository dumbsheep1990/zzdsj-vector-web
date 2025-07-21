import React from 'react';
import { motion } from 'framer-motion';
import AssistantCardSkeleton from './AssistantCardSkeleton';

interface AssistantGridSkeletonProps {
  count?: number;
  className?: string;
}

const AssistantGridSkeleton: React.FC<AssistantGridSkeletonProps> = ({ 
  count = 8, 
  className 
}) => {
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
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`w-full ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="h-full"
          >
            <AssistantCardSkeleton />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AssistantGridSkeleton;