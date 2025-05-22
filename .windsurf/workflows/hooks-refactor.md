---
description: 协助你实现状态管理重构，将组件中的状态逻辑抽离为自定义hooks
---

# hooks-refactor

## Description

协助你实现状态管理重构，将组件中的状态逻辑抽离为自定义hooks

## Content

请帮我执行状态管理重构操作: {{action}} {{migration_name}}

如果是创建新重构(create):
1. 分析当前数据集模块与已有代码组件的数据逻辑
2. 生成适当的react hooks重构脚本，包含upgrade和downgrade支持
3. 确保代码整合符合项目规范和Typescript最佳实践

如果是应用升级(upgrade):
1. 检查代码组件与重构的兼容性
2. 提供正确的hooks升级命令
3. 提供可能的风险和备份建议

如果是回滚操作(downgrade):
1. 检查回滚操作的兼容性问题
2. 提供正确的回滚降级命令
3. 警告数据丢失风险并提供备份建议

无论哪种操作，都请遵循SOLID原则，确保代码的安全性和可维护性。
