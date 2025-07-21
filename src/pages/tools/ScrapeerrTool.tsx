import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  BarChart as BarChartIcon,
  Folder as FolderIcon,
  Person as PersonIcon,
  AutoAwesome as AutoAwesomeIcon,
  VideoFile as VideoFileIcon,
  Http as HttpIcon
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { newToolsAPI } from '../../utils/api/tools';

// 样式组件
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  elevation: 0,
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    transition: 'all 0.2s ease-in-out',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: 48,
  borderRadius: 16,
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:disabled': {
    transform: 'none',
    boxShadow: 'none',
  },
}));

const SideNavigation = styled(Box)(({ theme }) => ({
  width: 240,
  height: '100vh',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
}));

const MainContent = styled(Box)({
  marginLeft: 240,
  minHeight: '100vh',
  backgroundColor: '#f4f6f8',
});

interface Element {
  name: string;
  xpath: string;
}

interface Job {
  id: string;
  url: string;
  status: string;
  created_at: string;
  elements: Element[];
  results?: any;
}

const ScrapeerrTool: React.FC = () => {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [elements, setElements] = useState<Element[]>([
    { name: 'title', xpath: '//title/text()' }
  ]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as any });
  const [activeTab, setActiveTab] = useState('scrape');

  // 导航项目
  const navigationItems = [
    { icon: <HomeIcon />, text: 'Scrape Webpage', id: 'scrape' },
    { icon: <HttpIcon />, text: 'Jobs', id: 'jobs' },
    { icon: <ScheduleIcon />, text: 'Cron Jobs', id: 'cron' },
    { icon: <PersonIcon />, text: 'Agent', id: 'agent' },
    { icon: <AutoAwesomeIcon />, text: 'Chat', id: 'chat' },
    { icon: <BarChartIcon />, text: 'Statistics', id: 'statistics' },
    { icon: <VideoFileIcon />, text: 'Recordings', id: 'recordings' },
    { icon: <FolderIcon />, text: 'Media', id: 'media' },
  ];

  // 预设模板
  const templates = {
    basic: [
      { name: 'title', xpath: '//title/text()' },
      { name: 'content', xpath: '//p | //div[contains(@class, "content")]' }
    ],
    article: [
      { name: 'title', xpath: '//h1 | //title' },
      { name: 'author', xpath: '//*[contains(@class, "author")]' },
      { name: 'date', xpath: '//*[contains(@class, "date")]' },
      { name: 'content', xpath: '//article | //div[contains(@class, "content")]' }
    ],
    ecommerce: [
      { name: 'product_name', xpath: '//h1 | //*[contains(@class, "product-title")]' },
      { name: 'price', xpath: '//*[contains(@class, "price")]' },
      { name: 'description', xpath: '//*[contains(@class, "description")]' },
      { name: 'images', xpath: '//img/@src' }
    ]
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await newToolsAPI.scraperr.listJobs({ limit: 50 });
      if (response.success) {
        setJobs(response.data.jobs || []);
      } else {
        showSnackbar(response.message || '加载任务失败', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.message || '加载任务失败', 'error');
    } finally {
      setJobsLoading(false);
    }
  };

  const createScrapeJob = async () => {
    if (!url.trim()) {
      showSnackbar('请输入URL', 'warning');
      return;
    }

    if (elements.length === 0) {
      showSnackbar('请至少添加一个提取元素', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await newToolsAPI.scraperr.scrape({
        url: url.trim(),
        elements: elements.filter(el => el.name && el.xpath)
      });

      if (response.success) {
        showSnackbar('爬取任务已创建', 'success');
        await loadJobs();
        setUrl('');
        setElements([{ name: 'title', xpath: '//title/text()' }]);
      } else {
        showSnackbar(response.message || '创建任务失败', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.message || '创建任务失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const addElement = () => {
    setElements([...elements, { name: '', xpath: '' }]);
  };

  const removeElement = (index: number) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const updateElement = (index: number, field: 'name' | 'xpath', value: string) => {
    const newElements = [...elements];
    newElements[index][field] = value;
    setElements(newElements);
  };

  const useTemplate = (templateName: keyof typeof templates) => {
    setElements(templates[templateName]);
  };

  const viewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'running': return 'primary';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  // 渲染爬取页面
  const renderScrapePage = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StyledPaper>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Scrape Webpage
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Elements to Extract</Typography>
              <Box>
                <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value=""
                    label="Template"
                    onChange={(e) => useTemplate(e.target.value as keyof typeof templates)}
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="article">Article</MenuItem>
                    <MenuItem value="ecommerce">E-commerce</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addElement}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  Add Element
                </Button>
              </Box>
            </Box>

            {elements.map((element, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <StyledTextField
                      fullWidth
                      size="small"
                      label="Element Name"
                      value={element.name}
                      onChange={(e) => updateElement(index, 'name', e.target.value)}
                      placeholder="title, content, etc."
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <StyledTextField
                      fullWidth
                      size="small"
                      label="XPath Expression"
                      value={element.xpath}
                      onChange={(e) => updateElement(index, 'xpath', e.target.value)}
                      placeholder="//h1 | //title"
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton 
                      onClick={() => removeElement(index)}
                      color="error"
                      disabled={elements.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
              <StyledButton
                variant="contained"
                size="large"
                onClick={createScrapeJob}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <PlayIcon />}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Creating Job...' : 'Start Scraping'}
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );

  // 渲染任务列表页面
  const renderJobsPage = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Scraping Jobs
          </Typography>
          <StyledButton
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadJobs}
            disabled={jobsLoading}
          >
            Refresh
          </StyledButton>
        </Box>

        {jobsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Elements</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {job.url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={job.status} 
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(job.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {job.elements?.length || 0} elements
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => viewJobDetails(job)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </StyledPaper>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 侧边导航 */}
      <SideNavigation>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Scraperr
          </Typography>
        </Box>
        
        <List sx={{ flexGrow: 1 }}>
          {navigationItems.map((item) => (
            <ListItem
              key={item.id}
              button
              selected={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      </SideNavigation>

      {/* 主内容区 */}
      <MainContent>
        {activeTab === 'scrape' && renderScrapePage()}
        {activeTab === 'jobs' && renderJobsPage()}
        {activeTab !== 'scrape' && activeTab !== 'jobs' && (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <StyledPaper>
              <Typography variant="h4" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                {navigationItems.find(item => item.id === activeTab)?.text || 'Coming Soon'}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                This feature is under development
              </Typography>
            </StyledPaper>
          </Container>
        )}
      </MainContent>

      {/* 任务详情对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Job Details
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>URL:</strong> {selectedJob.url}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Status:</strong>{' '}
                <Chip 
                  label={selectedJob.status} 
                  color={getStatusColor(selectedJob.status)}
                  size="small"
                />
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Created:</strong> {new Date(selectedJob.created_at).toLocaleString()}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Elements:
              </Typography>
              {selectedJob.elements?.map((element, index) => (
                <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>{element.name}:</strong> {element.xpath}
                  </Typography>
                </Box>
              ))}

              {selectedJob.results && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Results:
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <pre>{JSON.stringify(selectedJob.results, null, 2)}</pre>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default ScrapeerrTool;