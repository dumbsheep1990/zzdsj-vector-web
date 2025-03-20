import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/Dialog";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";
import { Plus, GripVertical, Edit2, Trash2 } from 'lucide-react';

interface Chunk {
  id: string;
  content: string;
  tokens: number;
  index: number;
}

interface ChunkAdjustDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialChunks: Chunk[];
  onSave: (chunks: Chunk[]) => void;
}

const ChunkAdjustDialog: React.FC<ChunkAdjustDialogProps> = ({
  isOpen,
  onClose,
  initialChunks,
  onSave
}) => {
  const [chunks, setChunks] = useState<Chunk[]>(initialChunks);
  const [editingChunkId, setEditingChunkId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // 处理拖拽排序
  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newChunks = [...chunks];
      const draggedItem = newChunks[dragItem.current];
      // 删除拖拽项
      newChunks.splice(dragItem.current, 1);
      // 插入到新位置
      newChunks.splice(dragOverItem.current, 0, draggedItem);
      // 更新索引
      newChunks.forEach((chunk, index) => {
        chunk.index = index;
      });
      setChunks(newChunks);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // 添加新分块
  const handleAddChunk = () => {
    const newChunk: Chunk = {
      id: `chunk-${Date.now()}`,
      content: '',
      tokens: 0,
      index: chunks.length
    };
    setChunks([...chunks, newChunk]);
    setEditingChunkId(newChunk.id);
    setEditContent('');
  };

  // 删除分块
  const handleDeleteChunk = (id: string) => {
    const newChunks = chunks.filter(chunk => chunk.id !== id);
    // 更新索引
    newChunks.forEach((chunk, index) => {
      chunk.index = index;
    });
    setChunks(newChunks);
  };

  // 编辑分块
  const handleEditChunk = (chunk: Chunk) => {
    setEditingChunkId(chunk.id);
    setEditContent(chunk.content);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingChunkId) {
      const newChunks = chunks.map(chunk => {
        if (chunk.id === editingChunkId) {
          return {
            ...chunk,
            content: editContent,
            tokens: Math.ceil(editContent.length / 4) // 简单估算token数量
          };
        }
        return chunk;
      });
      setChunks(newChunks);
      setEditingChunkId(null);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingChunkId(null);
  };

  // 保存所有更改
  const handleSaveAll = () => {
    onSave(chunks);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <span className="bg-emerald-100 text-emerald-700 p-1 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </span>
            调整文件分块
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-1">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">分块列表</h3>
              <div className="text-sm text-gray-500">共 {chunks.length} 个分块</div>
            </div>
            
            {chunks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                此文件暂无分块，点击下方按钮添加
              </div>
            ) : (
              <div className="space-y-3">
                {chunks.map((chunk, index) => (
                  <div 
                    key={chunk.id}
                    className={`bg-white border ${editingChunkId === chunk.id ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-200'} rounded-lg shadow-sm overflow-hidden`}
                    draggable={editingChunkId !== chunk.id}
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {editingChunkId === chunk.id ? (
                      <div className="p-4">
                        <Textarea 
                          value={editContent}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                          className="min-h-[120px] mb-3"
                          placeholder="输入分块内容..."
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            取消
                          </Button>
                          <Button size="sm" onClick={handleSaveEdit}>
                            保存
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
                          <div className="flex items-center">
                            <GripVertical className="h-4 w-4 text-gray-400 mr-2 cursor-move" />
                            <span className="text-sm font-medium">分块 {index + 1}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{chunk.tokens} tokens</span>
                            <button 
                              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                              onClick={() => handleEditChunk(chunk)}
                            >
                              <Edit2 className="h-4 w-4 text-gray-500" />
                            </button>
                            <button 
                              className="p-1 hover:bg-red-100 hover:text-red-500 rounded-md transition-colors"
                              onClick={() => handleDeleteChunk(chunk.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 text-sm text-gray-700 max-h-[120px] overflow-auto">
                          {chunk.content || <span className="text-gray-400 italic">空内容</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleAddChunk}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            添加分块
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>取消</Button>
            <Button onClick={handleSaveAll} className="bg-emerald-600 hover:bg-emerald-700">
              保存更改
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChunkAdjustDialog;
