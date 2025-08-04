import React, { useState } from 'react';
import { Upload, FileText, Settings, Monitor } from 'lucide-react';
import EnhancedDocumentUploader from './EnhancedDocumentUploader';
import FileUploaderWithSSE from './FileUploaderWithSSE';

/**
 * 文档上传器使用示例
 * 展示不同上传组件的使用方法
 */
const UploadExample: React.FC = () => {
  const [showEnhancedUploader, setShowEnhancedUploader] = useState(false);
  const [showBasicUploader, setShowBasicUploader] = useState(false);

  const handleUploadComplete = (results: any[]) => {
    console.log('上传完成:', results);
    alert(`成功上传 ${results.length} 个文件`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            文档上传器示例
          </h1>
          <p className="text-gray-600">
            展示集成切分策略选择和SSE进度监控的文档上传功能
          </p>
        </div>

        {/* 功能特性卡片 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 增强版上传器 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  增强版文档上传器
                </h3>
                <p className="text-sm text-gray-500">
                  集成策略选择和详细监控
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Settings className="w-4 h-4 text-green-500" />
                <span>智能切分策略选择</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Monitor className="w-4 h-4 text-blue-500" />
                <span>实时进度监控和SSE</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>详细处理信息显示</span>
              </div>
            </div>

            <button
              onClick={() => setShowEnhancedUploader(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              打开增强版上传器
            </button>
          </div>

          {/* 基础版上传器 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  基础版文档上传器
                </h3>
                <p className="text-sm text-gray-500">
                  简化界面，基础功能
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Upload className="w-4 h-4 text-green-500" />
                <span>基础文件上传</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Monitor className="w-4 h-4 text-blue-500" />
                <span>SSE进度监控</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Settings className="w-4 h-4 text-gray-400" />
                <span>简单设置选项</span>
              </div>
            </div>

            <button
              onClick={() => setShowBasicUploader(true)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              打开基础版上传器
            </button>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            使用说明
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">支持的文件类型</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PDF 文档</li>
                <li>• Word 文档 (.doc, .docx)</li>
                <li>• 文本文件 (.txt)</li>
                <li>• Markdown 文件 (.md)</li>
                <li>• 其他文档格式</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">切分策略选项</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>基础Token分块</strong>: 快速处理，适合通用文档</li>
                <li>• <strong>语义分块</strong>: 保持语义完整性</li>
                <li>• <strong>智能自适应</strong>: 自动优化分块策略</li>
                <li>• <strong>自定义配置</strong>: 手动调整参数</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Monitor className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">实时进度监控</p>
                <p>通过SSE (Server-Sent Events) 技术，您可以实时查看文档处理的详细进度，包括提取、分块、向量化、存储等各个阶段的状态。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 配置示例 */}
        <div className="mt-6 bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">代码示例</h3>
          <pre className="text-sm text-green-300 overflow-x-auto">
{`// 使用增强版文档上传器
import EnhancedDocumentUploader from './EnhancedDocumentUploader';

<EnhancedDocumentUploader
  knowledgeBaseId="your_kb_id"
  userId="your_user_id"
  messageServiceUrl="http://localhost:8089"
  apiBaseUrl="http://localhost:8082"
  maxSize={10}
  multiple={true}
  onUploadComplete={(results) => {
    console.log('上传完成:', results);
  }}
  onClose={() => setShowUploader(false)}
/>`}
          </pre>
        </div>
      </div>

      {/* 增强版上传器 */}
      {showEnhancedUploader && (
        <EnhancedDocumentUploader
          knowledgeBaseId="example_kb_123"
          userId="example_user_456"
          messageServiceUrl="http://localhost:8089"
          apiBaseUrl="http://localhost:8082"
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowEnhancedUploader(false)}
          maxSize={10}
          multiple={true}
          allowedTypes={['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
        />
      )}

      {/* 基础版上传器 */}
      {showBasicUploader && (
        <FileUploaderWithSSE
          knowledgeBaseId="example_kb_123"
          userId="example_user_456"
          messageServiceUrl="http://localhost:8089"
          apiBaseUrl="http://localhost:8082"
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowBasicUploader(false)}
          maxSize={10}
          multiple={true}
          allowedTypes={['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
        />
      )}
    </div>
  );
};

export default UploadExample;