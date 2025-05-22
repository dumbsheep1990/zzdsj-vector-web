import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../../components/layout/PageHeader';

// 导入外部CSS样式
import './CustomPageHeader.css';

// 定义ActionButton接口
interface ActionButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface CustomPageHeaderProps {
  title: string;
  parentTitle?: string;
  description?: string;
  primaryActions?: ActionButton[];
  secondaryActions?: ActionButton[];
  filterComponent?: React.ReactNode;
  searchComponent?: React.ReactNode;
  username?: string;
}

// 创建一个自定义PageHeader组件
const CustomPageHeader: React.FC<CustomPageHeaderProps> = (props) => {
  return (
    <Box className="custom-page-header-container" sx={{ 
      backgroundColor: '#f3f4f6',
      '.bg-white': {
        backgroundColor: '#f3f4f6 !important',
        borderBottom: 'none !important'
      }
     }}>
      <PageHeader {...props} />
    </Box>
  );
};

export default CustomPageHeader;
