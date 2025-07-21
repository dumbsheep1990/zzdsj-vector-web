"use client";

import * as React from "react";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { File, FileSpreadsheet, X } from "lucide-react";
import { toast } from "sonner";

import { 
  Button, 
  Card, 
  Progress,
  cn
} from "@/components/ui/shared";

// 明确的类型定义，遵循TypeScript标准
export interface ModernFileUploaderModalProps {
  onUploadComplete?: (files: File[]) => void;
  onClose?: () => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  title?: string;
}

// 文件状态类型，明确定义状态结构
type FileState = {
  file: File;
  progress: number;
  uploading: boolean;
  error?: string;
};

/**
 * 现代文件上传模态框组件
 * 提供拖放上传、文件预览、进度显示等功能
 */
export function ModernFileUploaderModal({
  onUploadComplete,
  onClose,
  allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ],
  maxSize = 10,
  multiple = false,
  title = "文件上传"
}: ModernFileUploaderModalProps) {
  // 状态管理 - 遵循SRP原则，分离UI状态和业务状态
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 验证文件类型和大小 - 单一职责
  const validateFile = (file: File): { valid: boolean; reason?: string } => {
    // 验证文件类型
    if (allowedTypes.length && !allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        reason: "文件类型不支持，请上传CSV，XLSX或XLS文件。" 
      };
    }

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      return { 
        valid: false, 
        reason: `文件大小超过限制 ${maxSize}MB。` 
      };
    }

    // 验证是否已添加相同文件
    if (files.some(f => f.file.name === file.name && f.file.size === file.size)) {
      return { 
        valid: false, 
        reason: "已添加相同的文件。" 
      };
    }

    return { valid: true };
  };

  // 处理文件添加 - 单一职责
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles: FileState[] = [];
    
    Array.from(fileList).forEach(file => {
      const validation = validateFile(file);
      
      if (validation.valid) {
        newFiles.push({
          file,
          progress: 0,
          uploading: true
        });
      } else if (validation.reason) {
        toast.error(validation.reason, {
          position: "bottom-right",
          duration: 3000,
        });
      }
    });

    if (newFiles.length === 0) return;
    
    // 如果不允许多文件，替换现有文件
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);

    // 模拟上传进度
    newFiles.forEach((fileState, idx) => {
      const interval = setInterval(() => {
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          const fileIndex = multiple ? files.length + idx : idx;
          
          if (fileIndex >= newFiles.length) {
            clearInterval(interval);
            return prevFiles;
          }
          
          const newProgress = newFiles[fileIndex].progress + 5;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            newFiles[fileIndex] = { ...newFiles[fileIndex], progress: 100, uploading: false };
          } else {
            newFiles[fileIndex] = { ...newFiles[fileIndex], progress: newProgress };
          }
          
          return newFiles;
        });
      }, 200);
    });
  };

  // 事件处理函数 - 分离关注点
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    // 重置input以允许选择相同文件
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  // 删除文件 - 单一职责
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // 提交上传 - 单一职责
  const handleSubmit = () => {
    if (onUploadComplete) {
      onUploadComplete(files.map(f => f.file));
    }
    toast.success("文件上传成功！", {
      position: "bottom-right",
      duration: 3000,
    });
  };

  // 格式化文件大小 - 单一职责的工具函数
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // 获取文件图标 - 单一职责的工具函数
  const getFileIcon = (file: File) => {
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    return ["csv", "xlsx", "xls"].includes(fileExt) ? (
      <FileSpreadsheet className="h-5 w-5 text-foreground" />
    ) : (
      <File className="h-5 w-5 text-foreground" />
    );
  };

  // 计算是否有任何文件正在上传
  const isUploading = files.some(file => file.uploading);
  // 计算是否所有文件都已完成上传
  const allUploaded = files.length > 0 && files.every(file => file.progress === 100);

  // UI 渲染
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-[10000]">
        {/* 标题栏 */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-500/30"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 max-h-[calc(90vh-80px)] overflow-auto">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* 拖放区域 */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
                isDragging 
                  ? "bg-primary/5 border-primary" 
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <File
                className={cn(
                  "mx-auto h-12 w-12 mb-4 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
              <h3 className="text-lg font-medium">
                {isDragging ? "释放文件以上传" : "拖拽文件到此处"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">或者</p>
              <div className="mt-3">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative"
                >
                  浏览文件
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={allowedTypes.join(",")}
                    multiple={multiple}
                  />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                支持的文件类型: CSV, XLSX, XLS · 文件大小限制: {maxSize}MB
              </p>
            </div>

            {/* 文件列表 */}
            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">文件列表</h3>
                <div className="space-y-3">
                  {files.map((fileState, index) => (
                    <Card 
                      key={`${fileState.file.name}-${index}`} 
                      className="relative p-4 gap-4 bg-muted"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center space-x-2.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                          {getFileIcon(fileState.file)}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {fileState.file.name}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatFileSize(fileState.file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Progress value={fileState.progress} className="h-1.5" />
                        <span className="text-xs text-muted-foreground">
                          {fileState.progress}%
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" type="button" onClick={onClose}>
                取消
              </Button>
              <Button 
                type="button" 
                disabled={files.length === 0 || isUploading || !allUploaded}
                onClick={handleSubmit}
              >
                完成上传
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModernFileUploaderModal;
