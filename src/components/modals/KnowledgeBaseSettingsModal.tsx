import React, { useState, useEffect } from 'react';
import { Form, Button, Radio, Tooltip, Space, Tabs, Card } from 'antd';
import { 
  QuestionCircleOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined, 
  DeleteOutlined,
  ProjectOutlined,
  DatabaseOutlined,
  RocketOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Database, Settings, AlertTriangle, Brain, Search, Layers } from 'lucide-react';
import GlassmorphismModal from './GlassmorphismModal';
import type { KnowledgeBaseItem } from '../../utils/types';
import { useToast } from '../Toast';
import './GlassmorphismStyles.css';

const { TabPane } = Tabs;

interface RetrievalMethod {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  performance: string;
  speed: string;
}

// 检索方法选项列表 - 现代化设计
const retrievalMethods: RetrievalMethod[] = [
  {
    label: 'HNSW (层次可导航小世界图)',
    value: 'hnsw',
    description: '推荐选项，高效准确，适合大多数场景',
    icon: <Layers size={18} />,
    color: '#52c41a',
    performance: '高精度',
    speed: '中等'
  },
  {
    label: 'IVF-FLAT (反向文件系统)',
    value: 'ivf_flat',
    description: '检索速度适中，准确度高，内存占用适中',
    icon: <Database size={18} />,
    color: '#1890ff',
    performance: '平衡',
    speed: '快速'
  },
  {
    label: 'IVF-PQ (乘积量化)',
    value: 'ivf_pq',
    description: '高度压缩，适合超大规模数据，但准确度较低',
    icon: <Settings size={18} />,
    color: '#fa8c16',
    performance: '中等',
    speed: '快速'
  },
  {
    label: 'IVF-HNSW (混合索引)',
    value: 'ivf_hnsw',
    description: '结合HNSW和IVF优点，内存占用适中，适合中等规模',
    icon: <Brain size={18} />,
    color: '#722ed1',
    performance: '中高',
    speed: '中等'
  },
  {
    label: 'FLAT (暴力检索)',
    value: 'flat',
    description: '最准确但速度最慢，仅适合小规模向量库',
    icon: <Search size={18} />,
    color: '#eb2f96',
    performance: '最高',
    speed: '慢'
  }
];

// 现代化样式配置
const styles = {
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '20px',
    fontWeight: 700,
  },
  infoCard: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    borderRadius: '12px',
    border: 'none',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  tabCard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    minHeight: '400px',
  },
  cardHeader: {
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    color: '#374151',
  },
  tabContent: {
    padding: '24px',
    minHeight: '400px',
  },
  retrievalCard: {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    borderRadius: '16px',
    border: 'none',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  knowledgeGraphCard: {
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    borderRadius: '16px',
    border: 'none',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  dangerCard: {
    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
    borderRadius: '16px',
    border: 'none',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  methodOption: {
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '16px 18px',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box' as const,
    minHeight: '80px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  methodOptionSelected: {
    borderRadius: '12px',
    border: '2px solid #52c41a',
    background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(135, 208, 104, 0.1) 100%)',
    padding: '16px 18px',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(82, 196, 26, 0.2)',
    width: '100%',
    boxSizing: 'border-box' as const,
    minHeight: '80px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderColor: 'transparent',
    color: 'white',
    borderRadius: '12px',
    height: '40px',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
    minWidth: '120px',
  },
  cancelButton: {
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
    color: '#6c757d',
    height: '40px',
    fontSize: '14px',
    fontWeight: 500,
    minWidth: '100px',
  },
  dangerButton: {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
    borderColor: 'transparent',
    color: 'white',
    borderRadius: '12px',
    height: '40px',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 6px 20px rgba(255, 71, 87, 0.3)',
  },
  sectionIcon: {
    fontSize: '18px',
    marginRight: '10px',
  },
  tabStyle: {
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    padding: '16px',
  },
  infoItem: {
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    color: 'white',
  },
  infoItemId: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  infoItemFiles: {
    background: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)',
  },
  infoItemVectors: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  infoItemTime: {
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    color: '#333',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
  },
  statusAvailable: {
    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    color: 'white',
  },
  statusUnavailable: {
    background: 'rgba(0, 0, 0, 0.1)',
    color: '#666',
  }
};

interface KnowledgeBaseSettingsModalProps {
  open: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeBaseItem | null;
  onUpdateKnowledgeBase: (id: string, values: any) => void;
  onDeleteKnowledgeBase: (id: string) => void;
}

const KnowledgeBaseSettingsModal: React.FC<KnowledgeBaseSettingsModalProps> = ({ 
  open, 
  onClose, 
  knowledgeBase,
  onUpdateKnowledgeBase,
  onDeleteKnowledgeBase
}) => {
  const [form] = Form.useForm();
  const { showToast } = useToast();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [confirmRevectorizeVisible, setConfirmRevectorizeVisible] = useState(false);
  const [originalRetrievalMethod, setOriginalRetrievalMethod] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('hnsw');
  
  // 初始化表单
  useEffect(() => {
    if (knowledgeBase) {
      const method = knowledgeBase.retrievalMethod || 'hnsw';
      form.setFieldsValue({
        retrievalMethod: method,
      });
      setOriginalRetrievalMethod(method);
      setSelectedMethod(method);
    }
  }, [form, knowledgeBase]);

  // 处理表单提交
  const handleSubmit = () => {
    if (!knowledgeBase) return;
    
    form.validateFields().then(values => {
      // 判断是否需要重新向量化
      const needsRevectorize = values.retrievalMethod !== originalRetrievalMethod;
      
      // 提交更新
      onUpdateKnowledgeBase(knowledgeBase.id, {
        ...values,
        revectorize: needsRevectorize
      });
      
      onClose();
      showToast('知识库设置已更新');
    });
  };

  // 处理删除知识库操作
  const handleDelete = () => {
    setConfirmDeleteVisible(true);
  };

  // 确认删除知识库
  const handleConfirmDelete = () => {
    if (knowledgeBase) {
      onDeleteKnowledgeBase(knowledgeBase.id);
      setConfirmDeleteVisible(false);
      onClose();
      showToast('知识库已成功删除');
    }
  };

  // 处理索引构建方式变更的取消操作
  const handleRevectorizeCancel = () => {
    setConfirmRevectorizeVisible(false);
    // 恢复原始值
    form.setFieldsValue({
      retrievalMethod: originalRetrievalMethod
    });
    setSelectedMethod(originalRetrievalMethod || 'hnsw');
  };

  // 确认索引构建方式变更
  const handleRevectorizeConfirm = () => {
    setConfirmRevectorizeVisible(false);
    // 继续提交表单即可，不需要恢复原值
  };

  // 打开知识图谱页面
  const handleOpenKnowledgeGraph = () => {
    if (knowledgeBase?.knowledgeGraph?.fileName) {
      // 这里添加打开知识图谱的逻辑
      console.log('打开知识图谱:', knowledgeBase.knowledgeGraph.fileName);
      showToast('正在打开知识图谱...');
    }
  };

  // 创建模态框标题
  const modalTitle = (
    <div style={styles.modalTitle}>
      <Settings size={24} className="mr-3" />
      <span>知识库设置</span>
    </div>
  );

  // 自定义底部按钮
  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button style={styles.cancelButton} onClick={onClose}>
        取消
      </Button>
      <Button style={styles.primaryButton} onClick={handleSubmit}>
        <CheckOutlined className="mr-2" />
        保存设置
      </Button>
    </div>
  );

  return (
    <>
      <GlassmorphismModal
        open={open}
        onClose={onClose}
        title={modalTitle}
        width={700}
        footer={modalFooter}
      >
        {/* 知识库信息卡片 */}
        <div style={styles.infoGrid}>
          <div style={{...styles.infoItem, ...styles.infoItemId}}>
            <div className="text-white text-xs mb-1 opacity-90">知识库ID</div>
            <div className="font-mono text-xs truncate" title={knowledgeBase?.id}>
              {knowledgeBase?.id?.split('-')[0]}...
            </div>
          </div>
          <div style={{...styles.infoItem, ...styles.infoItemFiles}}>
            <div className="text-white text-xs mb-1 opacity-90">文件数量</div>
            <div className="text-base font-semibold">{knowledgeBase?.fileCount || 0}</div>
          </div>
          <div style={{...styles.infoItem, ...styles.infoItemVectors}}>
            <div className="text-white text-xs mb-1 opacity-90">向量规模</div>
            <div className="text-base font-semibold">{knowledgeBase?.vectorCount || 0}</div>
          </div>
          <div style={{...styles.infoItem, ...styles.infoItemTime}}>
            <div className="text-gray-600 text-xs mb-1">更新时间</div>
            <div className="text-xs">{new Date(knowledgeBase?.lastUpdated || '').toLocaleDateString()}</div>
          </div>
        </div>

        {/* 标签页卡片 */}
        <Card style={styles.tabCard} headStyle={styles.cardHeader}>
          <Tabs 
            defaultActiveKey="retrieval" 
            style={styles.tabStyle}
            tabBarStyle={{ 
              borderBottom: '2px solid rgba(0, 0, 0, 0.06)',
              marginBottom: '0'
            }}
          >
            <TabPane 
              tab={
                <span className="flex items-center px-2">
                  <RocketOutlined style={{color: '#52c41a', marginRight: '8px'}} />
                  检索设置
                </span>
              }
              key="retrieval"
            >
              <div style={styles.tabContent}>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    retrievalMethod: 'hnsw'
                  }}
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <RocketOutlined style={{color: '#52c41a', marginRight: '8px'}} />
                      索引构建方式
                      <Tooltip title="更改索引构建方式将导致知识库重新向量化" overlayClassName="kb-tooltip">
                        <QuestionCircleOutlined className="ml-2 text-gray-400" />
                      </Tooltip>
                    </h3>
                    <Form.Item name="retrievalMethod" rules={[{ required: true, message: '请选择索引构建方式' }]}>
                      <Radio.Group 
                        onChange={(e) => {
                          setSelectedMethod(e.target.value);
                          // 当检索方式变更时立即显示确认对话框
                          if (e.target.value !== originalRetrievalMethod) {
                            setConfirmRevectorizeVisible(true);
                          }
                        }}
                        value={selectedMethod}
                        style={{ width: '100%' }}
                      >
                        <div className="space-y-2">
                          {retrievalMethods.map(method => (
                            <div 
                              key={method.value}
                              style={selectedMethod === method.value ? styles.methodOptionSelected : styles.methodOption}
                              onClick={() => {
                                setSelectedMethod(method.value);
                                form.setFieldsValue({ retrievalMethod: method.value });
                                if (method.value !== originalRetrievalMethod) {
                                  setConfirmRevectorizeVisible(true);
                                }
                              }}
                            >
                              <Radio value={method.value} style={{ width: '100%', margin: 0 }}>
                                <div className="flex items-start w-full">
                                  <div className="flex items-center justify-center w-6 h-6 mr-3" style={{ marginTop: '2px' }}>
                                    <span style={{ color: method.color }}>
                                      {method.icon}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-semibold text-gray-800 text-base">{method.label}</span>
                                      <div className="flex items-center space-x-6 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                        <span className="flex items-center">
                                          <span className="text-gray-400 mr-1">性能:</span>
                                          <span className="font-medium">{method.performance}</span>
                                        </span>
                                        <span className="flex items-center">
                                          <span className="text-gray-400 mr-1">速度:</span>
                                          <span className="font-medium">{method.speed}</span>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed">{method.description}</div>
                                  </div>
                                </div>
                              </Radio>
                            </div>
                          ))}
                        </div>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span className="flex items-center px-2">
                  <ProjectOutlined style={{color: '#722ed1', marginRight: '8px'}} />
                  知识图谱
                </span>
              }
              key="knowledgeGraph"
            >
              <div style={styles.tabContent}>
                <Card 
                  style={styles.knowledgeGraphCard}
                  title={
                    <div className="flex items-center">
                      <Brain size={18} style={{color: '#722ed1', marginRight: '10px'}} />
                      <span>知识图谱状态</span>
                    </div>
                  }
                  headStyle={styles.cardHeader}
                >
                  {knowledgeBase?.knowledgeGraph?.available ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span style={{...styles.statusBadge, ...styles.statusAvailable}}>
                          <CheckOutlined className="mr-1" />
                          已生成
                        </span>
                        <div className="text-sm text-gray-600">
                          此知识库已成功生成知识图谱
                        </div>
                      </div>
                      
                      {knowledgeBase.knowledgeGraph.lastGenerated && (
                        <div className="text-sm text-gray-500">
                          <InfoCircleOutlined className="mr-2" />
                          生成时间: {new Date(knowledgeBase.knowledgeGraph.lastGenerated).toLocaleString()}
                        </div>
                      )}
                      {knowledgeBase.knowledgeGraph.fileName && (
                        <Button 
                          style={styles.primaryButton}
                          onClick={handleOpenKnowledgeGraph}
                          icon={<ProjectOutlined />}
                        >
                          查看知识图谱
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span style={{...styles.statusBadge, ...styles.statusUnavailable}}>
                          <WarningOutlined className="mr-1" />
                          未生成
                        </span>
                        <div className="text-sm text-gray-600">
                          此知识库尚未生成知识图谱
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm text-blue-800">
                          <InfoCircleOutlined className="mr-2" />
                          知识图谱可以帮助您更直观地理解知识库中的实体关系，提供可视化的知识结构图。
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabPane>
            
            <TabPane 
              tab={
                <span className="flex items-center px-2">
                  <DeleteOutlined style={{color: '#ff4d4f', marginRight: '8px'}} />
                  危险操作
                </span>
              }
              key="danger"
            >
              <div style={styles.tabContent}>
                <Card 
                  style={styles.dangerCard}
                  title={
                    <div className="flex items-center">
                      <AlertTriangle size={18} style={{color: '#ff4d4f', marginRight: '10px'}} />
                      <span>危险区域</span>
                    </div>
                  }
                  headStyle={styles.cardHeader}
                >
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-700 font-medium mb-2">
                        <ExclamationCircleOutlined className="mr-2" />
                        数据删除警告
                      </div>
                      <div className="text-red-600 text-sm mb-4">
                        以下操作将导致数据永久丢失，请谨慎操作。删除后无法恢复！
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Button 
                        style={styles.dangerButton}
                        onClick={handleDelete} 
                        icon={<DeleteOutlined />}
                      >
                        删除此知识库
                      </Button>
                      <div className="text-xs text-gray-500 pt-2">
                        删除后，知识库中的所有文件和向量数据将被永久移除
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </GlassmorphismModal>

      {/* 确认删除的对话框 */}
      <GlassmorphismModal
        open={confirmDeleteVisible}
        onClose={() => setConfirmDeleteVisible(false)}
        title={
          <div className="flex items-center text-red-600">
            <ExclamationCircleOutlined className="mr-2" />
            确认删除
          </div>
        }
        footer={
          <div className="flex justify-end space-x-3">
            <Button style={styles.cancelButton} onClick={() => setConfirmDeleteVisible(false)}>
              取消
            </Button>
            <Button style={styles.dangerButton} onClick={handleConfirmDelete}>
              确认删除
            </Button>
          </div>
        }
        width={450}
      >
        <div className="space-y-4">
          <div className="text-gray-700">
            确定要删除知识库 <strong className="text-red-600">{knowledgeBase?.name}</strong> 吗？
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-red-700 text-sm">
              <WarningOutlined className="mr-2" />
              删除后，其中的所有文件和向量数据将被<strong>永久移除</strong>，无法恢复。
            </div>
          </div>
        </div>
      </GlassmorphismModal>

      {/* 确认更改索引构建方式对话框 */}
      <GlassmorphismModal
        open={confirmRevectorizeVisible}
        onClose={() => {}} // 禁止点击空白处关闭，强制用户选择
        title={
          <div className="flex items-center text-orange-600">
            <ExclamationCircleOutlined className="mr-2" />
            确认更改索引构建方式
          </div>
        }
        footer={
          <div className="flex justify-end space-x-3">
            <Button style={styles.cancelButton} onClick={handleRevectorizeCancel}>
              取消
            </Button>
            <Button style={styles.primaryButton} onClick={handleRevectorizeConfirm}>
              确认更改
            </Button>
          </div>
        }
        width={500}
      >
        <div className="space-y-4">
          <div className="text-gray-700">
            更改索引构建方式将导致知识库<strong className="text-orange-600">重新向量化</strong>，在此过程中可能会临时影响检索功能。
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-orange-700 text-sm">
              <InfoCircleOutlined className="mr-2" />
              重新向量化过程可能需要几分钟到几小时，具体取决于数据量大小。
            </div>
          </div>
          <div className="text-gray-600">确定要继续吗？</div>
        </div>
      </GlassmorphismModal>
    </>
  );
};

export default KnowledgeBaseSettingsModal;
