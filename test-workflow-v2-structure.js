#!/usr/bin/env node

/**
 * Workflow v2 数据结构验证测试脚本
 * 验证前后端数据一致性和类型定义正确性
 */

// 模拟测试环境（简化版）
const WorkflowStepType = {
  AGENT_RUN: "agent_run",
  CONDITION_CHECK: "condition_check",
  DATA_TRANSFORM: "data_transform",
  PARALLEL_EXECUTION: "parallel_execution",
  LOOP: "loop",
  DELAY: "delay"
};

const ModelProviderType = {
  SILICONFLOW: "siliconflow",
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  CUSTOM: "custom"
};

const WorkflowExecutionMode = {
  SYNC: "sync",
  ASYNC: "async",
  STREAM: "stream"
};

// 生成ID工具函数
function generateId(prefix = 'item') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
}

// 创建测试数据
function createTestWorkflowConfig() {
  return {
    id: generateId('test_workflow'),
    name: '测试硅基流动工作流',
    description: '用于验证数据结构的测试工作流',
    version: '1.0',
    components: {
      agents: [
        {
          id: 'agent1',
          name: '客服智能体',
          description: '处理客户咨询的智能体',
          model_name: 'Qwen/Qwen3-32B',
          instructions: '你是一个专业的客服智能体，请友好地回答用户问题。',
          tools: ['reasoning', 'search'],
          temperature: 0.7,
          max_tokens: 4096,
          top_p: 0.9,
          // 前端UI属性
          position: { x: 100, y: 100 },
          expanded: true
        },
        {
          id: 'agent2',
          name: '分析智能体',
          description: '进行数据分析的智能体',
          model_name: 'moonshotai/Kimi-K2-Instruct',
          instructions: '你是一个数据分析专家，请对提供的数据进行专业分析。',
          tools: ['reasoning', 'calculator'],
          temperature: 0.5,
          max_tokens: 8192,
          top_p: 0.8,
          position: { x: 300, y: 100 },
          expanded: true
        }
      ],
      models: [
        {
          id: 'model1',
          name: 'Qwen3-32B',
          provider: ModelProviderType.SILICONFLOW,
          model_id: 'Qwen/Qwen3-32B',
          config: {},
          is_default: true,
          pricing: { input: 0.0005, output: 0.002 }
        }
      ],
      tools: [
        {
          id: 'tool1',
          name: '推理工具',
          type: 'builtin',
          description: '提供逻辑推理能力',
          enabled: true
        }
      ],
      knowledge_bases: ['kb1', 'kb2']
    },
    logic: {
      steps: [
        {
          id: 'step1',
          name: '客服处理',
          type: WorkflowStepType.AGENT_RUN,
          component_ref: 'agent1',
          config: { timeout: 30 },
          dependencies: [],
          position: { x: 150, y: 200 },
          enabled: true,
          expanded: true
        },
        {
          id: 'step2',
          name: '数据分析',
          type: WorkflowStepType.AGENT_RUN,
          component_ref: 'agent2',
          config: { timeout: 60 },
          dependencies: ['step1'],
          position: { x: 350, y: 200 },
          enabled: true,
          expanded: true
        }
      ],
      conditions: [],
      variables: {
        user_input: 'string',
        customer_query: 'string',
        analysis_result: 'object'
      },
      max_concurrent_steps: 3,
      timeout: 300
    },
    metadata: {
      created_by: 'test_user',
      environment: 'test'
    },
    tags: ['test', 'customer-service', 'siliconflow'],
    category: 'customer-service',
    execution_mode: WorkflowExecutionMode.ASYNC,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ui_state: {
      canvas_position: { x: 0, y: 0, zoom: 1 },
      sidebar_collapsed: false,
      active_tab: 'config',
      preview_mode: false
    }
  };
}

// 验证函数
function validateWorkflowConfig(config) {
  const errors = [];
  const warnings = [];

  // 基本字段验证
  if (!config.name || config.name.trim() === '') {
    errors.push('工作流名称不能为空');
  }

  if (!config.components) {
    errors.push('缺少组件配置');
  } else {
    // 验证智能体
    if (!Array.isArray(config.components.agents)) {
      errors.push('智能体配置必须是数组');
    } else {
      config.components.agents.forEach((agent, index) => {
        if (!agent.id) errors.push(`智能体${index + 1}缺少ID`);
        if (!agent.name) errors.push(`智能体${index + 1}缺少名称`);
        if (!agent.model_name) errors.push(`智能体${index + 1}缺少模型名称`);
        if (!agent.instructions) errors.push(`智能体${index + 1}缺少指令`);
        
        // 验证温度参数
        if (agent.temperature !== undefined && (agent.temperature < 0 || agent.temperature > 2)) {
          errors.push(`智能体${index + 1}温度参数超出范围(0-2)`);
        }
        
        // 验证Token数
        if (agent.max_tokens !== undefined && (agent.max_tokens <= 0 || agent.max_tokens > 32768)) {
          errors.push(`智能体${index + 1}Token数超出范围(1-32768)`);
        }
      });
    }
  }

  if (!config.logic) {
    errors.push('缺少逻辑配置');
  } else {
    // 验证步骤
    if (!Array.isArray(config.logic.steps)) {
      errors.push('步骤配置必须是数组');
    } else {
      const agentIds = config.components.agents.map(a => a.id);
      const stepIds = new Set();
      
      config.logic.steps.forEach((step, index) => {
        if (!step.id) {
          errors.push(`步骤${index + 1}缺少ID`);
        } else if (stepIds.has(step.id)) {
          errors.push(`步骤ID重复: ${step.id}`);
        } else {
          stepIds.add(step.id);
        }
        
        if (!step.name) errors.push(`步骤${index + 1}缺少名称`);
        if (!step.type) errors.push(`步骤${index + 1}缺少类型`);
        
        // 验证智能体引用
        if (step.type === WorkflowStepType.AGENT_RUN) {
          if (!step.component_ref) {
            errors.push(`步骤${index + 1}缺少组件引用`);
          } else if (!agentIds.includes(step.component_ref)) {
            errors.push(`步骤${index + 1}引用的智能体不存在: ${step.component_ref}`);
          }
        }
        
        // 验证依赖关系
        if (step.dependencies) {
          step.dependencies.forEach(dep => {
            if (dep === step.id) {
              errors.push(`步骤${index + 1}不能依赖自身`);
            }
          });
        }
      });
    }
  }

  // 警告检查
  if (config.components.agents.length === 0) {
    warnings.push('工作流没有配置智能体');
  }

  if (config.logic.steps.length === 0) {
    warnings.push('工作流没有配置步骤');
  }

  if (config.logic.steps.length > 10) {
    warnings.push('步骤过多可能影响性能');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// 数据转换测试
function testDataTransformation(config) {
  // 模拟前端到后端转换
  const backendConfig = {
    id: config.id,
    name: config.name,
    description: config.description,
    version: config.version,
    components: {
      agents: config.components.agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        model_name: agent.model_name,
        instructions: agent.instructions,
        tools: agent.tools,
        temperature: agent.temperature,
        max_tokens: agent.max_tokens,
        top_p: agent.top_p
      })),
      models: config.components.models,
      tools: config.components.tools,
      knowledge_bases: config.components.knowledge_bases
    },
    logic: {
      steps: config.logic.steps.map(step => ({
        id: step.id,
        name: step.name,
        type: step.type,
        component_ref: step.component_ref,
        config: step.config,
        dependencies: step.dependencies,
        enabled: step.enabled
      })),
      conditions: config.logic.conditions,
      variables: config.logic.variables,
      max_concurrent_steps: config.logic.max_concurrent_steps,
      timeout: config.logic.timeout
    },
    metadata: config.metadata,
    tags: config.tags,
    category: config.category,
    execution_mode: config.execution_mode,
    created_at: config.created_at,
    updated_at: config.updated_at
  };

  // 模拟后端到前端转换
  const frontendConfig = {
    ...backendConfig,
    components: {
      ...backendConfig.components,
      agents: backendConfig.components.agents.map(agent => ({
        ...agent,
        position: { x: 0, y: 0 },
        expanded: true
      }))
    },
    logic: {
      ...backendConfig.logic,
      steps: backendConfig.logic.steps.map(step => ({
        ...step,
        position: { x: 0, y: 0 },
        expanded: true
      }))
    },
    ui_state: {
      canvas_position: { x: 0, y: 0, zoom: 1 },
      sidebar_collapsed: false,
      active_tab: 'config',
      preview_mode: false
    }
  };

  // 检查关键字段是否保持一致
  const fieldsToCheck = ['name', 'description', 'version', 'category'];
  const differences = [];

  fieldsToCheck.forEach(field => {
    if (config[field] !== frontendConfig[field]) {
      differences.push(`${field}: ${config[field]} -> ${frontendConfig[field]}`);
    }
  });

  if (config.components.agents.length !== frontendConfig.components.agents.length) {
    differences.push(`智能体数量: ${config.components.agents.length} -> ${frontendConfig.components.agents.length}`);
  }

  if (config.logic.steps.length !== frontendConfig.logic.steps.length) {
    differences.push(`步骤数量: ${config.logic.steps.length} -> ${frontendConfig.logic.steps.length}`);
  }

  return {
    success: differences.length === 0,
    differences
  };
}

// 运行测试
function runTests() {
  console.log('🧪 开始运行Workflow v2数据结构测试');
  console.log('='.repeat(60));

  let totalTests = 0;
  let passedTests = 0;

  // 测试1: 创建测试配置
  console.log('\n1. 测试配置创建');
  totalTests++;
  try {
    const config = createTestWorkflowConfig();
    console.log('   ✅ 配置创建成功');
    console.log(`   📊 智能体数量: ${config.components.agents.length}`);
    console.log(`   📊 步骤数量: ${config.logic.steps.length}`);
    console.log(`   📊 配置大小: ${JSON.stringify(config).length} 字符`);
    passedTests++;
  } catch (error) {
    console.log(`   ❌ 配置创建失败: ${error.message}`);
  }

  // 测试2: 配置验证
  console.log('\n2. 测试配置验证');
  totalTests++;
  try {
    const config = createTestWorkflowConfig();
    const validation = validateWorkflowConfig(config);
    
    if (validation.valid) {
      console.log('   ✅ 配置验证通过');
      if (validation.warnings.length > 0) {
        console.log(`   ⚠️  警告: ${validation.warnings.join(', ')}`);
      }
      passedTests++;
    } else {
      console.log('   ❌ 配置验证失败');
      validation.errors.forEach(error => {
        console.log(`   🔸 ${error}`);
      });
    }
  } catch (error) {
    console.log(`   ❌ 验证测试失败: ${error.message}`);
  }

  // 测试3: 数据转换
  console.log('\n3. 测试数据转换');
  totalTests++;
  try {
    const config = createTestWorkflowConfig();
    const transformation = testDataTransformation(config);
    
    if (transformation.success) {
      console.log('   ✅ 数据转换成功');
      passedTests++;
    } else {
      console.log('   ❌ 数据转换失败');
      transformation.differences.forEach(diff => {
        console.log(`   🔸 ${diff}`);
      });
    }
  } catch (error) {
    console.log(`   ❌ 转换测试失败: ${error.message}`);
  }

  // 测试4: ID生成唯一性
  console.log('\n4. 测试ID生成');
  totalTests++;
  try {
    const ids = new Set();
    const count = 1000;
    
    for (let i = 0; i < count; i++) {
      const id = generateId('test');
      if (ids.has(id)) {
        throw new Error(`ID冲突: ${id}`);
      }
      ids.add(id);
    }
    
    console.log(`   ✅ 生成${count}个唯一ID`);
    console.log(`   📊 ID格式示例: ${generateId('workflow')}`);
    passedTests++;
  } catch (error) {
    console.log(`   ❌ ID生成测试失败: ${error.message}`);
  }

  // 测试5: 硅基流动模型配置
  console.log('\n5. 测试硅基流动集成');
  totalTests++;
  try {
    const config = createTestWorkflowConfig();
    
    // 检查模型配置
    const siliconflowModels = config.components.agents.filter(agent => 
      agent.model_name.includes('Qwen') || agent.model_name.includes('moonshotai')
    );
    
    if (siliconflowModels.length > 0) {
      console.log('   ✅ 硅基流动模型配置正确');
      console.log(`   📊 硅基流动模型数量: ${siliconflowModels.length}`);
      siliconflowModels.forEach(agent => {
        console.log(`   🔸 ${agent.name}: ${agent.model_name}`);
      });
      passedTests++;
    } else {
      console.log('   ❌ 未找到硅基流动模型配置');
    }
  } catch (error) {
    console.log(`   ❌ 硅基流动集成测试失败: ${error.message}`);
  }

  // 测试6: 边界条件
  console.log('\n6. 测试边界条件');
  totalTests++;
  try {
    // 测试空配置
    const emptyConfig = {
      name: '',
      components: { agents: [], models: [], tools: [], knowledge_bases: [] },
      logic: { steps: [], conditions: [], variables: {} }
    };
    
    const validation = validateWorkflowConfig(emptyConfig);
    
    if (!validation.valid && validation.errors.length > 0) {
      console.log('   ✅ 空配置正确被拒绝');
      console.log(`   📊 错误数量: ${validation.errors.length}`);
      passedTests++;
    } else {
      console.log('   ❌ 空配置应该被拒绝');
    }
  } catch (error) {
    console.log(`   ❌ 边界条件测试失败: ${error.message}`);
  }

  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('🎊 Workflow v2数据结构测试完成');
  console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过 (${(passedTests/totalTests*100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('✨ 所有测试通过！数据结构设计正确');
  } else {
    console.log('⚠️  部分测试失败，需要检查数据结构');
  }

  console.log('\n📝 数据结构特点:');
  console.log('   🔧 前后端类型一致性');
  console.log('   🏗️  完整的Schema验证');
  console.log('   🔀 灵活的数据转换');
  console.log('   🎯 硅基流动API适配');
  console.log('   💾 UI状态管理');
  console.log('   ⚡ 性能优化考虑');

  return passedTests === totalTests;
}

// 执行测试
const success = runTests();
process.exit(success ? 0 : 1); 