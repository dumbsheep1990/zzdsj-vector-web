'use client'
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GradientCardProps {
  title: string;
  description: string;
  detailedDescription: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: string[];
  useCases: string[];
  isSelected?: boolean;
  onSelect?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  title,
  description,
  detailedDescription,
  icon,
  color,
  gradient,
  features,
  useCases,
  isSelected = false,
  onSelect,
  onMouseEnter,
  onMouseLeave
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  // 简化3D效果，移除实时计算
  // const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // 移除复杂的鼠标移动跟踪，改为简单的hover效果
  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (cardRef.current) {
  //     const rect = cardRef.current.getBoundingClientRect();
  //     const x = e.clientX - rect.left - rect.width / 2;
  //     const y = e.clientY - rect.top - rect.height / 2;

  //     const rotateX = -(y / rect.height) * 3; // Reduced for subtlety
  //     const rotateY = (x / rect.width) * 3;

  //     setRotation({ x: rotateX, y: rotateY });
  //   }
  // };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // setRotation({ x: 0, y: 0 }); // 移除rotation重置
    onMouseLeave?.();
  };

  const handleClick = () => {
    onSelect?.();
  };

  // Convert hex color to rgb for gradients
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 }; // fallback color
  };

  const rgb = hexToRgb(color);
  const primaryColor = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-[24px] overflow-hidden cursor-pointer"
      style={{
        width: "100%",
        height: "580px",
        backgroundColor: `rgba(${primaryColor}, 0.02)`, // 使用主色的极浅背景
        // 简化样式，移除3D效果
        // transformStyle: "preserve-3d",
        zIndex: isHovered ? 10 : 1, // hover时提升z-index避免被遮挡
      }}
      initial={{ y: 0 }}
      animate={{
        y: isHovered ? -6 : 0, // 减少移动距离
        // rotateX: rotation.x, // 移除3D旋转
        // rotateY: rotation.y,
        // perspective: 1000,
        boxShadow: isSelected 
          ? `0 16px 48px rgba(${primaryColor}, 0.3), 0 0 16px rgba(${primaryColor}, 0.2)`
          : isHovered 
            ? `0 20px 60px rgba(${primaryColor}, 0.25), 0 0 12px rgba(${primaryColor}, 0.15)`
            : `0 12px 36px rgba(${primaryColor}, 0.15), 0 0 8px rgba(${primaryColor}, 0.08)`,
      }}
      transition={{
        type: "spring",
        stiffness: 400, // 提高弹性，更快响应
        damping: 25
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // onMouseMove={handleMouseMove} // 移除鼠标移动事件
      onClick={handleClick}
    >
      {/* Glass reflection overlay */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.2) 100%)",
          backdropFilter: "blur(1px)",
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Light gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(${primaryColor}, 0.15) 100%)`,
        }}
      />

      {/* Selected border effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 z-5"
          style={{
            background: `linear-gradient(45deg, rgba(${primaryColor}, 0.3), rgba(${primaryColor}, 0.1), rgba(${primaryColor}, 0.3))`,
            borderRadius: "24px",
            padding: "2px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* 底部主色渐变 - 增强主色调 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
        style={{
          background: `radial-gradient(ellipse at bottom center, rgba(${primaryColor}, 0.4) -10%, transparent 70%)`,
          filter: "blur(25px)", // 适度模糊，保持柔和效果
        }}
        animate={{
          opacity: isHovered ? 0.9 : 0.7,
        }}
        transition={{ duration: 0.3 }} // 加快动画速度
      />

      {/* Bottom border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-25"
        style={{
          background: `linear-gradient(90deg, rgba(${primaryColor}, 0.1) 0%, rgba(${primaryColor}, 0.6) 50%, rgba(${primaryColor}, 0.1) 100%)`,
        }}
        animate={{
          boxShadow: isHovered
            ? `0 0 20px 4px rgba(${primaryColor}, 0.5), 0 0 30px 6px rgba(${primaryColor}, 0.3)`
            : `0 0 15px 3px rgba(${primaryColor}, 0.4), 0 0 25px 5px rgba(${primaryColor}, 0.2)`,
          opacity: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Card content */}
      <motion.div
        className="relative flex flex-col h-full p-6 z-40"
        animate={{ z: 2 }}
      >
        {/* Icon container */}
        <motion.div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(225deg, rgba(${primaryColor}, 0.15) 0%, rgba(${primaryColor}, 0.08) 100%)`,
            border: `1px solid rgba(${primaryColor}, 0.25)`,
          }}
          animate={{
            boxShadow: isHovered
              ? `0 8px 16px -2px rgba(${primaryColor}, 0.2), inset 2px 2px 5px rgba(255, 255, 255, 0.3)`
              : `0 6px 12px -2px rgba(${primaryColor}, 0.15), inset 1px 1px 3px rgba(255, 255, 255, 0.2)`,
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ color: color, fontSize: '24px' }}>
            {icon}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex-1 flex flex-col"
          animate={{
            // rotateX: isHovered ? -rotation.x * 0.3 : 0, // 移除3D旋转效果
            // rotateY: isHovered ? -rotation.y * 0.3 : 0
            scale: isHovered ? 1.02 : 1, // 简化为缩放效果
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Title */}
          <motion.h3
            className="text-xl font-semibold mb-2"
            style={{
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              color: '#1f2937', // 深灰色标题
            }}
            animate={{
              textShadow: isHovered ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {title}
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            className="text-sm mb-4"
            style={{ 
              lineHeight: 1.4,
              color: '#4b5563' // 中等灰色副标题
            }}
          >
            {description}
          </motion.p>

          {/* Detailed description */}
          <motion.p
            className="text-xs mb-4 flex-1"
            style={{ 
              lineHeight: 1.5,
              color: '#6b7280' // 浅灰色描述文字
            }}
          >
            {detailedDescription}
          </motion.p>

          {/* Features */}
          <div className="mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: '#374151' }}>核心能力</p>
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs rounded-md"
                  style={{
                    background: `rgba(${primaryColor}, 0.12)`,
                    color: color,
                    border: `1px solid rgba(${primaryColor}, 0.2)`,
                    fontWeight: '500'
                  }}
                >
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span
                  className="inline-block px-2 py-1 text-xs rounded-md"
                  style={{
                    background: `rgba(${primaryColor}, 0.12)`,
                    color: color,
                    border: `1px solid rgba(${primaryColor}, 0.2)`,
                    fontWeight: '500'
                  }}
                >
                  +{features.length - 3}项
                </span>
              )}
            </div>
          </div>

          {/* Use cases */}
          <div className="mb-6">
            <p className="text-xs font-medium mb-2" style={{ color: '#374151' }}>适用场景</p>
            <ul className="text-xs space-y-1" style={{ color: '#6b7280' }}>
              {useCases.slice(0, 3).map((useCase, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 rounded-full mr-2" style={{ background: color }}></span>
                  {useCase}
                </li>
              ))}
            </ul>
          </div>

          {/* Action button */}
          <motion.button
            className="w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300"
            style={{
              background: isSelected 
                ? `linear-gradient(135deg, ${color} 0%, rgba(${primaryColor}, 0.8) 100%)`
                : `linear-gradient(135deg, rgba(${primaryColor}, 0.15) 0%, rgba(${primaryColor}, 0.08) 100%)`,
              border: `1px solid rgba(${primaryColor}, ${isSelected ? 0.6 : 0.25})`,
              color: isSelected ? 'white' : color,
              fontWeight: '600'
            }}
            whileHover={{
              background: `linear-gradient(135deg, ${color} 0%, rgba(${primaryColor}, 0.8) 100%)`,
              color: 'white',
              y: -1,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {isSelected ? '✓ 已选择此模板' : '选择此模板'}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 