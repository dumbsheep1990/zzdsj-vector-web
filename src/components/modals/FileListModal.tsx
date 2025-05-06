import React from 'react';
import { X, FileText } from 'lucide-react';
import Files from '../../pages/Files';
import { zIndexLevels } from '../../styles/zIndexLevels';

interface FileListModalProps {
    isOpen: boolean;
    onClose: () => void;
    knowledgeBaseName: string;
}

const FileListModal: React.FC<FileListModalProps> = ({ isOpen, onClose, knowledgeBaseName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0" style={{ zIndex: zIndexLevels.MODAL }}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                style={{ zIndex: zIndexLevels.MODAL_BACKDROP }}
            />
            
            {/* Modal */}
            <div 
                className="absolute inset-4 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
                style={{ zIndex: zIndexLevels.MODAL }}
            >
                <div 
                    className="flex items-center justify-between p-5"
                    style={{ 
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        borderBottom: '1px solid rgba(229, 231, 235, 0.2)'
                    }}
                >
                    <div className="flex items-center">
                        <FileText className="h-6 w-6 text-white mr-3" />
                        <h2 className="text-xl font-semibold text-white">
                            {knowledgeBaseName} - 文件列表
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={22} className="text-white" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Files />
                </div>
            </div>
        </div>
    );
};

export default FileListModal;
