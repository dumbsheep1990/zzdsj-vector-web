import React from 'react';
import Skeleton from './Skeleton';
import './SkeletonStyles.css';

interface StatCardSkeletonProps {
  /**
   * 卡片高度
   */
  height?: number | string;
  /**
   * 卡片宽度
   */
  width?: number | string;
  /**
   * 是否显示子卡片（比如多个指标时）
   */
  hasSubCards?: boolean;
  /**
   * 子卡片数量
   */
  subCardCount?: number;
  /**
   * 子卡片方向
   */
  subCardDirection?: 'row' | 'column';
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

const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({
  height,
  width = '100%',
  hasSubCards = true,
  subCardCount = 2,
  subCardDirection = 'row',
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
      {/* 卡片标题区域 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Skeleton
          variant="circle"
          width={36}
          height={36}
          animation="pulse"
          brandColor={brandColor}
          style={{ marginRight: '12px' }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          animation="pulse"
          brandColor={brandColor}
        />
      </div>

      {/* 子卡片区域 */}
      {hasSubCards && (
        <div
          style={{
            display: 'flex',
            flexDirection: subCardDirection === 'row' ? 'row' : 'column',
            gap: '16px',
            marginTop: '12px',
          }}
        >
          {Array(subCardCount)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`
                  ${glass ? 'skeleton-glass' : ''}
                  skeleton-gradient-border
                `}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  flex: subCardDirection === 'row' ? '1' : 'none',
                }}
              >
                <Skeleton
                  variant="text"
                  width="40%"
                  height={14}
                  animation="pulse"
                  brandColor={brandColor}
                  style={{ marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton
                    variant="circle"
                    width={20}
                    height={20}
                    animation="pulse"
                    brandColor={brandColor}
                    style={{ marginRight: '8px' }}
                  />
                  <Skeleton
                    variant="text"
                    width="30%"
                    height={24}
                    animation="pulse"
                    brandColor={brandColor}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default StatCardSkeleton;
