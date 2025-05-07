import React from 'react';
import './SkeletonStyles.css';

interface SkeletonProps {
  /**
   * 骨架屏高度，可以是数字或者预设尺寸
   */
  height?: number | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * 骨架屏宽度，可以是数字、百分比或'full'
   */
  width?: number | string;
  /**
   * 边框形状
   */
  variant?: 'text' | 'rectangular' | 'rounded' | 'circle';
  /**
   * 动画类型
   */
  animation?: 'pulse' | 'fade' | 'none';
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

const Skeleton: React.FC<SkeletonProps> = ({
  height = 'md',
  width,
  variant = 'rectangular',
  animation = 'pulse',
  glass = false,
  gradientBorder = false,
  brandColor = false,
  withShadow = false,
  className = '',
  style = {},
}) => {
  // 处理高度属性
  let heightValue: string | number = '';
  if (typeof height === 'number') {
    heightValue = `${height}px`;
  } else {
    heightValue = '';
  }

  // 处理宽度属性
  let widthValue: string | number = '';
  if (typeof width === 'number') {
    widthValue = `${width}px`;
  } else if (width === 'full') {
    widthValue = '100%';
  } else {
    widthValue = width || '';
  }

  // 组合样式类
  const classes = [
    animation !== 'none' ? `skeleton-${animation}` : '',
    typeof height === 'string' ? `skeleton-${height}` : '',
    variant === 'circle' ? 'skeleton-circle' : '',
    variant === 'rounded' ? 'skeleton-rounded' : '',
    variant === 'text' ? 'skeleton-text' : '',
    glass ? 'skeleton-glass' : '',
    gradientBorder ? 'skeleton-gradient-border' : '',
    brandColor ? 'skeleton-brand-color' : '',
    withShadow ? 'skeleton-with-shadow' : '',
    className
  ].filter(Boolean).join(' ');

  // 合并样式
  const combinedStyle: React.CSSProperties = {
    ...(heightValue ? { height: heightValue } : {}),
    ...(widthValue ? { width: widthValue } : {}),
    ...style
  };

  return <div className={classes} style={combinedStyle}></div>;
};

export default Skeleton;
