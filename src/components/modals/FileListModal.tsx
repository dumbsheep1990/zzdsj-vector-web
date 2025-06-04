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
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
        }
    }, [isOpen]);
    
    const handleAnimationComplete = () => {
        if (!isOpen) {
            setMounted(false);
        }
    };
    
    if (!mounted && !isOpen) return null;
    
    return (
        <div className="fixed inset-0" style={{ zIndex: zIndexLevels.MODAL }}>
            {/* Backdrop with improved blur effect */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-gray-900/50 backdrop-blur-md"
                        onClick={onClose}
                        style={{ zIndex: zIndexLevels.MODAL_BACKDROP }}
                    />
                )}
            </AnimatePresence>
            
            {/* Modal with enhanced design */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ 
                            type: 'spring',
                            damping: 25, 
                            stiffness: 300 
                        }}
                        onAnimationComplete={handleAnimationComplete}
                        className="absolute inset-4 bg-white/95 rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-gray-200 border border-white/90"
                        style={{ 
                            zIndex: zIndexLevels.MODAL,
                            backdropFilter: 'blur(8px)'
                        }}
                    >
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
                                <div>
                                    <h2 className="text-xl font-semibold text-white tracking-tight flex items-center">
                                        {knowledgeBaseName} 
                                        <span className="mx-2 text-white/50">•</span> 
                                        <span className="text-lg font-normal text-white/90">文件列表</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/30 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center backdrop-blur-sm"
                                    title="关闭"
                                >
                                    <X size={18} className="text-white" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50/80 to-white/90">
                            <Files />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileListModal;
