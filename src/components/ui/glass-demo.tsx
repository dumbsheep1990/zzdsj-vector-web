import React from 'react';
import { GlassEffect, GlassNavBar } from './glass-effect';

const GlassDemo: React.FC = () => {
  return (
    <div 
      className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          磨砂玻璃效果演示
        </h1>

        {/* 基础磨砂效果卡片 */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassEffect variant="subtle" className="p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">轻微磨砂</h3>
            <p className="text-gray-600">适用于轻量级界面元素</p>
          </GlassEffect>

          <GlassEffect variant="default" className="p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">标准磨砂</h3>
            <p className="text-gray-600">平衡的视觉效果</p>
          </GlassEffect>

          <GlassEffect variant="strong" className="p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">强烈磨砂</h3>
            <p className="text-gray-600">突出重要内容</p>
          </GlassEffect>
        </div>

        {/* 导航栏演示 */}
        <div className="relative h-64 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-xl font-bold">背景内容区域</div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0">
            <GlassNavBar>
              <div className="flex justify-between items-center px-6 py-4">
                <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  返回
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  继续
                </button>
              </div>
            </GlassNavBar>
          </div>
        </div>

        {/* 实际应用示例 */}
        <GlassEffect variant="strong" className="p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">实际应用示例</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">✨ 特点</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 高级backdrop-filter效果</li>
                <li>• 多层级透明度</li>
                <li>• 渐变遮罩支持</li>
                <li>• 响应式设计</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 使用场景</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 底部导航栏</li>
                <li>• 浮动面板</li>
                <li>• 模态对话框</li>
                <li>• 信息卡片</li>
              </ul>
            </div>
          </div>
        </GlassEffect>
      </div>
    </div>
  );
};

export { GlassDemo }; 