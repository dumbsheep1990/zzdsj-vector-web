import React from 'react';
import Skeleton from './Skeleton';
import './SkeletonStyles.css';

interface TextSkeletonProps {
  /**
   * 行数
   */
  lines?: number;
  /**
   * 最后一行的宽度（百分比）
   */
  lastLineWidth?: number;
  /**
   * 行间距
   */
  spacing?: number;
  /**
   * 是否使用磨砂玻璃效果
   */
  glass?: boolean;
  /**
   * 是否使用品牌色调
   */
  brandColor?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  lastLineWidth = 70,
  spacing = 8,
  glass = false,
  brandColor = false,
  className = '',
  style = {},
}) => {
  return (
    <div className={className} style={style}>
      {Array(lines)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            animation="pulse"
            glass={glass}
            brandColor={brandColor}
            width={index === lines - 1 ? `${lastLineWidth}%` : '100%'}
            height={16}
            style={{ marginBottom: index === lines - 1 ? 0 : spacing }}
          />
        ))}
    </div>
  );
};

export default TextSkeleton;
