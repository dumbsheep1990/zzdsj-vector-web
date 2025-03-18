import React from 'react';
import { X } from 'lucide-react';
import Files from '../../pages/Files';

interface FileListModalProps {
    isOpen: boolean;
    onClose: () => void;
    knowledgeBaseName: string;
}

const FileListModal: React.FC<FileListModalProps> = ({ isOpen, onClose, knowledgeBaseName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {knowledgeBaseName} - 文件列表
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="h-[calc(100%-4rem)] overflow-auto">
                    <Files />
                </div>
            </div>
        </div>
    );
};

export default FileListModal;
