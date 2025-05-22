---
trigger: model_decision
description: 自定义Hook的编码规范和最佳实践，确保代码质量与一致性
---

# hooks-coding-standards

## Description

自定义Hook的编码规范和最佳实践，确保代码质量与一致性

## Content

使用本规则确保Hook实现符合以下标准:

### Hook命名规范
- 所有自定义Hook函数必须以use前缀命名
- 例如：useVectorsData, useModal, useSelection等
- 确保名称能清晰表达Hook的功能和用途

### Hook返回值规范
- Hook返回值应当是一个对象，包含明确的状态和操作方法
- 返回对象应支持解构使用，提高可读性
- 例如: return { data, loading, error, execute, reset };

### Hook文档注释
- 所有Hook都必须有完整的JSDoc文档注释，包括：
  - 功能描述
  - 参数说明
  - 返回值说明
  - 使用示例（可选）

### Hook依赖项管理
- 正确管理useEffect和useCallback的依赖项
- 避免遗漏依赖或引入不必要的依赖
- 使用React ESLint插件规则检查依赖项

### 状态初始化
- 所有useState调用必须有合理的初始值，避免undefined状态
- 对于复杂状态，考虑使用工厂函数进行懒初始化
- 初始值类型应与最终状态类型一致

### 错误处理
- 在异步操作中，使用try/catch处理所有可能出现的错误
- 提供友好的错误信息和恢复机制
- 避免在UI中暴露技术细节错误
