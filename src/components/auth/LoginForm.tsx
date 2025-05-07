import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Link, 
  FormHelperText,
  CircularProgress,
  alpha,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PersonOutline, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  formError?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, formError }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);

  // 测试账号信息
  const testAccount = {
    username: 'test_user',
    password: 'test123456'
  };

  // 使用测试账号
  const useTestAccount = () => {
    setFormData(testAccount);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 当用户开始输入时清除错误
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    await onSubmit(formData.username, formData.password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        width: '100%',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -20,
          left: -20,
          right: -20,
          bottom: -20,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          zIndex: -1
        }
      }}
    >
      {formError && (
        <FormHelperText error sx={{ mb: 2, fontSize: '0.9rem', textAlign: 'center' }}>
          {formError}
        </FormHelperText>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="用户名"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        error={Boolean(errors.username)}
        helperText={errors.username}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutline sx={{ color: alpha('#00c9ff', 0.75) }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              boxShadow: '0 4px 10px rgba(0, 201, 255, 0.12)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              boxShadow: '0 4px 15px rgba(0, 201, 255, 0.18)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#00c9ff', 0.25),
            borderWidth: '1.5px',
            transition: 'all 0.3s'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00c9ff',
            borderWidth: '2px'
          },
          '& .MuiInputLabel-root': {
            color: '#546e7a'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00c9ff'
          }
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="密码"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined sx={{ color: alpha('#00c9ff', 0.75) }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="切换密码可见性"
                onClick={toggleShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              boxShadow: '0 4px 10px rgba(0, 201, 255, 0.12)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              boxShadow: '0 4px 15px rgba(0, 201, 255, 0.18)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#00c9ff', 0.25),
            borderWidth: '1.5px',
            transition: 'all 0.3s'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00c9ff',
            borderWidth: '2px'
          },
          '& .MuiInputLabel-root': {
            color: '#546e7a'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00c9ff'
          }
        }}
      />
      <FormControlLabel
        control={
          <Checkbox 
            value="remember" 
            color="primary" 
            sx={{ 
              color: alpha('#00c9ff', 0.6),
              '&.Mui-checked': {
                color: '#00c9ff',
              }
            }} 
          />
        }
        label="记住我"
        sx={{ 
          color: '#546e7a',
          mb: 2,
          '& .MuiTypography-root': {
            fontSize: '0.9rem'
          }
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{
          py: 1.5,
          mt: 1,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(to right, rgb(0, 201, 255), rgb(146, 254, 157))',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
          letterSpacing: '0.5px',
          boxShadow: '0 5px 15px rgba(0, 201, 255, 0.25)',
          transition: 'all 0.3s',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
            transform: 'rotate(30deg)',
            transition: 'all 1s',
            opacity: 0,
            zIndex: 1
          },
          '&:hover': {
            background: 'linear-gradient(to right, rgb(0, 190, 242), rgb(135, 245, 147))',
            boxShadow: '0 8px 20px rgba(0, 201, 255, 0.35)',
            transform: 'translateY(-2px)',
            '&::after': {
              opacity: 1,
              left: '100%',
              transition: 'all 1s'
            }
          }
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : '登录'}
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="text"
          size="small"
          onClick={useTestAccount}
          sx={{
            color: '#00c9ff',
            fontSize: '0.85rem',
            textTransform: 'none',
            borderRadius: 1.5,
            px: 2,
            py: 0.75,
            '&:hover': {
              backgroundColor: 'rgba(0, 201, 255, 0.1)',
            }
          }}
        >
          使用测试账号登录
        </Button>
      </Box>
      
      {/* 分隔线 */}
      <Box sx={{ mt: 1, mb: 2 }}>
        <Divider sx={{ 
          '&::before, &::after': {
            borderColor: 'rgba(0, 201, 255, 0.15)',
          }
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontSize: '0.75rem' }}>
            或者
          </Typography>
        </Divider>
      </Box>
      
      {/* 底部链接区域 - 两端对齐 */}
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          mt: 2
        }}
      >
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{ 
            color: '#00c9ff',
            textDecoration: 'none',
            transition: 'all 0.2s',
            fontWeight: 500,
            fontSize: '0.85rem',
            padding: '8px 12px',
            borderRadius: '4px',
            '&:hover': {
              color: '#008bc1',
              backgroundColor: 'rgba(0, 201, 255, 0.05)'
            }
          }}
        >
          忘记密码?
        </Link>
        
        <Link
          component={RouterLink}
          to="/register"
          variant="body2"
          sx={{ 
            color: '#00c9ff',
            textDecoration: 'none',
            transition: 'all 0.2s',
            fontWeight: 500,
            fontSize: '0.85rem',
            padding: '8px 12px',
            borderRadius: '4px',
            '&:hover': {
              color: '#008bc1',
              backgroundColor: 'rgba(0, 201, 255, 0.05)'
            }
          }}
        >
          没有账号? 立即注册
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
