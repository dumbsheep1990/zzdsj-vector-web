import React from 'react';
import { Button, Space, Tooltip, Divider } from 'antd';
import {
  SaveOutlined,
  EditOutlined,
  DownloadOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  CheckOutlined,
  FileSearchOutlined,
  SettingOutlined
} from '@ant-design/icons';

interface DefaultToolbarProps {
  handleSave: () => void;
  handleEdit: () => void;
  handleExport: () => void;
  handleImport: () => void;
  handlePublish: () => void;
  handleValidate: () => void;
}

const DefaultToolbar: React.FC<DefaultToolbarProps> = ({
  handleSave,
  handleEdit,
  handleExport,
  handleImport,
  handlePublish,
  handleValidate
}) => {
  return (
    <div className="editor-toolbar">
      <div className="toolbar-left">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
        >
          保存
        </Button>
        <Button
          icon={<EditOutlined />}
          onClick={handleEdit}
        >
          编辑信息
        </Button>
        <Divider type="vertical" />
        <Button
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          导出
        </Button>
        <Button
          icon={<UploadOutlined />}
          onClick={handleImport}
        >
          导入
        </Button>
        <Divider type="vertical" />
        <Button 
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={handlePublish}
        >
          发布
        </Button>
        <Button
          icon={<CheckOutlined />}
          onClick={handleValidate}
        >
          验证
        </Button>
      </div>
      <div className="toolbar-right">
        <Space>
          <Tooltip title="查看文档">
            <Button 
              icon={<FileSearchOutlined />}
              onClick={() => {}}
            />
          </Tooltip>
          <Tooltip title="高级设置">
            <Button 
              icon={<SettingOutlined />}
              onClick={() => {}}
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

export default DefaultToolbar; 