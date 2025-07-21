import React from 'react';
import { FileText, Sparkles, ArrowRight, Brain, Activity, BarChart3 } from 'lucide-react';

// NextReport服务配置
const NEXTREPORT_SERVICE_URL = 'http://localhost:7788/';

const NextReportInterface: React.FC = React.memo(() => {
  // 在新窗口中打开NextReport
  const openInNewWindow = () => {
    window.open(NEXTREPORT_SERVICE_URL, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-6 h-full overflow-hidden">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4"
            style={{
              background: 'linear-gradient(to right, #7dd3fc, #c4b5fd)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <FileText className="w-8 h-8" style={{ color: 'white' }} />
          </div>
          
          {/* 直接使用内联样式，不用任何Tailwind文本颜色类 */}
          <h1 style={{ 
            color: '#111827', 
            fontSize: '2.25rem', 
            fontWeight: 'bold',
            marginBottom: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            NextReport
          </h1>
          
          <p style={{ 
            color: '#374151', 
            fontSize: '1.125rem',
            marginBottom: '1rem',
            maxWidth: '42rem',
            margin: '0 auto 1rem',
            lineHeight: '1.75',
            fontWeight: '500'
          }}>
            基于多智能体协作的智能报告生成平台
          </p>
          
          <p style={{ 
            color: '#4b5563', 
            marginBottom: '1.5rem',
            maxWidth: '48rem',
            margin: '0 auto 1.5rem'
          }}>
            利用先进的AI技术和多智能体协作，为您提供专业的深度研究、数据分析和可视化报告创作服务
          </p>

          {/* 启动按钮 */}
          <button
            onClick={openInNewWindow}
            className="group inline-flex items-center px-8 py-3 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(to right, #7dd3fc, #c4b5fd)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #38bdf8, #a78bfa)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #7dd3fc, #c4b5fd)';
            }}
          >
            <Sparkles className="w-5 h-5 mr-3 group-hover:animate-pulse" style={{ color: 'white' }} />
            <span style={{ color: 'white' }}>启动 NextReport</span>
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" style={{ color: 'white' }} />
          </button>
        </div>

        {/* 核心功能特性 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(to right, #7dd3fc, #93c5fd)' }}
              >
                <Brain className="w-6 h-6" style={{ color: 'white' }} />
              </div>
              <h3 style={{ 
                color: '#111827', 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                智能分析
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.75' 
              }}>
                AI驱动的深度数据分析和洞察发现
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(to right, #6ee7b7, #86efac)' }}
              >
                <FileText className="w-6 h-6" style={{ color: 'white' }} />
              </div>
              <h3 style={{ 
                color: '#111827', 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                报告生成
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.75' 
              }}>
                自动化的专业报告创作和格式化
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(to right, #c4b5fd, #ddd6fe)' }}
              >
                <Activity className="w-6 h-6" style={{ color: 'white' }} />
              </div>
              <h3 style={{ 
                color: '#111827', 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                多智能体
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.75' 
              }}>
                协作式智能体工作流程管理
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(to right, #fdba74, #fed7aa)' }}
              >
                <BarChart3 className="w-6 h-6" style={{ color: 'white' }} />
              </div>
              <h3 style={{ 
                color: '#111827', 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                数据可视化
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.75' 
              }}>
                丰富的图表和可视化展示
              </p>
            </div>
          </div>
        </div>

        {/* 使用流程 */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
          <div className="text-center mb-6">
            <h2 style={{ 
              color: '#111827', 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}>
              简单三步，开始创作
            </h2>
            <p style={{ color: '#4b5563' }}>
              轻松开启您的智能报告创作之旅
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="relative">
                <div 
                  className="w-16 h-16 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(to right, #7dd3fc, #93c5fd)' }}
                >
                  1
                </div>
                {/* 连接线 - 正确的连接 */}
                <div 
                  className="hidden md:block absolute top-8 left-1/2 h-0.5"
                  style={{ 
                    background: 'linear-gradient(to right, #bfdbfe, #a7f3d0)',
                    width: '80%',
                    transform: 'translateX(2rem)'
                  }}
                ></div>
              </div>
              <h3 style={{ 
                color: '#111827', 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                点击启动
              </h3>
              <p style={{ 
                color: '#4b5563', 
                fontSize: '0.875rem' 
              }}>
                点击上方按钮在新窗口中打开NextReport
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative">
                <div 
                  className="w-16 h-16 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(to right, #6ee7b7, #86efac)' }}
                >
                  2
                </div>
                {/* 连接线 - 正确的连接 */}
                <div 
                  className="hidden md:block absolute top-8 left-1/2 h-0.5"
                  style={{ 
                    background: 'linear-gradient(to right, #a7f3d0, #ddd6fe)',
                    width: '80%',
                    transform: 'translateX(2rem)'
                  }}
                ></div>
              </div>
              <h3 style={{ 
                color: '#111827', 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                创建项目
              </h3>
              <p style={{ 
                color: '#4b5563', 
                fontSize: '0.875rem' 
              }}>
                在NextReport中创建新的研究项目
              </p>
            </div>
            
            <div className="text-center group">
              <div 
                className="w-16 h-16 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(to right, #c4b5fd, #ddd6fe)' }}
              >
                3
              </div>
              <h3 style={{ 
                color: '#111827', 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                生成报告
              </h3>
              <p style={{ 
                color: '#4b5563', 
                fontSize: '0.875rem' 
              }}>
                AI智能体协作完成报告生成
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NextReportInterface;