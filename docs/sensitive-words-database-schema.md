# 敏感词管理系统数据库设计

## 概述

本文档描述了敏感词管理系统的数据库表结构设计，包括敏感词管理、分类管理、词库管理、检测日志、配置管理等功能。

## 数据库表结构

### 1. 敏感词分类表 (sensitive_word_categories)

用于管理敏感词的分类，支持层级结构。

```sql
CREATE TABLE sensitive_word_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES sensitive_word_categories(id),
    color VARCHAR(7) DEFAULT '#1890ff',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
```

**字段说明：**
- `id`: 主键，自增
- `name`: 分类名称，唯一
- `description`: 分类描述
- `parent_id`: 父分类ID，支持层级结构
- `color`: 分类颜色，用于UI显示
- `is_active`: 是否启用
- `created_at`: 创建时间
- `updated_at`: 更新时间
- `created_by`: 创建者

### 2. 敏感词库表 (sensitive_word_libraries)

管理敏感词库文件，支持CSV文件导入。

```sql
CREATE TABLE sensitive_word_libraries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    total_words INTEGER DEFAULT 0,
    level VARCHAR(20) DEFAULT 'medium' CHECK (level IN ('low', 'medium', 'high')),
    mode VARCHAR(20) DEFAULT 'enabled' CHECK (mode IN ('enabled', 'disabled')),
    upload_user VARCHAR(100),
    import_status VARCHAR(20) DEFAULT 'pending' CHECK (import_status IN ('pending', 'processing', 'completed', 'failed')),
    import_progress INTEGER DEFAULT 0,
    import_error TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
```

**字段说明：**
- `id`: 主键，自增
- `name`: 词库名称
- `description`: 词库描述
- `file_name`: 原始文件名
- `file_path`: 文件存储路径
- `file_size`: 文件大小（字节）
- `total_words`: 词汇总数
- `level`: 危险级别（low/medium/high）
- `mode`: 启用模式（enabled/disabled）
- `upload_user`: 上传用户
- `import_status`: 导入状态
- `import_progress`: 导入进度（0-100）
- `import_error`: 导入错误信息

### 3. 敏感词表 (sensitive_words)

存储具体的敏感词信息。

```sql
CREATE TABLE sensitive_words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES sensitive_word_categories(id),
    library_id INTEGER REFERENCES sensitive_word_libraries(id),
    level VARCHAR(20) DEFAULT 'medium' CHECK (level IN ('low', 'medium', 'high')),
    source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'system')),
    replace_word VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    hit_count INTEGER DEFAULT 0,
    last_hit_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
```

**字段说明：**
- `id`: 主键，自增
- `word`: 敏感词内容
- `category_id`: 分类ID
- `library_id`: 词库ID（如果来自词库导入）
- `level`: 危险级别
- `source`: 来源（manual/import/system）
- `replace_word`: 替换词（可选）
- `is_active`: 是否启用
- `hit_count`: 命中次数
- `last_hit_at`: 最后命中时间

### 4. 敏感词库分类关联表 (sensitive_word_library_categories)

词库与分类的多对多关联。

```sql
CREATE TABLE sensitive_word_library_categories (
    id SERIAL PRIMARY KEY,
    library_id INTEGER NOT NULL REFERENCES sensitive_word_libraries(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES sensitive_word_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(library_id, category_id)
);
```

### 5. 敏感词检测日志表 (sensitive_word_detection_logs)

记录敏感词检测日志，用于审计和分析。

```sql
CREATE TABLE sensitive_word_detection_logs (
    id SERIAL PRIMARY KEY,
    word_id INTEGER REFERENCES sensitive_words(id),
    original_text TEXT,
    detected_word VARCHAR(255),
    context TEXT,
    action VARCHAR(50) CHECK (action IN ('block', 'replace', 'warn')),
    user_id VARCHAR(100),
    source VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**字段说明：**
- `id`: 主键，自增
- `word_id`: 敏感词ID
- `original_text`: 原始文本
- `detected_word`: 检测到的敏感词
- `context`: 上下文
- `action`: 采取的行动（block/replace/warn）
- `user_id`: 用户ID
- `source`: 来源（系统模块）
- `ip_address`: IP地址
- `user_agent`: 用户代理

### 6. 敏感词配置表 (sensitive_word_configs)

管理敏感词过滤的配置。

```sql
CREATE TABLE sensitive_word_configs (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT true,
    filter_type VARCHAR(20) DEFAULT 'replace' CHECK (filter_type IN ('block', 'replace', 'warn')),
    replace_char VARCHAR(10) DEFAULT '*',
    auto_block_enabled BOOLEAN DEFAULT true,
    log_detection BOOLEAN DEFAULT true,
    whitelist_enabled BOOLEAN DEFAULT false,
    blacklist_enabled BOOLEAN DEFAULT true,
    custom_rules_enabled BOOLEAN DEFAULT false,
    max_violations INTEGER DEFAULT 10,
    violation_window_hours INTEGER DEFAULT 24,
    block_duration_hours INTEGER DEFAULT 24,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
```

### 7. 白名单表 (sensitive_word_whitelist)

管理敏感词白名单，白名单中的词不会被过滤。

```sql
CREATE TABLE sensitive_word_whitelist (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
```

### 8. 用户违规记录表 (user_violation_records)

记录用户违规行为，用于自动封禁等功能。

```sql
CREATE TABLE user_violation_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    violation_type VARCHAR(50) DEFAULT 'sensitive_word',
    violation_count INTEGER DEFAULT 1,
    last_violation_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    block_until TIMESTAMP,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 数据库视图

### 1. 敏感词统计视图 (sensitive_word_statistics)

提供各分类敏感词的统计信息。

```sql
CREATE VIEW sensitive_word_statistics AS
SELECT 
    c.name as category_name,
    c.id as category_id,
    COUNT(sw.id) as total_words,
    COUNT(CASE WHEN sw.is_active = true THEN 1 END) as active_words,
    COUNT(CASE WHEN sw.level = 'high' THEN 1 END) as high_level_words,
    COUNT(CASE WHEN sw.level = 'medium' THEN 1 END) as medium_level_words,
    COUNT(CASE WHEN sw.level = 'low' THEN 1 END) as low_level_words,
    SUM(COALESCE(sw.hit_count, 0)) as total_hits
FROM sensitive_word_categories c
LEFT JOIN sensitive_words sw ON c.id = sw.category_id
GROUP BY c.id, c.name
ORDER BY total_words DESC;
```

## 数据库函数

### 1. 敏感词检测函数

```sql
-- 检测文本中的敏感词
SELECT * FROM detect_sensitive_words('待检测的文本');
```

### 2. 敏感词替换函数

```sql
-- 替换文本中的敏感词
SELECT replace_sensitive_words('待处理的文本', '*') as filtered_text;
```

### 3. 敏感词检测日志记录函数

```sql
-- 记录敏感词检测日志
SELECT log_sensitive_word_detection(
    word_id, original_text, detected_word, context, action,
    user_id, source, ip_address, user_agent
);
```

## 索引优化

系统为以下字段创建了索引以提高查询性能：

- `sensitive_words.word` - 全文搜索索引
- `sensitive_words.level` - 级别查询索引
- `sensitive_words.is_active` - 状态查询索引
- `sensitive_word_detection_logs.word_id` - 检测日志关联索引
- `sensitive_word_detection_logs.user_id` - 用户检测日志索引
- `sensitive_word_detection_logs.created_at` - 时间查询索引

## 数据完整性

1. 外键约束确保数据关联的完整性
2. 检查约束确保枚举值的有效性
3. 唯一约束防止重复数据
4. 触发器自动更新时间戳

## 使用示例

### 1. 添加敏感词分类

```sql
INSERT INTO sensitive_word_categories (name, description, color, created_by)
VALUES ('新分类', '分类描述', '#ff0000', 'admin');
```

### 2. 添加敏感词

```sql
INSERT INTO sensitive_words (word, category_id, level, source, created_by)
VALUES ('敏感词', 1, 'high', 'manual', 'admin');
```

### 3. 检测敏感词

```sql
SELECT * FROM detect_sensitive_words('包含敏感词的文本');
```

### 4. 替换敏感词

```sql
SELECT replace_sensitive_words('包含敏感词的文本', '*');
```

### 5. 查看统计信息

```sql
SELECT * FROM sensitive_word_statistics;
```

## 注意事项

1. 定期清理过期的检测日志以避免表过大
2. 合理配置敏感词级别以平衡安全性和用户体验
3. 白名单功能可以减少误检
4. 建议定期备份敏感词数据
5. 大量敏感词可能影响检测性能，需要优化算法

## 扩展功能

1. 支持正则表达式敏感词
2. 支持语音转文本的敏感词检测
3. 支持图片OCR敏感词检测
4. 支持多语言敏感词检测
5. 支持AI智能敏感词检测
