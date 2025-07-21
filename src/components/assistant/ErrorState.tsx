import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { ErrorState as ErrorStateType } from '../../types/assistant';

interface ErrorStateProps {
  error: ErrorStateType;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className
}) => {
  const getErrorIcon = (errorType: ErrorStateType['type']) => {
    switch (errorType) {
      case 'network':
        return (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'empty':
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
      case 'invalid_category':
        return (
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return <ExclamationCircleOutlined className="text-4xl text-red-500" />;
    }
  };

  const getErrorTitle = (errorType: ErrorStateType['type']) => {
    switch (errorType) {
      case 'network':
        return '网络连接失败';
      case 'empty':
        return '暂无数据';
      case 'invalid_category':
        return '分类无效';
      default:
        return '出现错误';
    }
  };

  const getErrorDescription = (errorType: ErrorStateType['type']) => {
    switch (errorType) {
      case 'network':
        return '请检查网络连接后重试';
      case 'empty':
        return '当前分类下暂无助手数据';
      case 'invalid_category':
        return '请选择有效的助手分类';
      default:
        return '请稍后重试或联系技术支持';
    }
  };

  const getButtonColor = (errorType: ErrorStateType['type']) => {
    switch (errorType) {
      case 'network':
        return 'danger';
      case 'invalid_category':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          {getErrorIcon(error.type)}
        </motion.div>

        {/* Error Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getErrorTitle(error.type)}
          </h3>
          <p className="text-gray-600 mb-2">
            {error.message}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {getErrorDescription(error.type)}
          </p>
        </motion.div>

        {/* Retry Button */}
        {(error.retryAction || onRetry) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={error.retryAction || onRetry}
              className="rounded-lg h-10 px-6"
              danger={getButtonColor(error.type) === 'danger'}
            >
              重试
            </Button>
          </motion.div>
        )}

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-100"
        >
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
              <span className="text-xs">💡</span>
            </div>
            <div className="text-left">
              <span className="font-medium text-gray-700">提示：</span>
              <span className="ml-1">
                {error.type === 'network' && '如果问题持续存在，请检查网络设置或联系管理员'}
                {error.type === 'empty' && '您可以尝试创建新的助手或切换到其他分类'}
                {error.type === 'invalid_category' && '请从左侧导航选择有效的助手分类'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ErrorState;