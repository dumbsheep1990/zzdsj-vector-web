import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Button, TextField, Divider } from '@mui/material';

// 彩色卡片组件 - 磨砂玻璃效果
export const ColorCard = styled(Card)(({ theme, color = 'primary' }) => {
  const colorKey = color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  const mainColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
  
  return {
    border: '1px solid',
    borderColor: `${mainColor}40`,
    borderRadius: '16px',
    background: `rgba(${hexToRgb(mainColor)}, 0.12)`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08)`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: `0 8px 32px ${mainColor}25`,
      transform: 'translateY(-2px)',
      borderColor: `${mainColor}50`,
      background: `rgba(${hexToRgb(mainColor)}, 0.15)`,
    }
  };
});

// 辅助函数：将Hex颜色转换为RGB格式
function hexToRgb(hex: string) {
  // 处理简写格式如 #fff
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
  
  // 提取RGB值
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  if (!result) return '255, 255, 255'; // 默认白色
  
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// 彩色头像组件
export const ColorAvatar = styled(Avatar)(({ theme, color = 'primary' }) => {
  const colorKey = color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  const mainColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
  
  return {
    width: 72,
    height: 72,
    boxShadow: `0 4px 12px ${mainColor}20`,
    backgroundColor: mainColor,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: `0 6px 20px ${mainColor}30`
    }
  };
});

// 渐变按钮 - 磨砂效果
export const GradientButton = styled(Button)(({ theme, color = 'primary' }) => {
  const colorKey = color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  const mainColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
  const darkColor = theme.palette[colorKey]?.dark || theme.palette.primary.dark;
  const lightColor = theme.palette[colorKey]?.light || theme.palette.primary.light;
  
  return {
    background: `linear-gradient(45deg, ${mainColor}, ${darkColor})`,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: `1px solid rgba(255, 255, 255, 0.18)`,
    boxShadow: `0 4px 20px ${mainColor}40`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${lightColor}30, transparent 80%)`,
      opacity: 0.6,
      zIndex: 0,
    },
    '& .MuiButton-startIcon, & .MuiButton-endIcon, & .MuiButton-label': {
      position: 'relative',
      zIndex: 1,
    },
    '&:hover': {
      boxShadow: `0 8px 32px ${mainColor}60`,
      transform: 'translateY(-2px)',
      '&:before': {
        opacity: 0.8,
      }
    }
  };
});

// 带边框的文本框 - 磨砂效果
export const BorderTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.8)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '1px',
    },
    '& .MuiOutlinedInput-input': {
      position: 'relative',
      zIndex: 1,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    }
  }
}));

// 彩色分隔线
export const ColorDivider = styled(Divider)(({ theme, color = 'primary' }) => {
  const colorKey = color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  const mainColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
  
  return {
    '&::before, &::after': {
      borderColor: `${mainColor}30`
    }
  };
});

// 动画内容盒 - 磨砂效果
export const AnimatedContentBox = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  animation: 'slideDown 0.3s ease forwards',
  background: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  padding: theme.spacing(2),
  '@keyframes slideDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}));

// 智能体类型卡片 - 磨砂效果
export const TypeCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'color'
})<{ selected?: boolean; color?: string }>(({ theme, selected, color }) => ({
  cursor: 'pointer',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  border: `1px solid ${selected ? color || theme.palette.primary.main : 'rgba(255, 255, 255, 0.2)'}`,
  background: selected ? 
    `linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))` : 
    `rgba(255, 255, 255, 0.5)`,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: selected ? 
    `0 8px 32px rgba(${color ? color.replace(/[^,]+,/, '').replace(/[^0-9,]/g, '') : '0, 0, 0'}, 0.15)` : 
    '0 4px 16px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))`,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    borderColor: selected ? color || theme.palette.primary.main : 'rgba(255, 255, 255, 0.4)'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: '12px',
    background: selected ? 
      `linear-gradient(135deg, ${color || theme.palette.primary.main}20, transparent 80%)` :
      'transparent',
  }
}));
