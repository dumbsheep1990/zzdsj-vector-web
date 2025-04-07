import React, { useState } from 'react';
import { List, Button, Input, Modal, Upload, message, Pagination, Tag, Space, Tooltip, Popconfirm } from 'antd';
import { 
  FileTextOutlined, 
  UploadOutlined, 
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileMarkdownOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { mockDocuments, QADocument } from '../../../utils/mockData';
import { formatFileSize, formatDate } from '../../../utils/format';

interface DocumentListProps {
  assistantId: string;
  onSelectDocument: (documentId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ assistantId, onSelectDocument }) => {
  const [documents, setDocuments] = useState<QADocument[]>(mockDocuments);
  const [searchText, setSearchText] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 文件上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/documents/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  // 删除文档
  const handleDelete = (documentId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除文档将同时删除所有关联的问题，是否继续？',
      okText: '确认',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => {
        setDocuments(documents.filter(doc => doc.id !== documentId));
        message.success('文档已删除');
      }
    });
  };

  // 过滤文档
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // 分页数据
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 获取文档状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'success';
      case 'processing':
        return 'processing';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取文件类型图标
  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FilePdfOutlined className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined className="text-blue-500" />;
      case 'md':
        return <FileMarkdownOutlined className="text-purple-500" />;
      default:
        return <FileOutlined className="text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 搜索和上传区域 */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="搜索文档..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1"
          />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} type="primary">
              上传
            </Button>
          </Upload>
        </div>
      </div>

      {/* 文档列表 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <List
          dataSource={paginatedDocuments}
          renderItem={doc => (
            <div 
              key={doc.id}
              className="hover:bg-gray-50 cursor-pointer border-l-4 border-transparent hover:border-blue-500 transition-colors"
              onClick={() => {
                setSelectedDocumentId(doc.id);
                onSelectDocument(doc.id);
              }}
            >
              <div className="p-4">
                {/* 文件名和操作按钮行 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getFileTypeIcon(doc.type)}
                    <span className="font-medium text-gray-900 truncate">
                      {doc.title}
                    </span>
                  </div>
                  <Space>
                    <Tooltip title="编辑">
                      <Button 
                        type="text" 
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // 处理编辑
                        }}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="确定要删除这个文档吗？"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      onCancel={(e) => e?.stopPropagation()}
                    >
                      <Tooltip title="删除">
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={e => e.stopPropagation()}
                        />
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                </div>

                {/* 文件信息行 */}
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <Tag color={getStatusColor(doc.status)}>
                    {doc.status === 'processed' ? '已处理' : 
                     doc.status === 'processing' ? '处理中' : '处理失败'}
                  </Tag>
                  <span>{formatFileSize(Number(doc.size))}</span>
                  <span>{formatDate(doc.uploadTime)}</span>
                </div>

                {/* 标签行 */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {doc.tags.map((tag, index) => (
                      <Tag key={index} className="text-xs">{tag}</Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          locale={{
            emptyText: (
              <div className="py-8 text-center text-gray-400">
                <FileTextOutlined style={{ fontSize: 32 }} />
                <div className="mt-2">暂无文档</div>
              </div>
            )
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredDocuments.length,
            onChange: setCurrentPage,
            size: 'small',
            className: 'px-4'
          }}
        />
      </div>
    </div>
  );
}; 