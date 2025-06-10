import React, { useState } from 'react';
import { Typography, Input, Select, Button } from 'antd';
import { PlusIcon, XIcon } from 'lucide-react';

const { Title, Text } = Typography;

interface ApiKeyFormData {
  name: string;
  description: string;
  permissions: string[];
}

interface CreateApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ApiKeyFormData) => void;
  loading?: boolean;
}

const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: '',
    description: '',
    permissions: []
  });

  // 防止背景滚动
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return;
    }
    onSubmit(formData);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', permissions: [] });
    onClose();
  };

  if (!open) return null;

  const permissionOptions = [
    { value: 'read', label: '🔍 读取权限 - 查看数据' },
    { value: 'search', label: '🔎 搜索权限 - 执行搜索' },
    { value: 'chat', label: '💬 对话权限 - AI对话' },
    { value: 'upload', label: '📤 上传权限 - 上传文件' },
    { value: 'manage', label: '⚙️ 管理权限 - 管理配置' }
  ];

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}
        onClick={handleClose}
      >
        <div
          style={{
            width: '600px',
            maxWidth: '100%',
            maxHeight: '90vh',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '24px',
            boxShadow: '0 20px 64px rgba(37, 99, 235, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid rgba(37, 99, 235, 0.15)',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)'
                }}
              >
                <PlusIcon size={24} color="white" />
              </div>
              <div>
                <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
                  创建新的API Key
                </Title>
                <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  创建用于访问系统的API密钥
                </Text>
              </div>
            </div>
            <Button
              type="text"
              icon={<XIcon size={20} />}
              onClick={handleClose}
              style={{
                border: 'none',
                background: 'rgba(107, 114, 128, 0.1)',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* 内容区域 */}
          <div
            style={{
              padding: '32px',
              flex: 1,
              overflowY: 'auto',
              background: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Key名称 */}
              <div>
                <Text 
                  style={{ 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    color: '#374151',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Key名称 <span style={{ color: '#ef4444' }}>*</span>
                </Text>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="输入API Key名称..."
                  size="large"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(37, 99, 235, 0.15)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              {/* 描述 */}
              <div>
                <Text 
                  style={{ 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    color: '#374151',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  描述
                </Text>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="输入API Key用途描述..."
                  size="large"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(37, 99, 235, 0.15)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              {/* 权限选择 */}
              <div>
                <Text 
                  style={{ 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    color: '#374151',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  权限
                </Text>
                <Select
                  mode="multiple"
                  value={formData.permissions}
                  onChange={(value) => setFormData(prev => ({ ...prev, permissions: value }))}
                  placeholder="选择权限..."
                  size="large"
                  options={permissionOptions}
                  style={{
                    width: '100%',
                  }}
                  dropdownStyle={{
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.2)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div
            style={{
              padding: '24px 32px',
              borderTop: '1px solid rgba(37, 99, 235, 0.15)',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <Button
              onClick={handleClose}
              size="large"
              style={{
                borderRadius: '12px',
                border: '2px solid rgba(107, 114, 128, 0.2)',
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#6b7280',
                fontWeight: 500,
                height: '48px',
                padding: '0 24px',
                transition: 'all 0.3s ease'
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!formData.name.trim() || loading}
              loading={loading}
              size="large"
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                border: 'none',
                fontWeight: 500,
                height: '48px',
                padding: '0 32px',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              生成API Key
            </Button>
          </div>
        </div>
      </div>

      {/* 添加动画样式 */}
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .ant-select-selector {
          border-radius: 12px !important;
          border: 2px solid rgba(37, 99, 235, 0.15) !important;
          background: rgba(255, 255, 255, 0.8) !important;
          transition: all 0.3s ease !important;
        }

        .ant-select-focused .ant-select-selector {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
        }

        .ant-select-selection-item {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.1)) !important;
          border: 1px solid rgba(37, 99, 235, 0.2) !important;
          border-radius: 8px !important;
          color: #2563eb !important;
          font-weight: 500 !important;
        }
      `}</style>
    </>
  );
};

export default CreateApiKeyModal; 