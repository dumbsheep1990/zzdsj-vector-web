import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Button, TextField, Divider } from '@mui/material';

// 彩色卡片组件
export const ColorCard = styled(Card)(({ theme, color = 'primary' }) => {
  const colorKey = color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  const mainColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
  
  return {
    border: '1px solid',
    borderColor: `${mainColor}20`,
    borderRadius: '12px',
    backgroundColor: `${mainColor}05`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      backgroundColor: mainColor,
    },
    '&:hover': {
      boxShadow: `0 4px 20px ${mainColor}15`,
      transform: 'translateY(-2px)'
    }
  };
});

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

// 渐变按钮
export const GradientButton = styled(Button)(({ theme, color = 'primary' }) => {
  const colorKey = color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  const mainColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
  const darkColor = theme.palette[colorKey]?.dark || theme.palette.primary.dark;
  
  return {
    background: `linear-gradient(45deg, ${mainColor} 30%, ${darkColor} 90%)`,
    color: theme.palette.common.white,
    boxShadow: `0 3px 6px ${mainColor}30`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 6px 10px ${mainColor}40`,
      transform: 'translateY(-1px)'
    }
  };
});

// 边框输入框
export const BorderTextField = styled(TextField)(({ theme, color = 'primary' }) => {
  const colorKey = color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  const mainColor = theme.palette[colorKey]?.main || theme.palette.primary.main;
  
  return {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.divider,
        borderRadius: '8px',
        transition: 'all 0.2s ease'
      },
      '&:hover fieldset': {
        borderColor: `${mainColor}80`
      },
      '&.Mui-focused fieldset': {
        borderColor: mainColor,
        boxShadow: `0 0 0 2px ${mainColor}20`
      }
    }
  };
});

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

// 动画内容容器
export const AnimatedContentBox = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s ease',
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}));

// 类型卡片
export const TypeCard = styled(Card)(({ theme, selected, color }) => {
  const mainColor = color || (selected ? theme.palette.primary.main : theme.palette.divider);
  
  return {
    borderColor: selected ? mainColor : theme.palette.divider,
    backgroundColor: selected ? `${mainColor}10` : 'transparent',
    border: '1px solid',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      borderColor: mainColor,
      backgroundColor: `${mainColor}05`,
      transform: selected ? 'none' : 'translateY(-2px)'
    }
  };
});
