# 智能体自定义系统设计方案

## 1. 系统概述

随着OWL智能体框架的集成，系统需要支持智能体的编辑和自定义功能，允许用户基于内置的基础智能体进行配置，自定义工具调用及其顺序，并发布为个性化智能体。本文档详细描述了智能体自定义系统的设计和实现方案。

### 1.1 设计目标

- 提供直观、简洁的智能体配置界面，避免复杂的流程图式拖拽操作
- 支持工具链的灵活排序和条件配置
- 实现智能体模板系统，便于用户快速创建特定类型的智能体
- 确保自定义智能体与现有系统的无缝集成
- 提供足够的自由度，满足不同用户的定制需求

## 2. 总体架构

```
+------------------------------------------+
|            用户界面层                     |
| (智能体编辑器、工具配置界面、模板选择等)    |
+------------------------------------------+
                  |
+------------------------------------------+
|            智能体定义管理层                |
|   +----------------------------+         |
|   |    自定义智能体定义存储     |         |
|   +----------------------------+         |
|   |    智能体模板管理          |         |
|   +----------------------------+         |
|   |    工具链配置管理          |         |
|   +----------------------------+         |
+------------------------------------------+
                  |
+------------------------------------------+
|            智能体实例化层                 |
|   +----------------------------+         |
|   |   动态智能体构建器         |         |
|   +----------------------------+         |
|   |   工具链编排引擎           |         |
|   +----------------------------+         |
+------------------------------------------+
                  |
+------------------------------------------+
|            现有OWL框架集成                |
+------------------------------------------+
```

## 3. 核心组件

### 3.1 智能体定义模型

```python
# app/models/agent_definition.py
from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship
from app.utils.database import Base

# 智能体与工具多对多关系表
agent_tool_association = Table(
    'agent_tool_association',
    Base.metadata,
    Column('agent_definition_id', Integer, ForeignKey('agent_definitions.id')),
    Column('tool_id', Integer, ForeignKey('tools.id')),
    Column('order', Integer),  # 工具调用顺序
    Column('condition', String),  # 条件表达式，决定何时使用此工具
    Column('parameters', JSON)  # 工具参数默认配置
)

class AgentDefinition(Base):
    """智能体定义模型"""
    __tablename__ = 'agent_definitions'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    base_agent_type = Column(String, nullable=False)  # 基础智能体类型
    creator_id = Column(Integer, ForeignKey('users.id'))
    is_public = Column(Boolean, default=False)
    is_system = Column(Boolean, default=False)
    configuration = Column(JSON)  # 智能体特定配置
    system_prompt = Column(String)  # 系统提示词
    
    # 关联的工具
    tools = relationship(
        "Tool", 
        secondary=agent_tool_association,
        order_by="agent_tool_association.c.order",
        collection_class=list
    )
    
    # 工作流定义（如有）
    workflow_definition = Column(JSON)
```

### 3.2 工具定义模型

```python
# app/models/tool.py
from sqlalchemy import Column, Integer, String, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.utils.database import Base

class Tool(Base):
    """工具定义模型"""
    __tablename__ = 'tools'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    type = Column(String, nullable=False)  # 工具类型，如 'llm', 'api', 'function'
    implementation = Column(String)  # 实现路径或函数名
    is_system = Column(Boolean, default=False)  # 是否为系统内置工具
    creator_id = Column(Integer, ForeignKey('users.id'))
    parameters_schema = Column(JSON)  # 参数模式定义
    input_format = Column(JSON)  # 输入格式定义
    output_format = Column(JSON)  # 输出格式定义
    
    # 分类和标签
    category = Column(String)
    tags = Column(JSON)
```

## 4. 智能体构建引擎

### 4.1 动态智能体构建器

```python
# app/core/agent_builder.py
from typing import Any, Dict, List, Optional
from app.models.agent_definition import AgentDefinition
from app.models.tool import Tool
from app.frameworks.owl.agents.base import BaseAgent
from app.frameworks.integration.agent_factory import AgentFactory

class AgentBuilder:
    """动态智能体构建器，根据定义构建可执行的智能体实例"""
    
    def __init__(self, agent_factory: AgentFactory):
        self.agent_factory = agent_factory
        
    async def build_from_definition(self, definition_id: int) -> BaseAgent:
        """从定义构建智能体实例
        
        Args:
            definition_id: 智能体定义ID
            
        Returns:
            BaseAgent: 构建的智能体实例
        """
        # 从数据库加载定义
        from app.utils.database import get_db
        db = await get_db().__anext__()
        definition = await db.query(AgentDefinition).filter(
            AgentDefinition.id == definition_id
        ).first()
        
        if not definition:
            raise ValueError(f"找不到智能体定义: {definition_id}")
        
        # 构建基础智能体
        config = {
            "system_prompt": definition.system_prompt,
            **definition.configuration
        }
        agent = await self.agent_factory.create_agent(
            definition.base_agent_type, 
            config
        )
        
        # 加载并配置工具
        tools = []
        for tool_association in definition.tools:
            tool_impl = self._load_tool_implementation(
                tool_association.tool, 
                tool_association.parameters
            )
            tools.append(tool_impl)
        
        # 为智能体添加工具
        agent.add_tools(tools)
        
        # 如果有工作流定义，配置工作流
        if definition.workflow_definition:
            self._configure_workflow(agent, definition.workflow_definition)
        
        return agent
    
    def _load_tool_implementation(self, tool: Tool, parameters: Dict[str, Any]) -> Any:
        """加载工具实现
        
        Args:
            tool: 工具定义
            parameters: 工具参数
            
        Returns:
            Any: 工具实现实例
        """
        # 动态导入和实例化工具
        import importlib
        module_path, class_name = tool.implementation.rsplit('.', 1)
        module = importlib.import_module(module_path)
        tool_class = getattr(module, class_name)
        
        return tool_class(**parameters)
    
    def _configure_workflow(self, agent: BaseAgent, workflow_definition: Dict[str, Any]) -> None:
        """配置智能体工作流
        
        Args:
            agent: 智能体实例
            workflow_definition: 工作流定义
        """
        # 根据工作流定义配置智能体工作流
        if hasattr(agent, "set_workflow"):
            agent.set_workflow(workflow_definition)
```

### 4.2 工具链编排引擎

```python
# app/core/tool_orchestrator.py
from typing import Any, Dict, List, Optional, Callable

class ToolOrchestrator:
    """工具链编排引擎，管理工具调用顺序和条件"""
    
    def __init__(self):
        self.tools = []
        self.conditions = {}
        self.default_params = {}
        
    def add_tool(self, tool: Any, order: int, 
                condition: Optional[str] = None, 
                default_params: Optional[Dict[str, Any]] = None) -> None:
        """添加工具到编排引擎
        
        Args:
            tool: 工具实例
            order: 调用顺序
            condition: 条件表达式
            default_params: 默认参数
        """
        self.tools.append((tool, order))
        if condition:
            self.conditions[tool] = condition
        if default_params:
            self.default_params[tool] = default_params
        
        # 按顺序排序工具
        self.tools.sort(key=lambda x: x[1])
    
    def get_next_tool(self, context: Dict[str, Any]) -> Optional[Any]:
        """根据上下文获取下一个要调用的工具
        
        Args:
            context: 当前执行上下文
            
        Returns:
            Optional[Any]: 下一个要调用的工具，如果没有则返回None
        """
        for tool, _ in self.tools:
            # 如果有条件，评估条件
            if tool in self.conditions:
                condition = self.conditions[tool]
                if not self._evaluate_condition(condition, context):
                    continue
            
            return tool
        
        return None
    
    def prepare_params(self, tool: Any, context: Dict[str, Any]) -> Dict[str, Any]:
        """准备工具调用参数
        
        Args:
            tool: 工具实例
            context: 当前执行上下文
            
        Returns:
            Dict[str, Any]: 准备好的参数
        """
        params = {}
        
        # 使用默认参数
        if tool in self.default_params:
            params.update(self.default_params[tool])
        
        # 从上下文中提取参数
        # TODO: 实现参数映射逻辑
        
        return params
    
    def _evaluate_condition(self, condition: str, context: Dict[str, Any]) -> bool:
        """评估条件表达式
        
        Args:
            condition: 条件表达式
            context: 当前执行上下文
            
        Returns:
            bool: 条件是否满足
        """
        # 使用安全的条件评估方法
        # 这里可以使用简单的条件解析器或沙盒执行环境
        try:
            # 简单示例实现，实际应用中需要更安全的方法
            local_vars = dict(context)
            return eval(condition, {"__builtins__": {}}, local_vars)
        except Exception as e:
            print(f"条件评估错误: {e}")
            return False
```

## 5. API接口

### 5.1 智能体定义管理API

```python
# app/api/agent_definition.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.utils.database import get_db
from app.models.agent_definition import AgentDefinition
from app.schemas.agent_definition import (
    AgentDefinitionCreate, 
    AgentDefinitionResponse,
    AgentDefinitionUpdate
)

router = APIRouter()

@router.post("/definitions", response_model=AgentDefinitionResponse)
async def create_agent_definition(
    definition: AgentDefinitionCreate, 
    db: Session = Depends(get_db)
):
    """创建新的智能体定义"""
    db_definition = AgentDefinition(**definition.dict())
    db.add(db_definition)
    await db.commit()
    await db.refresh(db_definition)
    return db_definition

@router.get("/definitions", response_model=List[AgentDefinitionResponse])
async def list_agent_definitions(
    skip: int = 0, 
    limit: int = 100,
    is_public: Optional[bool] = None,
    is_system: Optional[bool] = None,
    creator_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """列出智能体定义"""
    query = db.query(AgentDefinition)
    
    if is_public is not None:
        query = query.filter(AgentDefinition.is_public == is_public)
    
    if is_system is not None:
        query = query.filter(AgentDefinition.is_system == is_system)
        
    if creator_id is not None:
        query = query.filter(AgentDefinition.creator_id == creator_id)
    
    definitions = await query.offset(skip).limit(limit).all()
    return definitions

@router.get("/definitions/{definition_id}", response_model=AgentDefinitionResponse)
async def get_agent_definition(
    definition_id: int, 
    db: Session = Depends(get_db)
):
    """获取特定智能体定义"""
    definition = await db.query(AgentDefinition).filter(
        AgentDefinition.id == definition_id
    ).first()
    
    if not definition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"找不到智能体定义: {definition_id}"
        )
    
    return definition

@router.put("/definitions/{definition_id}", response_model=AgentDefinitionResponse)
async def update_agent_definition(
    definition_id: int,
    update_data: AgentDefinitionUpdate,
    db: Session = Depends(get_db)
):
    """更新智能体定义"""
    definition = await db.query(AgentDefinition).filter(
        AgentDefinition.id == definition_id
    ).first()
    
    if not definition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"找不到智能体定义: {definition_id}"
        )
    
    # 更新字段
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(definition, key, value)
    
    await db.commit()
    await db.refresh(definition)
    return definition

@router.delete("/definitions/{definition_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent_definition(
    definition_id: int,
    db: Session = Depends(get_db)
):
    """删除智能体定义"""
    definition = await db.query(AgentDefinition).filter(
        AgentDefinition.id == definition_id
    ).first()
    
    if not definition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"找不到智能体定义: {definition_id}"
        )
    
    await db.delete(definition)
    await db.commit()
    return None
```

### 5.2 智能体实例化API

```python
# app/api/agent_instance.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from app.core.agent_builder import AgentBuilder
from app.frameworks.integration.agent_factory import AgentFactory
from app.core.agent_manager import AgentManager

router = APIRouter()

class TaskRequest(BaseModel):
    """任务请求"""
    definition_id: int
    task: str
    parameters: Optional[Dict[str, Any]] = None

class TaskResponse(BaseModel):
    """任务响应"""
    result: str
    metadata: Dict[str, Any]

@router.post("/run", response_model=TaskResponse)
async def run_agent_task(request: TaskRequest):
    """运行自定义智能体任务"""
    # 获取智能体工厂和构建器
    agent_manager = AgentManager()
    await agent_manager.initialize()
    
    agent_factory = agent_manager.agent_factory
    agent_builder = AgentBuilder(agent_factory)
    
    try:
        # 从定义构建智能体
        agent = await agent_builder.build_from_definition(request.definition_id)
        
        # 处理任务
        result, metadata = await agent_manager.process_task_with_agent(
            task=request.task,
            agent=agent,
            parameters=request.parameters or {}
        )
        
        return TaskResponse(
            result=result,
            metadata=metadata
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"处理任务时出错: {str(e)}"
        )
```

## 6. 智能体模板系统

为了方便用户创建自定义智能体，提供一套模板系统：

```python
# app/models/agent_template.py
from sqlalchemy import Column, Integer, String, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.utils.database import Base

class AgentTemplate(Base):
    """智能体模板模型"""
    __tablename__ = 'agent_templates'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)
    base_agent_type = Column(String, nullable=False)
    is_system = Column(Boolean, default=False)
    creator_id = Column(Integer, ForeignKey('users.id'))
    
    # 模板配置
    configuration = Column(JSON)
    system_prompt_template = Column(String)
    
    # 推荐工具
    recommended_tools = Column(JSON)
    
    # 示例工作流
    example_workflow = Column(JSON)
    
    # 使用说明
    usage_guide = Column(String)
```

## 7. 工具链执行引擎扩展

扩展AgentManager以支持自定义智能体：

```python
# 在app/core/agent_manager.py中添加

async def process_task_with_agent(self, task: str, agent: Any, 
                                parameters: Optional[Dict[str, Any]] = None) -> Tuple[str, Any]:
    """使用指定智能体处理任务
    
    Args:
        task: 任务描述
        agent: 智能体实例
        parameters: 任务参数
        
    Returns:
        Tuple[str, Any]: (结果, 元数据)
    """
    if not self.initialized:
        await self.initialize()
        
    # 获取工具包
    from app.frameworks.owl.toolkits.base import OwlToolkitManager
    toolkit_manager = OwlToolkitManager()
    await toolkit_manager.initialize()
    
    # 处理任务参数
    task_with_params = task
    if parameters:
        # 格式化任务或传递参数
        task_with_params = self._format_task_with_params(task, parameters)
    
    # 使用指定智能体处理任务
    # 这里假设agent实现了run_task接口
    answer, chat_history, metadata = await agent.run_task(
        task_with_params, 
        tools=await toolkit_manager.get_tools()
    )
    
    return answer, {"chat_history": chat_history, **metadata}
    
def _format_task_with_params(self, task: str, parameters: Dict[str, Any]) -> str:
    """根据参数格式化任务
    
    Args:
        task: 原始任务描述
        parameters: 任务参数
        
    Returns:
        str: 格式化后的任务
    """
    # 简单的参数替换实现
    formatted_task = task
    for key, value in parameters.items():
        placeholder = f"{{{key}}}"
        if placeholder in formatted_task:
            formatted_task = formatted_task.replace(placeholder, str(value))
    
    return formatted_task
```

## 8. 用户界面交互设计

为避免使用传统的拖拽式工作流编排方式（如React Flow或n8n），系统提供以下几种更直观的智能体编辑方式：

### 8.1 卡片堆叠式配置

![卡片堆叠式配置](https://i.imgur.com/example1.png)

#### 核心理念
- 将每个工具表示为一张"卡片"
- 用户通过上下拖动卡片调整顺序（类似Trello或看板）
- 点击卡片展开详细配置选项
- 自动展示工具间的数据流动关系

#### 实现方式
```html
<div class="agent-tools-stack">
  <!-- 每个工具都是一张卡片 -->
  <div class="tool-card" data-tool-id="1">
    <div class="tool-header">
      <h3>文档加载工具</h3>
      <span class="tool-toggle">▼</span>
    </div>
    
    <div class="tool-content">
      <!-- 工具配置表单 -->
      <div class="form-group">
        <label>最大文件大小</label>
        <input type="number" value="10" />
      </div>
      <!-- 条件配置（何时使用此工具） -->
      <div class="form-group">
        <label>使用条件</label>
        <input type="text" value="task.contains('读取文件')" />
      </div>
    </div>
  </div>
  
  <!-- 下一个工具 -->
  <div class="tool-card" data-tool-id="2">
    <!-- ... -->
  </div>
</div>
```

### 8.2 对话式配置

#### 核心理念
- 用户与系统进行对话式交互来配置智能体
- 系统以自然语言提问，用户回答配置偏好
- 类似于ChatGPT的交互，但有结构化输出
- 系统边聊边构建配置文件

#### 实现示例
```
系统: 您想创建什么类型的智能体？

用户: 一个能阅读PDF并提取关键信息的助手

系统: 好的，我建议您的智能体需要以下工具：
1. PDF加载工具 - 读取PDF文件
2. 文本分析工具 - 提取关键信息
3. 摘要生成工具 - 整理发现的信息

您想调整这个工具列表吗？

用户: 把摘要生成工具放在最前面

系统: 确认您的工具链顺序:
1. 摘要生成工具
2. PDF加载工具
3. 文本分析工具

这样的顺序可能不太有效，因为摘要生成工具需要先有内容。您确定要这样设置吗？

用户: 不，你说得对，恢复原来顺序
```

### 8.3 表格式配置

#### 核心理念
- 使用表格展示工具序列和配置
- 简单的上下移动按钮调整顺序
- 使用下拉菜单和标准表单控件配置参数
- 适合精确配置且空间有限的场景

#### 实现方式
```html
<table class="agent-tools-table">
  <thead>
    <tr>
      <th width="10%">顺序</th>
      <th width="20%">工具名称</th>
      <th width="30%">参数配置</th>
      <th width="30%">使用条件</th>
      <th width="10%">操作</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <button class="btn-move-up">↑</button>
        <button class="btn-move-down">↓</button>
      </td>
      <td>PDF加载工具</td>
      <td>
        <select class="param-selector">
          <option>最大页数</option>
          <option>文件路径</option>
        </select>
        <input type="text" value="100" />
        <button class="btn-add-param">+</button>
      </td>
      <td>
        <input type="text" value="'pdf' in task" />
      </td>
      <td>
        <button class="btn-delete">删除</button>
      </td>
    </tr>
    <!-- 更多工具行 -->
  </tbody>
</table>
```

### 8.4 自然语言配置 + 结构化预览

#### 核心理念
- 用户使用自然语言描述所需的智能体功能和工具链
- AI分析描述并生成结构化配置建议
- 用户可以在结构化预览中微调配置
- 结合AI的便捷性和结构化配置的精确性

#### 工作流程
```
用户输入: "我需要一个智能体，它可以先从网页收集数据，
          然后分析这些数据找出关键趋势，最后生成一份报告"

系统分析并显示:
[工具1] ✓ 网页抓取工具 - 从指定URL获取内容
[工具2] ✓ 数据分析工具 - 识别趋势和模式 
[工具3] ✓ 报告生成工具 - 创建结构化总结

用户可以点击任何工具调整其配置或顺序
```

## 9. 推荐交互方案：混合式编辑器

推荐实现一个结合自然语言配置和卡片堆叠的混合式编辑器：

### 工作流程

1. **开始阶段**:
   - 用户通过自然语言描述想要的智能体功能
   - 系统分析并推荐初始工具集和配置

2. **编辑阶段**:
   - 系统将推荐配置转换为卡片堆叠视图
   - 用户可以轻松调整卡片顺序(上下拖动)
   - 点击卡片展开详细配置选项

3. **测试与微调**:
   - 用户可以随时测试当前配置
   - 系统提供执行过程的可视化反馈
   - 用户可以对问题点进行快速微调

### 优势

- 避免了复杂的节点拖拽操作
- 保持了直观性和灵活性
- 适合各类用户使用
- 界面简洁，学习曲线平缓
- 既能满足简单配置需求，也支持复杂工具链的构建

## 10. 实施路径

1. **数据模型设计与实现** (T+1 ~ T+5)
   - 创建智能体定义模型
   - 创建工具定义模型
   - 创建智能体模板模型

2. **核心引擎开发** (T+6 ~ T+15)
   - 实现动态智能体构建器
   - 实现工具链编排引擎
   - 扩展现有AgentManager

3. **API接口开发** (T+16 ~ T+20)
   - 实现智能体定义管理API
   - 实现智能体实例化API
   - 实现模板管理API

4. **用户界面开发** (T+21 ~ T+30)
   - 实现混合式编辑器界面
   - 实现工具配置界面
   - 实现测试与反馈界面

## 11. 总结

本方案通过设计一个智能体自定义系统，使用户能够基于内置的基础智能体进行配置，自定义工具调用及其顺序，并发布为个性化智能体。方案采用了混合式编辑器作为交互方式，避免了传统的拖拽式工作流编排，提供了更直观、简洁的界面体验。系统的后端设计遵循了模块化原则，与现有的OWL框架无缝集成，确保了系统整体架构的一致性和可维护性。
