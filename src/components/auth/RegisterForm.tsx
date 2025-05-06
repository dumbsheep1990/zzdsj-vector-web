import React, { useState } from 'react';
import { 
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
  Checkbox
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RegisterData } from '../../context/AuthContext';
import { PersonOutline, EmailOutlined, LockOutlined, BadgeOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

interface RegisterFormProps {
  onSubmit: (formData: RegisterData) => Promise<void>;
  isLoading: boolean;
  formError?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, formError }) => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    full_name: '',
    agreeTerms: false
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    full_name?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      // 当用户输入确认密码时清除错误
      if (errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // 当用户输入时清除错误
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = '全名不能为空';
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码至少需要8个字符';
    }
    
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    await onSubmit(formData);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        width: '100%',
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
              <PersonOutline sx={{ color: '#3498db' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 10px rgba(52, 152, 219, 0.1)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.15)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#3498db', 0.3),
            transition: 'all 0.3s'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3498db'
          },
          '& .MuiInputLabel-root': {
            color: '#2c3e50'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3498db'
          }
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="邮箱"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlined sx={{ color: '#3498db' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 10px rgba(52, 152, 219, 0.1)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.15)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#3498db', 0.3),
            transition: 'all 0.3s'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3498db'
          },
          '& .MuiInputLabel-root': {
            color: '#2c3e50'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3498db'
          }
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="full_name"
        label="全名"
        name="full_name"
        autoComplete="name"
        value={formData.full_name}
        onChange={handleChange}
        error={Boolean(errors.full_name)}
        helperText={errors.full_name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeOutlined sx={{ color: '#3498db' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 10px rgba(52, 152, 219, 0.1)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.15)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#3498db', 0.3),
            transition: 'all 0.3s'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3498db'
          },
          '& .MuiInputLabel-root': {
            color: '#2c3e50'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3498db'
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
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined sx={{ color: '#3498db' }} />
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 10px rgba(52, 152, 219, 0.1)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.15)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#3498db', 0.3),
            transition: 'all 0.3s'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3498db'
          },
          '& .MuiInputLabel-root': {
            color: '#2c3e50'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3498db'
          }
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="确认密码"
        type={showConfirmPassword ? 'text' : 'password'}
        id="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={handleChange}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined sx={{ color: '#3498db' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="切换密码可见性"
                onClick={toggleShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 10px rgba(52, 152, 219, 0.1)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.15)'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#3498db', 0.3),
            transition: 'all 0.3s'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3498db'
          },
          '& .MuiInputLabel-root': {
            color: '#2c3e50'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#3498db'
          }
        }}
      />
      <FormControlLabel
        control={
          <Checkbox 
            value="agreeTerms" 
            color="primary" 
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            sx={{ 
              color: '#2c3e50',
              '&.Mui-checked': {
                color: '#3498db',
              }
            }} 
          />
        }
        label="我已阅读并同意服务条款和隐私政策"
        sx={{ 
          color: '#2c3e50',
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
          backgroundColor: '#3498db',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
          letterSpacing: '0.5px',
          boxShadow: '0 5px 15px rgba(52, 152, 219, 0.3)',
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
            backgroundColor: '#2980b9',
            boxShadow: '0 8px 20px rgba(41, 128, 185, 0.3)',
            transform: 'translateY(-2px)',
            '&::after': {
              opacity: 1,
              left: '100%',
              transition: 'all 1s'
            }
          }
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : '创建账户'}
      </Button>
      <Box sx={{ fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          sx={{ 
            color: '#3498db',
            textDecoration: 'none',
            transition: 'all 0.2s',
            fontWeight: 500,
            '&:hover': {
              color: '#2980b9',
              textDecoration: 'underline'
            }
          }}
        >
          已有账号? 立即登录
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterForm;
