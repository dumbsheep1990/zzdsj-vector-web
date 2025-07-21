import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Avatar,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Language as LanguageIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Public as PublicIcon,
  OpenInNew as OpenInNewIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { newToolsAPI } from '../../utils/api/tools';

// 样式组件
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 20s ease-in-out infinite',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const SearchCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[4],
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
}));

const ResultCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  borderRadius: 12,
  margin: theme.spacing(0, 1),
  minHeight: 48,
  fontWeight: 600,
  textTransform: 'none',
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  date?: string;
  source?: string;
}

interface VisitResult {
  url: string;
  title: string;
  content: string;
  metadata?: any;
}

const WebSailorTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [visitUrl, setVisitUrl] = useState('');
  const [visitGoal, setVisitGoal] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [visitResults, setVisitResults] = useState<VisitResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [visitLoading, setVisitLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as any });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '智能理解',
      description: 'AI驱动的搜索理解，准确把握用户意图，提供最相关的搜索结果',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: '极速响应',
      description: '毫秒级搜索响应，实时内容提取，让信息获取变得前所未有的快速',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: '安全可靠',
      description: '企业级安全保障，数据传输加密，保护用户隐私和搜索行为',
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: '智能分析',
      description: '深度内容分析，结构化数据提取，将网页内容转化为可用信息',
    },
  ];

  useEffect(() => {
    // 加载搜索历史
    const history = localStorage.getItem('websailor_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const saveSearchHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('websailor_search_history', JSON.stringify(newHistory));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showSnackbar('请输入搜索关键词', 'warning');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await newToolsAPI.webSailor.search({ query: searchQuery.trim() });
      
      if (response.success) {
        setSearchResults(response.data.results || []);
        saveSearchHistory(searchQuery.trim());
        showSnackbar(`找到 ${response.data.results?.length || 0} 个搜索结果`, 'success');
      } else {
        showSnackbar(response.message || '搜索失败', 'error');
        setSearchResults([]);
      }
    } catch (error: any) {
      showSnackbar(error.message || '搜索失败', 'error');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleVisit = async () => {
    if (!visitUrl.trim()) {
      showSnackbar('请输入网页URL', 'warning');
      return;
    }

    setVisitLoading(true);
    try {
      const response = await newToolsAPI.webSailor.visit({
        url: visitUrl.trim(),
        goal: visitGoal.trim() || '提取网页主要内容'
      });

      if (response.success) {
        setVisitResults(response.data);
        showSnackbar('网页访问成功', 'success');
      } else {
        showSnackbar(response.message || '访问失败', 'error');
        setVisitResults(null);
      }
    } catch (error: any) {
      showSnackbar(error.message || '访问失败', 'error');
      setVisitResults(null);
    } finally {
      setVisitLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSnackbar('内容已复制到剪贴板', 'success');
  };

  const downloadResults = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSnackbar('结果已下载', 'success');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 顶部导航 */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <SearchIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              WebSailor
            </Typography>
            <Chip
              label="AI Powered"
              size="small"
              color="primary"
              sx={{ ml: 2, fontWeight: 600 }}
            />
          </Box>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Hero区域 */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            智能搜索 · 精准访问
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, fontWeight: 400 }}>
            阿里巴巴WebSailor，让AI为您的信息获取提供强大助力
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Chip
              icon={<TrendingUpIcon />}
              label="高效检索"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Chip
              icon={<PublicIcon />}
              label="全网覆盖"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Chip
              icon={<LightbulbIcon />}
              label="智能理解"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
          </Box>
        </Container>
      </HeroSection>

      {/* 特性介绍 */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}>
          强大功能
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
          集成先进AI技术，为您提供最优质的搜索和访问体验
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 主要功能区域 */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <SearchCard>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ minHeight: 48 }}
            >
              <StyledTab
                icon={<SearchIcon />}
                label="智能搜索"
                iconPosition="start"
              />
              <StyledTab
                icon={<LanguageIcon />}
                label="网页访问"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* 搜索标签页 */}
          {activeTab === 0 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="搜索关键词"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="输入您想搜索的内容..."
                      variant="outlined"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSearch}
                    disabled={searchLoading}
                    startIcon={searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {searchLoading ? '搜索中...' : '开始搜索'}
                  </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                  {searchHistory.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        搜索历史
                      </Typography>
                      <List dense>
                        {searchHistory.slice(0, 5).map((query, index) => (
                          <ListItem
                            key={index}
                            button
                            onClick={() => setSearchQuery(query)}
                            sx={{ borderRadius: 1, mb: 0.5 }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <HistoryIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={query}
                              primaryTypographyProps={{
                                variant: 'body2',
                                noWrap: true,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Grid>
              </Grid>

              {/* 搜索结果 */}
              {searchResults.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      搜索结果 ({searchResults.length})
                    </Typography>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadResults(searchResults, `search-results-${Date.now()}.json`)}
                      variant="outlined"
                      size="small"
                    >
                      下载结果
                    </Button>
                  </Box>

                  {searchResults.map((result, index) => (
                    <ResultCard key={index}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {result.title}
                          </Typography>
                          <Box>
                            <Tooltip title="复制标题">
                              <IconButton
                                size="small"
                                onClick={() => copyToClipboard(result.title)}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="访问网页">
                              <IconButton
                                size="small"
                                onClick={() => window.open(result.url, '_blank')}
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                          {result.url}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {result.snippet}
                        </Typography>
                        {result.date && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            发布时间: {result.date}
                          </Typography>
                        )}
                      </CardContent>
                    </ResultCard>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* 访问标签页 */}
          {activeTab === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="网页URL"
                    value={visitUrl}
                    onChange={(e) => setVisitUrl(e.target.value)}
                    placeholder="https://example.com"
                    variant="outlined"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="访问目标（可选）"
                    value={visitGoal}
                    onChange={(e) => setVisitGoal(e.target.value)}
                    placeholder="例如：提取文章标题和正文内容"
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleVisit}
                    disabled={visitLoading}
                    startIcon={visitLoading ? <CircularProgress size={20} /> : <VisibilityIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {visitLoading ? '访问中...' : '开始访问'}
                  </Button>
                </Grid>
              </Grid>

              {/* 访问结果 */}
              {visitResults && (
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      访问结果
                    </Typography>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadResults(visitResults, `visit-result-${Date.now()}.json`)}
                      variant="outlined"
                      size="small"
                    >
                      下载结果
                    </Button>
                  </Box>

                  <ResultCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {visitResults.title}
                      </Typography>
                      <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                        {visitResults.url}
                      </Typography>
                      
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            提取内容
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {visitResults.content}
                            </Typography>
                          </Box>
                        </AccordionDetails>
                      </Accordion>

                      {visitResults.metadata && (
                        <Accordion sx={{ mt: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              元数据
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                                {JSON.stringify(visitResults.metadata, null, 2)}
                              </pre>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </CardContent>
                  </ResultCard>
                </Box>
              )}
            </Box>
          )}
        </SearchCard>
      </Container>

      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default WebSailorTool;