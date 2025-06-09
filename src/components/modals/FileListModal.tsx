import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import Files from '../../pages/Files';
import { zIndexLevels } from '../../styles/zIndexLevels';
import { motion, AnimatePresence } from 'framer-motion';

interface FileListModalProps {
    isOpen: boolean;
    onClose: () => void;
    knowledgeBaseName: string;
}

const FileListModal: React.FC<FileListModalProps> = ({ isOpen, onClose, knowledgeBaseName }) => {
    const [key, setKey] = useState(0); // 为Files组件创建key，确保每次打开都是新实例
    
    // 每次isOpen变为true时，更新key创建新的Files实例
    useEffect(() => {
        if (isOpen) {
            setKey(prevKey => prevKey + 1);
        }
    }, [isOpen]);
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    key="modal-container"
                    className="fixed inset-0"
                    style={{ zIndex: zIndexLevels.MODAL }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* 背景遮罩 */}
                    <motion.div
                        className="absolute inset-0 bg-gray-900/50 backdrop-blur-md"
                        onClick={onClose}
                        style={{ zIndex: zIndexLevels.MODAL_BACKDROP }}
                    />
                    
                    {/* 模态框内容 */}
                    <motion.div
                        className="absolute inset-4 bg-white/95 rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-gray-200 border border-white/90"
                        style={{ 
                            zIndex: zIndexLevels.MODAL,
                            backdropFilter: 'blur(8px)'
                        }}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 5 }}
                        transition={{ 
                            type: 'spring',
                            damping: 25, 
                            stiffness: 300 
                        }}
                    >
                        {/* 标题栏 */}
                        <div 
                            className="flex items-center justify-between px-6 py-4"
                            style={{ 
                                background: 'linear-gradient(125deg, rgba(56,178,172,0.9) 0%, rgba(49,130,206,0.95) 43%, rgba(79,70,229,0.9) 100%)',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-lg mr-3 backdrop-blur-sm">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-white tracking-tight flex items-center">
                                    {knowledgeBaseName} 
                                    <span className="mx-2 text-white/50">•</span> 
                                    <span className="text-lg font-normal text-white/90">文件列表</span>
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/30 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center backdrop-blur-sm"
                                title="关闭"
                            >
                                <X size={18} className="text-white" />
                            </button>
                        </div>
                        
                        {/* 文件列表内容区域 */}
                        <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50/80 to-white/90">
                            {/* 为Files组件提供key确保每次打开获得全新实例 */}
                            <Files key={key} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FileListModal;
