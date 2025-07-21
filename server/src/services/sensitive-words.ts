import { logger } from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

// 类型定义
interface SensitiveWord {
  id: string;
  word: string;
  category: string;
  level: 'low' | 'medium' | 'high';
  source: 'manual' | 'import' | 'system';
  replaceWord?: string;
  isActive: boolean;
  hitCount: number;
  lastHitAt?: string;
  createTime: string;
  updateTime: string;
  createdBy: string;
}

interface SensitiveWordCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  color: string;
  isActive: boolean;
  createTime: string;
  updateTime: string;
  createdBy: string;
}

interface SensitiveWordLibrary {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  totalWords: number;
  categories: string[];
  level: 'low' | 'medium' | 'high';
  mode: 'enabled' | 'disabled';
  uploadUser: string;
  importStatus: 'pending' | 'processing' | 'completed' | 'failed';
  importProgress: number;
  importError?: string;
  isActive: boolean;
  createTime: string;
  updateTime: string;
  createdBy: string;
}

interface SensitiveWordConfig {
  id: string;
  configName: string;
  enabled: boolean;
  filterType: 'block' | 'replace' | 'warn';
  replaceChar: string;
  autoBlockEnabled: boolean;
  logDetection: boolean;
  whitelistEnabled: boolean;
  blacklistEnabled: boolean;
  customRulesEnabled: boolean;
  maxViolations: number;
  violationWindowHours: number;
  blockDurationHours: number;
  isDefault: boolean;
  createTime: string;
  updateTime: string;
  createdBy: string;
}

interface DetectionLog {
  id: string;
  wordId: string;
  originalText: string;
  detectedWord: string;
  context: string;
  action: 'block' | 'replace' | 'warn';
  userId: string;
  source: string;
  ipAddress: string;
  userAgent: string;
  createTime: string;
}

export class SensitiveWordService {
  private useMock: boolean;
  private sensitiveWordCache: Map<string, SensitiveWord> = new Map();
  private configCache: SensitiveWordConfig | null = null;
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

  constructor() {
    this.useMock = process.env.USE_MOCK_DATA === 'true';
    this.initializeMockData();
  }

  private initializeMockData() {
    // 模拟数据初始化
    const mockWords: SensitiveWord[] = [
      {
        id: '1',
        word: '测试敏感词1',
        category: '政治',
        level: 'high',
        source: 'manual',
        isActive: true,
        hitCount: 5,
        lastHitAt: '2024-01-15T10:30:00Z',
        createTime: '2024-01-15T10:00:00Z',
        updateTime: '2024-01-15T10:00:00Z',
        createdBy: 'admin'
      },
      {
        id: '2',
        word: '测试敏感词2',
        category: '暴力',
        level: 'medium',
        source: 'import',
        isActive: true,
        hitCount: 2,
        createTime: '2024-01-16T10:00:00Z',
        updateTime: '2024-01-16T10:00:00Z',
        createdBy: 'admin'
      },
      {
        id: '3',
        word: '测试敏感词3',
        category: '色情',
        level: 'high',
        source: 'system',
        isActive: false,
        hitCount: 0,
        createTime: '2024-01-17T10:00:00Z',
        updateTime: '2024-01-17T10:00:00Z',
        createdBy: 'system'
      }
    ];

    mockWords.forEach(word => {
      this.sensitiveWordCache.set(word.id, word);
    });
  }

  /**
   * 获取敏感词列表
   */
  async getSensitiveWords(filters: {
    page?: number;
    limit?: number;
    category?: string;
    level?: 'low' | 'medium' | 'high';
    keyword?: string;
    isActive?: boolean;
  }): Promise<{ words: SensitiveWord[]; total: number }> {
    if (this.useMock) {
      logger.info('使用模拟数据获取敏感词列表');
      
      let words = Array.from(this.sensitiveWordCache.values());
      
      // 应用过滤器
      if (filters.category) {
        words = words.filter(word => word.category === filters.category);
      }
      
      if (filters.level) {
        words = words.filter(word => word.level === filters.level);
      }
      
      if (filters.keyword) {
        words = words.filter(word => 
          word.word.includes(filters.keyword!) || 
          word.category.includes(filters.keyword!)
        );
      }
      
      if (filters.isActive !== undefined) {
        words = words.filter(word => word.isActive === filters.isActive);
      }
      
      // 排序
      words.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime());
      
      // 分页
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;
      const paginatedWords = words.slice(offset, offset + limit);
      
      return {
        words: paginatedWords,
        total: words.length
      };
    }
    
    // 真实数据库查询逻辑
    throw new ApiError(501, '敏感词数据库查询功能待实现');
  }

  /**
   * 添加敏感词
   */
  async addSensitiveWord(wordData: Omit<SensitiveWord, 'id' | 'hitCount' | 'createTime' | 'updateTime'>): Promise<SensitiveWord> {
    if (this.useMock) {
      logger.info('使用模拟数据添加敏感词');
      
      const newWord: SensitiveWord = {
        id: Date.now().toString(),
        ...wordData,
        hitCount: 0,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      
      this.sensitiveWordCache.set(newWord.id, newWord);
      this.clearCache();
      
      return newWord;
    }
    
    throw new ApiError(501, '敏感词添加功能待实现');
  }

  /**
   * 更新敏感词
   */
  async updateSensitiveWord(id: string, updateData: Partial<SensitiveWord>): Promise<SensitiveWord | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新敏感词: ${id}`);
      
      const existingWord = this.sensitiveWordCache.get(id);
      if (!existingWord) {
        return null;
      }
      
      const updatedWord = {
        ...existingWord,
        ...updateData,
        updateTime: new Date().toISOString()
      };
      
      this.sensitiveWordCache.set(id, updatedWord);
      this.clearCache();
      
      return updatedWord;
    }
    
    throw new ApiError(501, '敏感词更新功能待实现');
  }

  /**
   * 删除敏感词
   */
  async deleteSensitiveWord(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除敏感词: ${id}`);
      
      const deleted = this.sensitiveWordCache.delete(id);
      if (deleted) {
        this.clearCache();
      }
      
      return deleted;
    }
    
    throw new ApiError(501, '敏感词删除功能待实现');
  }

  /**
   * 批量导入敏感词
   */
  async importSensitiveWords(filePath: string, options: {
    category?: string;
    level: 'low' | 'medium' | 'high';
    createdBy?: string;
  }): Promise<{ success: boolean; imported: number; failed: number }> {
    if (this.useMock) {
      logger.info('使用模拟数据导入敏感词');
      
      return new Promise((resolve, reject) => {
        const words: string[] = [];
        
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            // 假设CSV格式为：word,category,level
            if (row.word) {
              words.push(row.word);
            }
          })
          .on('end', async () => {
            try {
              let imported = 0;
              let failed = 0;
              
              for (const word of words) {
                try {
                  await this.addSensitiveWord({
                    word: word.trim(),
                    category: options.category || '未分类',
                    level: options.level,
                    source: 'import',
                    isActive: true,
                    createdBy: options.createdBy || 'system'
                  });
                  imported++;
                } catch (error) {
                  failed++;
                  logger.error(`导入敏感词失败: ${word}`, error);
                }
              }
              
              // 清理临时文件
              fs.unlinkSync(filePath);
              
              resolve({ success: true, imported, failed });
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    }
    
    throw new ApiError(501, '敏感词导入功能待实现');
  }

  /**
   * 导出敏感词
   */
  async exportSensitiveWords(filters: {
    category?: string;
    level?: 'low' | 'medium' | 'high';
  }): Promise<string> {
    if (this.useMock) {
      logger.info('使用模拟数据导出敏感词');
      
      const { words } = await this.getSensitiveWords(filters);
      
      // 创建CSV内容
      const csvWriter = createObjectCsvWriter({
        path: '/tmp/sensitive-words-export.csv',
        header: [
          { id: 'word', title: '敏感词' },
          { id: 'category', title: '分类' },
          { id: 'level', title: '级别' },
          { id: 'source', title: '来源' },
          { id: 'isActive', title: '状态' },
          { id: 'hitCount', title: '命中次数' },
          { id: 'createTime', title: '创建时间' }
        ]
      });
      
      await csvWriter.writeRecords(words);
      
      const csvContent = fs.readFileSync('/tmp/sensitive-words-export.csv', 'utf8');
      fs.unlinkSync('/tmp/sensitive-words-export.csv');
      
      return csvContent;
    }
    
    throw new ApiError(501, '敏感词导出功能待实现');
  }

  /**
   * 检测文本中的敏感词
   */
  async checkText(text: string): Promise<{
    isSensitive: boolean;
    words: string[];
    suggestion: string;
  }> {
    if (this.useMock) {
      logger.info('使用模拟数据检测敏感词');
      
      const activeWords = Array.from(this.sensitiveWordCache.values())
        .filter(word => word.isActive);
      
      const detectedWords: string[] = [];
      let processedText = text;
      
      for (const wordObj of activeWords) {
        if (text.includes(wordObj.word)) {
          detectedWords.push(wordObj.word);
          
          // 更新命中次数
          wordObj.hitCount++;
          wordObj.lastHitAt = new Date().toISOString();
          
          // 根据配置进行替换
          const config = await this.getConfig();
          if (config.filterType === 'replace') {
            processedText = processedText.replace(
              new RegExp(wordObj.word, 'g'),
              config.replaceChar.repeat(wordObj.word.length)
            );
          }
        }
      }
      
      return {
        isSensitive: detectedWords.length > 0,
        words: detectedWords,
        suggestion: processedText
      };
    }
    
    throw new ApiError(501, '敏感词检测功能待实现');
  }

  /**
   * 获取敏感词分类
   */
  async getCategories(): Promise<SensitiveWordCategory[]> {
    if (this.useMock) {
      logger.info('使用模拟数据获取敏感词分类');
      
      const mockCategories: SensitiveWordCategory[] = [
        {
          id: '1',
          name: '政治',
          description: '政治相关敏感词',
          color: '#ff4d4f',
          isActive: true,
          createTime: '2024-01-15T10:00:00Z',
          updateTime: '2024-01-15T10:00:00Z',
          createdBy: 'admin'
        },
        {
          id: '2',
          name: '暴力',
          description: '暴力相关敏感词',
          color: '#ff7875',
          isActive: true,
          createTime: '2024-01-15T10:00:00Z',
          updateTime: '2024-01-15T10:00:00Z',
          createdBy: 'admin'
        },
        {
          id: '3',
          name: '色情',
          description: '色情相关敏感词',
          color: '#ffa39e',
          isActive: true,
          createTime: '2024-01-15T10:00:00Z',
          updateTime: '2024-01-15T10:00:00Z',
          createdBy: 'admin'
        }
      ];
      
      return mockCategories;
    }
    
    throw new ApiError(501, '敏感词分类获取功能待实现');
  }

  /**
   * 添加敏感词分类
   */
  async addCategory(categoryData: Omit<SensitiveWordCategory, 'id' | 'createTime' | 'updateTime'>): Promise<SensitiveWordCategory> {
    if (this.useMock) {
      logger.info('使用模拟数据添加敏感词分类');
      
      const newCategory: SensitiveWordCategory = {
        id: Date.now().toString(),
        ...categoryData,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      
      return newCategory;
    }
    
    throw new ApiError(501, '敏感词分类添加功能待实现');
  }

  /**
   * 更新敏感词分类
   */
  async updateCategory(id: string, updateData: Partial<SensitiveWordCategory>): Promise<SensitiveWordCategory | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新敏感词分类: ${id}`);
      
      // 模拟更新逻辑
      const categories = await this.getCategories();
      const existingCategory = categories.find(cat => cat.id === id);
      
      if (!existingCategory) {
        return null;
      }
      
      const updatedCategory = {
        ...existingCategory,
        ...updateData,
        updateTime: new Date().toISOString()
      };
      
      return updatedCategory;
    }
    
    throw new ApiError(501, '敏感词分类更新功能待实现');
  }

  /**
   * 删除敏感词分类
   */
  async deleteCategory(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除敏感词分类: ${id}`);
      
      // 模拟删除逻辑
      return true;
    }
    
    throw new ApiError(501, '敏感词分类删除功能待实现');
  }

  /**
   * 获取敏感词库列表
   */
  async getLibraries(filters: {
    page?: number;
    limit?: number;
    keyword?: string;
    level?: 'low' | 'medium' | 'high';
    mode?: 'enabled' | 'disabled';
  }): Promise<{ libraries: SensitiveWordLibrary[]; total: number }> {
    if (this.useMock) {
      logger.info('使用模拟数据获取敏感词库列表');
      
      const mockLibraries: SensitiveWordLibrary[] = [
        {
          id: '1',
          name: '政治敏感词库',
          description: '包含政治相关敏感词汇',
          fileName: 'politics_words.csv',
          filePath: '/data/libraries/politics_words.csv',
          fileSize: 1024 * 1024,
          totalWords: 1250,
          categories: ['政治', '政府', '官员'],
          level: 'high',
          mode: 'enabled',
          uploadUser: 'admin',
          importStatus: 'completed',
          importProgress: 100,
          isActive: true,
          createTime: '2024-01-10T10:00:00Z',
          updateTime: '2024-01-10T10:00:00Z',
          createdBy: 'admin'
        },
        {
          id: '2',
          name: '暴力词汇库',
          description: '暴力、仇恨等相关敏感词',
          fileName: 'violence_words.csv',
          filePath: '/data/libraries/violence_words.csv',
          fileSize: 512 * 1024,
          totalWords: 890,
          categories: ['暴力', '仇恨', '威胁'],
          level: 'medium',
          mode: 'enabled',
          importStatus: 'completed',
          importProgress: 100,
          isActive: true,
          createTime: '2024-01-12T10:00:00Z',
          updateTime: '2024-01-12T10:00:00Z',
          uploadUser: 'admin',
          createdBy: 'admin'
        }
      ];
      
      return {
        libraries: mockLibraries,
        total: mockLibraries.length
      };
    }
    
    throw new ApiError(501, '敏感词库获取功能待实现');
  }

  /**
   * 上传敏感词库
   */
  async uploadLibrary(file: Express.Multer.File, libraryData: any): Promise<SensitiveWordLibrary> {
    if (this.useMock) {
      logger.info('使用模拟数据上传敏感词库');
      
      const newLibrary: SensitiveWordLibrary = {
        id: Date.now().toString(),
        name: libraryData.name,
        description: libraryData.description,
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        totalWords: 0, // 将在后台处理中统计
        categories: libraryData.categories ? libraryData.categories.split(',') : [],
        level: libraryData.level || 'medium',
        mode: libraryData.mode || 'enabled',
        uploadUser: libraryData.uploadUser,
        importStatus: 'pending',
        importProgress: 0,
        isActive: true,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        createdBy: libraryData.createdBy
      };
      
      // 模拟后台处理
      setTimeout(() => {
        this.processLibraryImport(newLibrary.id);
      }, 1000);
      
      return newLibrary;
    }
    
    throw new ApiError(501, '敏感词库上传功能待实现');
  }

  /**
   * 处理词库导入（模拟后台任务）
   */
  private async processLibraryImport(libraryId: string): Promise<void> {
    logger.info(`开始处理词库导入: ${libraryId}`);
    
    // 模拟处理进度
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      logger.info(`词库导入进度: ${progress}%`);
    }
    
    logger.info(`词库导入完成: ${libraryId}`);
  }

  /**
   * 更新敏感词库
   */
  async updateLibrary(id: string, updateData: Partial<SensitiveWordLibrary>): Promise<SensitiveWordLibrary | null> {
    if (this.useMock) {
      logger.info(`使用模拟数据更新敏感词库: ${id}`);
      
      // 模拟更新逻辑
      const { libraries } = await this.getLibraries({});
      const existingLibrary = libraries.find(lib => lib.id === id);
      
      if (!existingLibrary) {
        return null;
      }
      
      const updatedLibrary = {
        ...existingLibrary,
        ...updateData,
        updateTime: new Date().toISOString()
      };
      
      return updatedLibrary;
    }
    
    throw new ApiError(501, '敏感词库更新功能待实现');
  }

  /**
   * 删除敏感词库
   */
  async deleteLibrary(id: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除敏感词库: ${id}`);
      
      // 模拟删除逻辑
      return true;
    }
    
    throw new ApiError(501, '敏感词库删除功能待实现');
  }

  /**
   * 获取敏感词配置
   */
  async getConfig(): Promise<SensitiveWordConfig> {
    if (this.useMock) {
      if (!this.configCache) {
        logger.info('使用模拟数据获取敏感词配置');
        
        this.configCache = {
          id: '1',
          configName: 'default',
          enabled: true,
          filterType: 'replace',
          replaceChar: '*',
          autoBlockEnabled: true,
          logDetection: true,
          whitelistEnabled: false,
          blacklistEnabled: true,
          customRulesEnabled: false,
          maxViolations: 10,
          violationWindowHours: 24,
          blockDurationHours: 24,
          isDefault: true,
          createTime: '2024-01-15T10:00:00Z',
          updateTime: '2024-01-15T10:00:00Z',
          createdBy: 'system'
        };
      }
      
      return this.configCache;
    }
    
    throw new ApiError(501, '敏感词配置获取功能待实现');
  }

  /**
   * 更新敏感词配置
   */
  async updateConfig(configData: Partial<SensitiveWordConfig>): Promise<SensitiveWordConfig> {
    if (this.useMock) {
      logger.info('使用模拟数据更新敏感词配置');
      
      const currentConfig = await this.getConfig();
      
      this.configCache = {
        ...currentConfig,
        ...configData,
        updateTime: new Date().toISOString()
      };
      
      return this.configCache;
    }
    
    throw new ApiError(501, '敏感词配置更新功能待实现');
  }

  /**
   * 获取检测日志
   */
  async getDetectionLogs(filters: {
    page?: number;
    limit?: number;
    userId?: string;
    startDate?: string;
    endDate?: string;
    action?: 'block' | 'replace' | 'warn';
  }): Promise<{ logs: DetectionLog[]; total: number }> {
    if (this.useMock) {
      logger.info('使用模拟数据获取检测日志');
      
      const mockLogs: DetectionLog[] = [
        {
          id: '1',
          wordId: '1',
          originalText: '这是一个包含测试敏感词1的文本',
          detectedWord: '测试敏感词1',
          context: '测试上下文',
          action: 'replace',
          userId: 'user1',
          source: 'chat',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          createTime: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          wordId: '2',
          originalText: '另一个包含测试敏感词2的文本',
          detectedWord: '测试敏感词2',
          context: '测试上下文2',
          action: 'warn',
          userId: 'user2',
          source: 'comment',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          createTime: '2024-01-15T11:00:00Z'
        }
      ];
      
      return {
        logs: mockLogs,
        total: mockLogs.length
      };
    }
    
    throw new ApiError(501, '检测日志获取功能待实现');
  }

  /**
   * 清除缓存
   */
  async clearCache(): Promise<void> {
    logger.info('清除敏感词缓存');
    
    this.sensitiveWordCache.clear();
    this.configCache = null;
    this.lastCacheUpdate = 0;
  }

  /**
   * 记录检测日志
   */
  async logDetection(logData: {
    wordId: string;
    originalText: string;
    detectedWord: string;
    context: string;
    action: 'block' | 'replace' | 'warn';
    userId: string;
    source: string;
    ipAddress: string;
    userAgent: string;
  }): Promise<void> {
    if (this.useMock) {
      logger.info('记录敏感词检测日志', logData);
      return;
    }
    
    throw new ApiError(501, '检测日志记录功能待实现');
  }
}
