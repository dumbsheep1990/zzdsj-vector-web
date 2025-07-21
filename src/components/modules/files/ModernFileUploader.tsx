import React from 'react';
import { X } from 'lucide-react';
import { Component as ModernUploader } from '@/components/ui/file-upload';

// Following TypeScript standards with explicit typing
interface ModernFileUploaderProps {
  onUploadComplete?: (files: File[]) => void;
  onClose?: () => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
}

/**
 * ModernFileUploader - Adapter component that integrates the new UI with existing system
 * 
 * Follows Single Responsibility Principle by focusing only on adapting the new UI
 * to the existing codebase interface, without modifying core functionality
 */
const ModernFileUploader: React.FC<ModernFileUploaderProps> = ({
  onUploadComplete,
  onClose,
  allowedTypes = ['*/*'],
  maxSize = 10,
  multiple = true
}) => {
  // Container with z-index fixes to ensure proper layering
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-[10000]">
        {/* Close button for the modal */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-lg z-50 text-gray-700 hover:text-red-500 transition-colors"
          aria-label="关闭"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Modern file uploader component */}
        <div className="max-h-[90vh] overflow-auto">
          <ModernUploader />
        </div>
      </div>
    </div>
  );
};

export default ModernFileUploader;
