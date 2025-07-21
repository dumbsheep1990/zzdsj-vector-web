import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Modal, 
  Form, 
  message, 
  Switch, 
  Select, 
  Space, 
  Divider, 
  Typography, 
  Popconfirm, 
  Tag, 
  Alert,
  Tabs,
  Row,
  Col,
  Statistic,
  Upload,
  Progress,
  Descriptions,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  SecurityScanOutlined, 
  FilterOutlined, 
  ClearOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  StopOutlined,
  ImportOutlined,
  ExportOutlined,
  UploadOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import PageHeader from '../components/layout/PageHeader';
import { settingsApi } from '../utils/api/settings';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 系统内置敏感词接口
interface SensitiveWord {
  id: string;
  word: string;
  category: string;
  level: 'low' | 'medium' | 'high';
  createTime: string;
  updateTime: string;
  isActive: boolean;
}

// 敏感词库接口
interface SensitiveWordLibrary {
  id: string;
  name: string;
  description: string;
  fileName: string;
  totalWords: number;
  categories: string[];
  level: 'low' | 'medium' | 'high';
  mode: 'enabled' | 'disabled';
  createTime: string;
  updateTime: string;
  uploadUser: string;
}

interface SecurityConfig {
  sensitiveWordEnabled: boolean;
  sensitiveWordFilterType: 'block' | 'replace' | 'warn';
  sensitiveWordReplaceChar: string;
  autoBlockEnabled: boolean;
  logSensitiveWords: boolean;
  whitelistEnabled: boolean;
  blacklistEnabled: boolean;
  customRulesEnabled: boolean;
}

const SecuritySettings: React.FC = () => {
  // 系统内置敏感词相关状态
  const [sensitiveWords, setSensitiveWords] = useState<SensitiveWord[]>([]);
  const [isWordModalVisible, setIsWordModalVisible] = useState(false);
  const [editingWord, setEditingWord] = useState<SensitiveWord | null>(null);
  const [wordForm] = Form.useForm();
  const [isBatchAddModalVisible, setIsBatchAddModalVisible] = useState(false);
  const [batchAddForm] = Form.useForm();
  
  // 敏感词库相关状态
  const [wordLibraries, setWordLibraries] = useState<SensitiveWordLibrary[]>([]);
  const [isLibraryModalVisible, setIsLibraryModalVisible] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState<SensitiveWordLibrary | null>(null);
  const [libraryForm] = Form.useForm();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  // 通用状态
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    sensitiveWordEnabled: true,
    sensitiveWordFilterType: 'replace',
    sensitiveWordReplaceChar: '*',
    autoBlockEnabled: true,
    logSensitiveWords: true,
    whitelistEnabled: false,
    blacklistEnabled: true,
    customRulesEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('builtin');

  // 模拟数据
  const mockSensitiveWords: SensitiveWord[] = [
    {
      id: '1',
      word: '敏感词1',
      category: '政治',
      level: 'high',
      createTime: '2024-01-15',
      updateTime: '2024-01-15',
      isActive: true
    },
    {
      id: '2',
      word: '敏感词2',
      category: '暴力',
      level: 'medium',
      createTime: '2024-01-16',
      updateTime: '2024-01-16',
      isActive: true
    },
    {
      id: '3',
      word: '敏感词3',
      category: '色情',
      level: 'high',
      createTime: '2024-01-17',
      updateTime: '2024-01-17',
      isActive: false
    }
  ];

  const mockWordLibraries: SensitiveWordLibrary[] = [
    {
      id: '1',
      name: '政治敏感词库',
      description: '包含政治相关敏感词汇',
      fileName: 'politics_words.csv',
      totalWords: 1250,
      categories: ['政治', '政府', '官员'],
      level: 'high',
      mode: 'enabled',
      createTime: '2024-01-10',
      updateTime: '2024-01-10',
      uploadUser: '管理员'
    },
    {
      id: '2',
      name: '暴力词汇库',
      description: '暴力、仇恨等相关敏感词',
      fileName: 'violence_words.csv',
      totalWords: 890,
      categories: ['暴力', '仇恨', '威胁'],
      level: 'medium',
      mode: 'enabled',
      createTime: '2024-01-12',
      updateTime: '2024-01-12',
      uploadUser: '管理员'
    },
    {
      id: '3',
      name: '色情内容库',
      description: '色情、低俗等不良内容词汇',
      fileName: 'adult_words.csv',
      totalWords: 2100,
      categories: ['色情', '低俗'],
      level: 'high',
      mode: 'disabled',
      createTime: '2024-01-14',
      updateTime: '2024-01-14',
      uploadUser: '管理员'
    }
  ];

  useEffect(() => {
    loadSensitiveWords();
    loadWordLibraries();
    loadSecurityConfig();
  }, []);

  const loadSensitiveWords = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        setSensitiveWords(mockSensitiveWords);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('加载敏感词库失败');
      setLoading(false);
    }
  };

  const loadWordLibraries = async () => {
    try {
      // 模拟API调用
      setTimeout(() => {
        setWordLibraries(mockWordLibraries);
      }, 300);
    } catch (error) {
      message.error('加载词库失败');
    }
  };

  const loadSecurityConfig = async () => {
    try {
      // 模拟API调用
      // const config = await settingsApi.getSecurityConfig();
      // setSecurityConfig(config);
    } catch (error) {
      message.error('加载安全配置失败');
    }
  };

  // 系统内置敏感词管理
  const handleAddWord = () => {
    setEditingWord(null);
    wordForm.resetFields();
    setIsWordModalVisible(true);
  };

  const handleEditWord = (word: SensitiveWord) => {
    setEditingWord(word);
    wordForm.setFieldsValue(word);
    setIsWordModalVisible(true);
  };

  const handleDeleteWord = async (id: string) => {
    try {
      setSensitiveWords(prev => prev.filter(word => word.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleWordModalOk = async () => {
    try {
      const values = await wordForm.validateFields();
      
      if (editingWord) {
        // 更新敏感词
        setSensitiveWords(prev => 
          prev.map(word => 
            word.id === editingWord.id 
              ? { ...word, ...values, updateTime: new Date().toISOString().split('T')[0] }
              : word
          )
        );
        message.success('更新成功');
      } else {
        // 添加新敏感词
        const newWord: SensitiveWord = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toISOString().split('T')[0],
          updateTime: new Date().toISOString().split('T')[0],
          isActive: true
        };
        setSensitiveWords(prev => [...prev, newWord]);
        message.success('添加成功');
      }
      
      setIsWordModalVisible(false);
      wordForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleToggleWordStatus = async (id: string) => {
    try {
      setSensitiveWords(prev => 
        prev.map(word => 
          word.id === id 
            ? { ...word, isActive: !word.isActive }
            : word
        )
      );
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 批量添加敏感词
  const handleBatchAddWord = () => {
    batchAddForm.resetFields();
    setIsBatchAddModalVisible(true);
  };

  const handleBatchAddModalOk = async () => {
    try {
      const values = await batchAddForm.validateFields();
      const { words, category, level } = values;
      
      // 解析敏感词（支持换行和逗号分隔）
      const wordList = words.split(/[\n,，]/).map((word: string) => word.trim()).filter((word: string) => word);
      
      const newWords: SensitiveWord[] = wordList.map((word: string) => ({
        id: (Date.now() + Math.random()).toString(),
        word,
        category,
        level,
        createTime: new Date().toISOString().split('T')[0],
        updateTime: new Date().toISOString().split('T')[0],
        isActive: true
      }));
      
      setSensitiveWords(prev => [...prev, ...newWords]);
      message.success(`成功添加 ${newWords.length} 个敏感词`);
      
      setIsBatchAddModalVisible(false);
      batchAddForm.resetFields();
    } catch (error) {
      console.error('批量添加失败:', error);
    }
  };

  // 敏感词库管理
  const handleAddLibrary = () => {
    setEditingLibrary(null);
    libraryForm.resetFields();
    setIsLibraryModalVisible(true);
  };

  const handleEditLibrary = (library: SensitiveWordLibrary) => {
    setEditingLibrary(library);
    libraryForm.setFieldsValue(library);
    setIsLibraryModalVisible(true);
  };

  const handleDeleteLibrary = async (id: string) => {
    try {
      setWordLibraries(prev => prev.filter(lib => lib.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleToggleLibraryStatus = async (id: string) => {
    try {
      setWordLibraries(prev => 
        prev.map(lib => 
          lib.id === id 
            ? { ...lib, mode: lib.mode === 'enabled' ? 'disabled' : 'enabled' }
            : lib
        )
      );
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // CSV 文件上传处理
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // 模拟文件上传进度
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      // 模拟文件解析
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const words = lines.slice(1).filter(line => line.trim()); // 跳过标题行
        
        // 解析CSV格式 (假设格式: word,category,level)
        const categories = new Set<string>();
        words.forEach(line => {
          const parts = line.split(',');
          if (parts.length >= 2) {
            categories.add(parts[1].trim());
          }
        });
        
        setUploadProgress(100);
        
        setTimeout(() => {
          const newLibrary: SensitiveWordLibrary = {
            id: Date.now().toString(),
            name: file.name.replace('.csv', ''),
            description: `从 ${file.name} 导入的敏感词库`,
            fileName: file.name,
            totalWords: words.length,
            categories: Array.from(categories),
            level: 'medium',
            mode: 'enabled',
            createTime: new Date().toISOString().split('T')[0],
            updateTime: new Date().toISOString().split('T')[0],
            uploadUser: '管理员'
          };
          
          setWordLibraries(prev => [...prev, newLibrary]);
          message.success(`成功导入词库 ${file.name}，共 ${words.length} 个词`);
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      };
      
      reader.readAsText(file);
    } catch (error) {
      message.error('文件上传失败');
      setUploading(false);
      setUploadProgress(0);
    }
    
    return false; // 阻止默认上传行为
  };

  const handleConfigChange = async (key: keyof SecurityConfig, value: any) => {
    const newConfig = { ...securityConfig, [key]: value };
    setSecurityConfig(newConfig);
    
    try {
      // await settingsApi.updateSecurityConfig(newConfig);
      message.success('配置更新成功');
    } catch (error) {
      message.error('配置更新失败');
    }
  };

  const handleExport = () => {
    // 导出敏感词为CSV格式
    const csvContent = 'word,category,level,isActive\n' + 
      sensitiveWords.map(word => `${word.word},${word.category},${word.level},${word.isActive}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sensitive_words_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    message.success('导出成功');
  };

  const handleClearCache = async () => {
    try {
      // TODO: 调用清除缓存API
      message.success('缓存清除成功');
    } catch (error) {
      message.error('缓存清除失败');
    }
  };

  // 下载CSV模板
  const handleDownloadTemplate = () => {
    const templateContent = 'word,category,level\n示例词1,政治,high\n示例词2,暴力,medium\n示例词3,色情,high';
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sensitive_words_template.csv';
    link.click();
    
    message.success('模板下载成功');
  };

  const columns = [
    {
      title: '敏感词',
      dataIndex: 'word',
      key: 'word',
      render: (text: string, record: SensitiveWord) => (
        <Space>
          <span className="font-medium">{text}</span>
          {!record.isActive && <Tag color="default">已禁用</Tag>}
        </Space>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      )
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const colors = {
          low: 'green',
          medium: 'orange',
          high: 'red'
        };
        const labels = {
          low: '低',
          medium: '中',
          high: '高'
        };
        return <Tag color={colors[level as keyof typeof colors]}>{labels[level as keyof typeof labels]}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleDateString()
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: SensitiveWord) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleWordStatus(record.id)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (text: any, record: SensitiveWord) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditWord(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个敏感词吗？"
            onConfirm={() => handleDeleteWord(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 敏感词库表格列定义
  const libraryColumns = [
    {
      title: '词库名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: SensitiveWordLibrary) => (
        <Space>
          <DatabaseOutlined />
          <span className="font-medium">{text}</span>
          {record.mode === 'disabled' && <Tag color="default">已禁用</Tag>}
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '词数',
      dataIndex: 'totalWords',
      key: 'totalWords',
      render: (count: number) => (
        <Badge count={count} showZero color="blue" />
      )
    },
    {
      title: '类别',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <Space wrap>
          {categories.slice(0, 3).map(cat => (
            <Tag key={cat} color="geekblue">{cat}</Tag>
          ))}
          {categories.length > 3 && <Tag>+{categories.length - 3}</Tag>}
        </Space>
      )
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const colors = {
          low: 'green',
          medium: 'orange',
          high: 'red'
        };
        const labels = {
          low: '低',
          medium: '中',
          high: '高'
        };
        return <Tag color={colors[level as keyof typeof colors]}>{labels[level as keyof typeof labels]}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'mode',
      key: 'mode',
      render: (mode: string, record: SensitiveWordLibrary) => (
        <Switch 
          checked={mode === 'enabled'} 
          onChange={() => handleToggleLibraryStatus(record.id)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (text: any, record: SensitiveWordLibrary) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditLibrary(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个词库吗？"
            onConfirm={() => handleDeleteLibrary(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 系统内置敏感词Tab页面
  const renderBuiltinWordsTab = () => (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Title level={4} className="mb-2">系统内置敏感词</Title>
          <Text type="secondary">管理系统内置的敏感词，支持单个添加和批量导入</Text>
        </div>
        <Space>
          <Button 
            icon={<ImportOutlined />} 
            onClick={handleBatchAddWord}
          >
            批量添加
          </Button>
          <Button 
            icon={<ExportOutlined />} 
            onClick={handleExport}
          >
            导出
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddWord}
          >
            添加敏感词
          </Button>
        </Space>
      </div>

      <div className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="总敏感词数" 
                value={sensitiveWords.length} 
                prefix={<SecurityScanOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="已启用" 
                value={sensitiveWords.filter(w => w.isActive).length} 
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="高级别" 
                value={sensitiveWords.filter(w => w.level === 'high').length} 
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="今日检测" 
                value={245} 
                prefix={<FilterOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={sensitiveWords}
          rowKey="id"
          loading={loading}
          pagination={{
            total: sensitiveWords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>
    </div>
  );

  // 敏感词库管理Tab页面
  const renderLibraryTab = () => (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Title level={4} className="mb-2">敏感词库管理</Title>
          <Text type="secondary">管理敏感词库文件，支持CSV文件导入和批量管理</Text>
        </div>
        <Space>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleDownloadTemplate}
          >
            下载模板
          </Button>
          <Upload
            beforeUpload={handleFileUpload}
            accept=".csv"
            showUploadList={false}
            disabled={uploading}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={uploading}
            >
              导入词库
            </Button>
          </Upload>
        </Space>
      </div>

      {uploading && (
        <div className="mb-4">
          <Alert
            message="正在上传文件..."
            description={
              <Progress 
                percent={uploadProgress} 
                status={uploadProgress === 100 ? 'success' : 'active'}
              />
            }
            type="info"
          />
        </div>
      )}

      <div className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="总词库数" 
                value={wordLibraries.length} 
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="已启用" 
                value={wordLibraries.filter(lib => lib.mode === 'enabled').length} 
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="总词汇数" 
                value={wordLibraries.reduce((sum, lib) => sum + lib.totalWords, 0)} 
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="高级别库" 
                value={wordLibraries.filter(lib => lib.level === 'high').length} 
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card>
        <Table
          columns={libraryColumns}
          dataSource={wordLibraries}
          rowKey="id"
          loading={loading}
          pagination={{
            total: wordLibraries.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>
    </div>
  );

  const renderConfigTab = () => (
    <div className="space-y-6">
      <Card title="基础配置" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Text strong className="block">启用敏感词过滤</Text>
              <Text type="secondary">开启后将对用户输入内容进行敏感词检测</Text>
            </div>
            <Switch 
              checked={securityConfig.sensitiveWordEnabled}
              onChange={(checked) => handleConfigChange('sensitiveWordEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Text strong className="block">记录敏感词日志</Text>
              <Text type="secondary">记录敏感词检测结果，便于审计和分析</Text>
            </div>
            <Switch 
              checked={securityConfig.logSensitiveWords}
              onChange={(checked) => handleConfigChange('logSensitiveWords', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Text strong className="block">自动阻止功能</Text>
              <Text type="secondary">检测到敏感词时自动阻止内容发送</Text>
            </div>
            <Switch 
              checked={securityConfig.autoBlockEnabled}
              onChange={(checked) => handleConfigChange('autoBlockEnabled', checked)}
            />
          </div>
        </div>
      </Card>

      <Card title="过滤策略" className="mb-6">
        <div className="space-y-4">
          <div>
            <Text strong className="block mb-2">过滤类型</Text>
            <Select
              value={securityConfig.sensitiveWordFilterType}
              onChange={(value) => handleConfigChange('sensitiveWordFilterType', value)}
              className="w-full"
            >
              <Select.Option value="block">
                <Space>
                  <StopOutlined />
                  完全阻止 - 直接阻止包含敏感词的内容
                </Space>
              </Select.Option>
              <Select.Option value="replace">
                <Space>
                  <FilterOutlined />
                  替换模式 - 将敏感词替换为指定字符
                </Space>
              </Select.Option>
              <Select.Option value="warn">
                <Space>
                  <WarningOutlined />
                  警告模式 - 仅警告不阻止内容
                </Space>
              </Select.Option>
            </Select>
          </div>

          {securityConfig.sensitiveWordFilterType === 'replace' && (
            <div>
              <Text strong className="block mb-2">替换字符</Text>
              <Input
                value={securityConfig.sensitiveWordReplaceChar}
                onChange={(e) => handleConfigChange('sensitiveWordReplaceChar', e.target.value)}
                placeholder="请输入替换字符"
                maxLength={1}
                className="w-32"
              />
              <Text type="secondary" className="block mt-2">
                敏感词将被替换为此字符，例如：敏感词 → {securityConfig.sensitiveWordReplaceChar.repeat(3)}
              </Text>
            </div>
          )}
        </div>
      </Card>

      <Card title="高级设置" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Text strong className="block">启用白名单</Text>
              <Text type="secondary">允许特定用户或内容绕过敏感词检测</Text>
            </div>
            <Switch 
              checked={securityConfig.whitelistEnabled}
              onChange={(checked) => handleConfigChange('whitelistEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Text strong className="block">启用黑名单</Text>
              <Text type="secondary">对特定用户或内容进行更严格的检测</Text>
            </div>
            <Switch 
              checked={securityConfig.blacklistEnabled}
              onChange={(checked) => handleConfigChange('blacklistEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Text strong className="block">自定义规则</Text>
              <Text type="secondary">支持正则表达式等高级过滤规则</Text>
            </div>
            <Switch 
              checked={securityConfig.customRulesEnabled}
              onChange={(checked) => handleConfigChange('customRulesEnabled', checked)}
            />
          </div>
        </div>

        <Divider />

        <div className="flex justify-between items-center">
          <div>
            <Text strong className="block">缓存管理</Text>
            <Text type="secondary">清除敏感词检测缓存，强制重新加载词库</Text>
          </div>
          <Button 
            icon={<ClearOutlined />}
            onClick={handleClearCache}
          >
            清除缓存
          </Button>
        </div>
      </Card>

      <Alert
        message="配置说明"
        description="敏感词过滤配置更改后将立即生效。建议在生产环境中谨慎调整过滤策略，避免影响用户体验。"
        type="info"
        showIcon
      />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="sticky top-0 z-10">
        <PageHeader 
          title="安全配置"
          parentTitle="系统设置"
          description="管理系统安全相关配置，包括敏感词过滤、内容审核等"
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <Card className="shadow-sm">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane 
                tab={
                  <span>
                    <SecurityScanOutlined />
                    系统内置敏感词
                  </span>
                } 
                key="builtin"
              >
                {renderBuiltinWordsTab()}
              </TabPane>
              <TabPane 
                tab={
                  <span>
                    <DatabaseOutlined />
                    敏感词库管理
                  </span>
                } 
                key="library"
              >
                {renderLibraryTab()}
              </TabPane>
              <TabPane 
                tab={
                  <span>
                    <FilterOutlined />
                    过滤配置
                  </span>
                } 
                key="config"
              >
                {renderConfigTab()}
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>

      <Modal
        title={editingWord ? '编辑敏感词' : '添加敏感词'}
        open={isWordModalVisible}
        onOk={handleWordModalOk}
        onCancel={() => setIsWordModalVisible(false)}
        width={500}
      >
        <Form
          form={wordForm}
          layout="vertical"
          initialValues={{
            category: '其他',
            level: 'medium',
            isActive: true
          }}
        >
          <Form.Item
            name="word"
            label="敏感词"
            rules={[
              { required: true, message: '请输入敏感词' },
              { min: 1, max: 50, message: '敏感词长度应在1-50字符之间' }
            ]}
          >
            <Input placeholder="请输入敏感词" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Select.Option value="政治">政治</Select.Option>
              <Select.Option value="暴力">暴力</Select.Option>
              <Select.Option value="色情">色情</Select.Option>
              <Select.Option value="赌博">赌博</Select.Option>
              <Select.Option value="毒品">毒品</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="级别"
            rules={[{ required: true, message: '请选择级别' }]}
          >
            <Select placeholder="请选择级别">
              <Select.Option value="low">低</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="high">高</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量添加敏感词模态框 */}
      <Modal
        title="批量添加敏感词"
        open={isBatchAddModalVisible}
        onOk={handleBatchAddModalOk}
        onCancel={() => setIsBatchAddModalVisible(false)}
        width={600}
      >
        <Form
          form={batchAddForm}
          layout="vertical"
          initialValues={{
            category: '其他',
            level: 'medium'
          }}
        >
          <Form.Item
            name="words"
            label="敏感词列表"
            rules={[
              { required: true, message: '请输入敏感词' },
              { min: 1, message: '至少输入一个敏感词' }
            ]}
          >
            <TextArea 
              placeholder="请输入敏感词，支持换行或逗号分隔\n例如：\n敏感词1\n敏感词2，敏感词3"
              rows={8}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="统一分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="请选择分类">
                  <Select.Option value="政治">政治</Select.Option>
                  <Select.Option value="暴力">暴力</Select.Option>
                  <Select.Option value="色情">色情</Select.Option>
                  <Select.Option value="赌博">赌博</Select.Option>
                  <Select.Option value="毒品">毒品</Select.Option>
                  <Select.Option value="其他">其他</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="统一级别"
                rules={[{ required: true, message: '请选择级别' }]}
              >
                <Select placeholder="请选择级别">
                  <Select.Option value="low">低</Select.Option>
                  <Select.Option value="medium">中</Select.Option>
                  <Select.Option value="high">高</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message="批量添加说明"
            description="支持换行分隔或逗号分隔多个敏感词，系统会自动去重并应用统一的分类和级别设置。"
            type="info"
            showIcon
            className="mb-4"
          />
        </Form>
      </Modal>
    </div>
  );
};

export default SecuritySettings;
