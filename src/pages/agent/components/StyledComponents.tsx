import { styled } from '@mui/system';
import { Box, Card, CardContent } from '@mui/material';
import { Theme } from '@mui/material/styles';

// 页面容器
export const PageContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
  backgroundColor: '#f7f9fc'
}));

// 主内容区
export const ContentArea = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(3),
  overflow: 'auto'
}));

// 底部工具栏
export const FooterBar = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#ffffff',
  gap: theme.spacing(2)
}));

// 卡片标题
interface CardTitleProps {
  color?: 'blue' | 'green' | 'purple' | 'indigo' | 'teal';
}

export const CardTitle = styled(Box)<CardTitleProps>(({ theme, color = 'indigo' }: { theme: Theme, color?: string }) => {
  const gradients: Record<string, string> = {
    blue: 'linear-gradient(135deg, #4299E1 0%, #3182CE 100%)',
    green: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)', 
    purple: 'linear-gradient(135deg, #9F7AEA 0%, #805AD5 100%)',
    indigo: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    teal: 'linear-gradient(135deg, #38B2AC 0%, #319795 100%)'
  };
  
  return {
    background: gradients[color] || gradients.indigo,
    color: '#fff',
    padding: '18px 24px',
    fontSize: '1.1rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: 'none',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
    letterSpacing: '0.5px'
  };
});

// 卡片主体
export const CardBody = styled(CardContent)(({ theme }: { theme: Theme }) => ({
  flex: 1,
  padding: theme.spacing(2.5),
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

// 卡片组件
export const SectionCard = styled(Card)(() => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  border: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  height: 'auto',
  minHeight: '520px',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
  }
}));

// 描述区域
export const DescriptionArea = styled(Box)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  borderRadius: '8px',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: '1px solid rgba(0, 0, 0, 0.04)',
  fontSize: '0.875rem'
}));

// 工具标签
export const ToolTag = styled(Box)<{ selected?: boolean; color?: string }>(
  ({ theme, selected, color }: { theme: Theme, selected?: boolean, color?: string }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '16px',
    padding: theme.spacing(0.5, 1.5),
    margin: theme.spacing(0.5),
    fontSize: '0.85rem',
    cursor: 'pointer',
    border: '1px solid',
    borderColor: selected ? color || '#6366f1' : 'rgba(0, 0, 0, 0.1)',
    backgroundColor: selected ? `${color}15` || 'rgba(99, 102, 241, 0.08)' : 'rgba(0, 0, 0, 0.02)',
    color: selected ? color || '#6366f1' : 'rgba(0, 0, 0, 0.7)',
    fontWeight: selected ? 500 : 400,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: selected ? `${color}20` || 'rgba(99, 102, 241, 0.12)' : 'rgba(0, 0, 0, 0.05)',
      borderColor: color || '#6366f1'
    }
  })
);
