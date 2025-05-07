import React from 'react';
import Skeleton from './Skeleton';
import TextSkeleton from './TextSkeleton';
import './SkeletonStyles.css';

interface CardSkeletonProps {
  /**
   * 卡片高度
   */
  height?: number | string;
  /**
   * 卡片宽度
   */
  width?: number | string;
  /**
   * 是否显示卡片图标
   */
  hasIcon?: boolean;
  /**
   * 图标位置
   */
  iconPosition?: 'top' | 'left';
  /**
   * 是否显示头部标题
   */
  hasHeader?: boolean;
  /**
   * 是否显示内容
   */
  hasContent?: boolean;
  /**
   * 内容行数
   */
  contentLines?: number;
  /**
   * 是否显示底部按钮或操作区域
   */
  hasFooter?: boolean;
  /**
   * 是否使用磨砂玻璃效果
   */
  glass?: boolean;
  /**
   * 是否使用渐变边框
   */
  gradientBorder?: boolean;
  /**
   * 是否使用品牌色调
   */
  brandColor?: boolean;
  /**
   * 是否添加阴影效果
   */
  withShadow?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  height,
  width = '100%',
  hasIcon = true,
  iconPosition = 'left',
  hasHeader = true,
  hasContent = true,
  contentLines = 2,
  hasFooter = false,
  glass = true,
  gradientBorder = true,
  brandColor = true,
  withShadow = true,
  className = '',
  style = {},
}) => {
  const cardStyle: React.CSSProperties = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
    width: typeof width === 'number' ? `${width}px` : width,
    ...style
  };

  const iconSize = 42;
  const headerHeight = 24;
  const footerHeight = 40;

  return (
    <div
      className={`
        ${glass ? 'skeleton-glass' : ''}
        ${gradientBorder ? 'skeleton-gradient-border' : ''}
        ${withShadow ? 'skeleton-with-shadow' : ''}
        ${className}
      `}
      style={cardStyle}
    >
      {hasHeader && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          {hasIcon && iconPosition === 'left' && (
            <Skeleton
              variant="circle"
              width={iconSize}
              height={iconSize}
              animation="pulse"
              brandColor={brandColor}
              style={{ marginRight: '12px' }}
            />
          )}
          <Skeleton
            variant="text"
            width="60%"
            height={headerHeight}
            animation="pulse"
            brandColor={brandColor}
          />
        </div>
      )}

      {hasIcon && iconPosition === 'top' && (
        <Skeleton
          variant="circle"
          width={iconSize}
          height={iconSize}
          animation="pulse"
          brandColor={brandColor}
          style={{ marginBottom: '16px', alignSelf: 'center' }}
        />
      )}

      {hasContent && (
        <div style={{ flex: 1 }}>
          <TextSkeleton
            lines={contentLines}
            lastLineWidth={75}
            spacing={10}
            brandColor={brandColor}
          />
        </div>
      )}

      {hasFooter && (
        <div style={{ marginTop: '16px' }}>
          <Skeleton
            variant="rounded"
            width="40%"
            height={footerHeight}
            animation="pulse"
            brandColor={brandColor}
          />
        </div>
      )}
    </div>
  );
};

export default CardSkeleton;
