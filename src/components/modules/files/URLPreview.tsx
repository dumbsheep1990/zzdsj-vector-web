import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Clock, 
  FileText, 
  Eye, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  Calendar,
  User,
  Hash,
  Target
} from 'lucide-react';

// 网页元数据
interface URLMetadata {
  url: string;
  title: string;
  description: string;
  siteName: string;
  author: string;
  publishDate: string;
  contentType: string;
  contentLength: number;
  language: string;
  favicon: string;
  image: string;
  keywords: string[];
  // 内容分析
  wordCount: number;
  paragraphCount: number;
  headingCount: number;
  linkCount: number;
  imageCount: number;
  // 技术信息
  canonical: string;
  robotsDirective: string;
  lastModified: string;
  responseTime: number;
  statusCode: number;
  // SEO信息
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

interface URLPreviewProps {
  url: string;
  onMetadataLoaded?: (metadata: URLMetadata) => void;
  apiBaseUrl?: string;
  className?: string;
}

/**
 * URL预览组件
 * 获取并显示网页的元数据和内容信息
 */
const URLPreview: React.FC<URLPreviewProps> = ({
  url,
  onMetadataLoaded,
  apiBaseUrl = 'http://localhost:8082',
  className = ''
}) => {
  const [metadata, setMetadata] = useState<URLMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取URL元数据
  const fetchMetadata = async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiBaseUrl}/api/v1/url/preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url })
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMetadata(result.metadata);
          onMetadataLoaded?.(result.metadata);
        } else {
          throw new Error(result.message || 'Failed to fetch metadata');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('获取URL预览失败:', err);
      setError(err instanceof Error ? err.message : '获取预览失败');
    } finally {
      setLoading(false);
    }
  };

  // URL变化时重新获取元数据
  useEffect(() => {
    if (url) {
      fetchMetadata();
    }
  }, [url]);

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN');
    } catch {
      return dateString;
    }
  };

  // 获取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>正在获取页面信息...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">获取预览失败</span>
        </div>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={fetchMetadata}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm"
        >
          重试
        </button>
      </div>
    );
  }

  if (!metadata) return null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* 页面预览卡片 */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* 网站图标和缩略图 */}
          <div className="flex-shrink-0">
            {metadata.image ? (
              <img
                src={metadata.image}
                alt="Page preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* 页面信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start space-x-2 mb-2">
              {metadata.favicon && (
                <img
                  src={metadata.favicon}
                  alt="Favicon"
                  className="w-4 h-4 mt-1"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {metadata.title || 'Untitled'}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  {getDomain(metadata.url)}
                  {metadata.siteName && ` • ${metadata.siteName}`}
                </p>
                {metadata.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {metadata.description}
                  </p>
                )}
              </div>
              <a
                href={metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="在新窗口打开"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="border-t border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 基本信息 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>基本信息</span>
            </h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">内容类型</dt>
                <dd className="text-gray-900">{metadata.contentType || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">内容大小</dt>
                <dd className="text-gray-900">
                  {metadata.contentLength ? formatFileSize(metadata.contentLength) : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">语言</dt>
                <dd className="text-gray-900">{metadata.language || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">状态码</dt>
                <dd className={`${metadata.statusCode === 200 ? 'text-green-600' : 'text-red-600'}`}>
                  {metadata.statusCode}
                </dd>
              </div>
            </dl>
          </div>

          {/* 内容分析 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>内容分析</span>
            </h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">字数统计</dt>
                <dd className="text-gray-900">{metadata.wordCount?.toLocaleString() || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">段落数</dt>
                <dd className="text-gray-900">{metadata.paragraphCount || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">标题数</dt>
                <dd className="text-gray-900">{metadata.headingCount || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">链接数</dt>
                <dd className="text-gray-900">{metadata.linkCount || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">图片数</dt>
                <dd className="text-gray-900">{metadata.imageCount || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* 时间信息 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>时间信息</span>
            </h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">发布日期</dt>
                <dd className="text-gray-900">{formatDate(metadata.publishDate)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">最后修改</dt>
                <dd className="text-gray-900">{formatDate(metadata.lastModified)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">响应时间</dt>
                <dd className="text-gray-900">
                  {metadata.responseTime ? `${metadata.responseTime}ms` : '-'}
                </dd>
              </div>
              {metadata.author && (
                <div>
                  <dt className="text-gray-500">作者</dt>
                  <dd className="text-gray-900">{metadata.author}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* 关键词 */}
        {metadata.keywords && metadata.keywords.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-1">
              <Hash className="w-4 h-4" />
              <span>关键词</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {metadata.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SEO信息 */}
        {(metadata.metaTitle || metadata.metaDescription || metadata.ogTitle) && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>SEO信息</span>
            </h4>
            <div className="space-y-3 text-sm">
              {metadata.metaTitle && metadata.metaTitle !== metadata.title && (
                <div>
                  <dt className="text-gray-500 font-medium">Meta标题</dt>
                  <dd className="text-gray-900 mt-1">{metadata.metaTitle}</dd>
                </div>
              )}
              {metadata.metaDescription && metadata.metaDescription !== metadata.description && (
                <div>
                  <dt className="text-gray-500 font-medium">Meta描述</dt>
                  <dd className="text-gray-900 mt-1">{metadata.metaDescription}</dd>
                </div>
              )}
              {metadata.ogTitle && metadata.ogTitle !== metadata.title && (
                <div>
                  <dt className="text-gray-500 font-medium">OpenGraph标题</dt>
                  <dd className="text-gray-900 mt-1">{metadata.ogTitle}</dd>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 导入预测 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">导入预测</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-700">
                {Math.ceil((metadata.wordCount || 0) / 200)}
              </div>
              <div className="text-blue-600">预估分块数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-700">
                {Math.ceil((metadata.contentLength || 0) / 1024)}
              </div>
              <div className="text-blue-600">预估Token数(K)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-700">
                {metadata.responseTime && metadata.responseTime < 3000 ? '快' : 
                 metadata.responseTime && metadata.responseTime < 10000 ? '中' : '慢'}
              </div>
              <div className="text-blue-600">抓取速度</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-700">
                {metadata.linkCount ? '支持' : '不支持'}
              </div>
              <div className="text-blue-600">深度爬取</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLPreview;