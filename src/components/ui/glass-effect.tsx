import React from 'react';
import { cn } from '../../lib/utils';

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = '',
  variant = 'default',
  blur = 'md'
}) => {
  const variants = {
    default: 'bg-white/70 border-white/30',
    strong: 'bg-white/85 border-white/40', 
    subtle: 'bg-white/50 border-white/20'
  };

  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md', 
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <div
      className={cn(
        // Base glass effect
        'relative overflow-hidden',
        variants[variant],
        blurValues[blur],
        // Glass distortion effects
        'border border-solid',
        'shadow-lg shadow-black/10',
        // Glass reflection
        'before:absolute before:inset-0',
        'before:bg-gradient-to-br before:from-white/20 before:to-transparent',
        'before:pointer-events-none',
        // Inner glow
        'after:absolute after:inset-0',
        'after:bg-gradient-to-tr after:from-transparent after:via-white/5 after:to-white/10',
        'after:pointer-events-none',
        className
      )}
      style={{
        // Enhanced backdrop filter for better glass effect
        backdropFilter: 'blur(20px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
      }}
    >
      {/* Content layer - ensure it's above pseudo elements */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Specialized component for navigation bars
interface GlassNavBarProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
}

const GlassNavBar: React.FC<GlassNavBarProps> = ({
  children,
  className = '',
  position = 'bottom'
}) => {
  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        // 白色磨砂半透明背景
        'bg-white/90',
        // 强烈的模糊效果
        'backdrop-blur-2xl',
        // 边框和阴影
        'border-t border-white/60',
        'shadow-lg shadow-black/5',
        // 移除圆角，使用矩形
        className
      )}
      style={{
        // 增强的backdrop filter
        backdropFilter: 'blur(24px) saturate(180%) brightness(130%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(130%)',
        // 更白的半透明背景
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      {/* 内部高光效果 - 纯白色调 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.4) 100%)',
        }}
      />
      
      {/* 内容层 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { GlassEffect, GlassNavBar }; 