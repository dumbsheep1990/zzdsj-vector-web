"use client";

import React, { useState } from 'react';
import ModernFileUploaderModal from "@/components/modules/files/ModernFileUploaderModal";
import { Button } from "@/components/ui/shared";
import { toast } from "sonner";

// 演示页面组件
export default function UploadDemo() {
  const [showUploader, setShowUploader] = useState(false);

  // 处理上传完成事件
  const handleUploadComplete = (files: File[]) => {
    console.log("Files uploaded:", files);
    toast.success(`成功上传 ${files.length} 个文件`, {
      description: files.map(f => f.name).join(", "),
      position: "bottom-right"
    });
    setShowUploader(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">现代文件上传演示</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          这个页面展示了基于Radix UI和Tailwind CSS构建的现代文件上传模态组件。
          点击下方按钮打开上传对话框。
        </p>
        
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={() => setShowUploader(true)}
            className="w-fit"
          >
            打开文件上传器
          </Button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            <h3 className="font-medium mb-2">组件特性:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>拖放文件上传</li>
              <li>文件类型验证</li>
              <li>文件大小限制</li>
              <li>上传进度显示</li>
              <li>文件预览卡片</li>
              <li>完全支持深色模式</li>
              <li>响应式设计</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 文件上传模态框 */}
      {showUploader && (
        <ModernFileUploaderModal
          onClose={() => setShowUploader(false)}
          onUploadComplete={handleUploadComplete}
          allowedTypes={[
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ]}
          maxSize={10}
          multiple={true}
          title="上传文档"
        />
      )}
    </div>
  );
}
