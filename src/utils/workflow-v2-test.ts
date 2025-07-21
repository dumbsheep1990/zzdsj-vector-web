/**
 * Workflow v2 数据结构测试工具
 * 验证前后端数据一致性和类型安全
 */

import {
  WorkflowV2Config,
  WorkflowV2AgentConfig,
  WorkflowV2Step,
  WorkflowStepType,
  ModelProviderType,
  WorkflowExecutionMode,
  DEFAULT_WORKFLOW_V2_CONFIG,
  DEFAULT_AGENT_CONFIG
} from '../types/workflow-v2';

import {
  validateWorkflowV2Config,
  validateAgent,
  validateStep,
  checkDataIntegrity
} from './workflow-v2-validation';

import {
  toBackendConfig,
  fromBackendConfig,
  normalizeWorkflowConfig,
  generateId
} from './workflow-v2-transform';

// ================ 测试数据生成 ================

export function createTestWorkflowConfig(): WorkflowV2Config {
  return {
    id: generateId('test_workflow'),
    name: '测试工作流',
    description: '用于测试的示例工作流配置',
    version: '1.0',
    components: {
      agents: [
        createTestAgent('agent1', '客服智能体'),
        createTestAgent('agent2', '分析智能体')
      ],
      models: [],
      tools: [],
      knowledge_bases: []
    },
    logic: {
      steps: [
        createTestStep('step1', '客服处理', 'agent1'),
        createTestStep('step2', '数据分析', 'agent2', ['step1'])
      ],
      conditions: [],
      variables: {
        user_input: 'string',
        analysis_result: 'object'
      },
      max_concurrent_steps: 3,
      timeout: 180
    },
    metadata: {
      created_by: 'test_user',
      test_version: '1.0'
    },
    tags: ['test', 'demo', 'customer-service'],
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

export function createTestAgent(id: string, name: string): WorkflowV2AgentConfig {
  return {
    id,
    name,
    description: `${name}的描述`,
    model_name: 'Qwen/Qwen3-32B',
    instructions: `你是${name}，请按照以下指令执行任务：\n1. 理解用户需求\n2. 提供专业回答\n3. 确保回答准确性`,
    tools: ['reasoning', 'search'],
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 0.9,
    position: { x: 100, y: 100 },
    expanded: true
  };
}

export function createTestStep(
  id: string, 
  name: string, 
  componentRef: string, 
  dependencies: string[] = []
): WorkflowV2Step {
  return {
    id,
    name,
    type: WorkflowStepType.AGENT_RUN,
    component_ref: componentRef,
    config: {
      timeout: 30,
      retry_count: 3
    },
    dependencies,
    position: { x: 200, y: 150 },
    enabled: true,
    expanded: true
  };
}

// ================ 数据一致性测试 ================

export interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
  error?: string;
}

export interface TestSuite {
  name: string;
  tests: Array<{
    name: string;
    result: TestResult;
    duration: number;
  }>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
}

export async function runDataConsistencyTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const tests: Array<{ name: string; result: TestResult; duration: number }> = [];
  
  // 测试1: 基础数据结构验证
  tests.push(await runTest('基础数据结构验证', testBasicDataStructure));
  
  // 测试2: 前后端转换一致性
  tests.push(await runTest('前后端转换一致性', testDataTransformation));
  
  // 测试3: 数据验证功能
  tests.push(await runTest('数据验证功能', testDataValidation));
  
  // 测试4: 数据规范化
  tests.push(await runTest('数据规范化', testDataNormalization));
  
  // 测试5: ID生成唯一性
  tests.push(await runTest('ID生成唯一性', testIdGeneration));
  
  // 测试6: 数据克隆功能
  tests.push(await runTest('数据克隆功能', testDataCloning));
  
  // 测试7: 复杂工作流验证
  tests.push(await runTest('复杂工作流验证', testComplexWorkflow));
  
  // 测试8: 边界条件测试
  tests.push(await runTest('边界条件测试', testEdgeCases));
  
  const endTime = Date.now();
  const passed = tests.filter(t => t.result.passed).length;
  
  return {
    name: 'Workflow v2 数据一致性测试',
    tests,
    summary: {
      total: tests.length,
      passed,
      failed: tests.length - passed,
      duration: endTime - startTime
    }
  };
}

async function runTest(
  name: string, 
  testFunction: () => Promise<TestResult> | TestResult
): Promise<{ name: string; result: TestResult; duration: number }> {
  const startTime = Date.now();
  try {
    const result = await testFunction();
    const duration = Date.now() - startTime;
    return { name, result, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      name,
      result: {
        passed: false,
        message: '测试执行失败',
        error: error instanceof Error ? error.message : String(error)
      },
      duration
    };
  }
}

// ================ 具体测试函数 ================

function testBasicDataStructure(): TestResult {
  try {
    const config = createTestWorkflowConfig();
    
    // 检查必要字段
    if (!config.name) {
      return { passed: false, message: '工作流名称不能为空' };
    }
    
    if (!config.components || !config.logic) {
      return { passed: false, message: '缺少必要的组件或逻辑配置' };
    }
    
    if (!Array.isArray(config.components.agents) || !Array.isArray(config.logic.steps)) {
      return { passed: false, message: '智能体或步骤配置格式错误' };
    }
    
    // 检查智能体配置
    for (const agent of config.components.agents) {
      if (!agent.id || !agent.name || !agent.model_name || !agent.instructions) {
        return { passed: false, message: '智能体配置不完整' };
      }
    }
    
    // 检查步骤配置
    for (const step of config.logic.steps) {
      if (!step.id || !step.name || !step.type) {
        return { passed: false, message: '步骤配置不完整' };
      }
    }
    
    return { 
      passed: true, 
      message: '基础数据结构验证通过',
      details: {
        agentCount: config.components.agents.length,
        stepCount: config.logic.steps.length
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '基础数据结构验证失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testDataTransformation(): TestResult {
  try {
    const originalConfig = createTestWorkflowConfig();
    
    // 前端 -> 后端 -> 前端转换
    const backendConfig = toBackendConfig(originalConfig);
    const transformedConfig = fromBackendConfig(backendConfig);
    
    // 检查关键字段是否保持一致
    const keyFields = ['name', 'description', 'version', 'category'];
    for (const field of keyFields) {
      if ((originalConfig as any)[field] !== (transformedConfig as any)[field]) {
        return { 
          passed: false, 
          message: `字段 ${field} 转换不一致`,
          details: {
            original: (originalConfig as any)[field],
            transformed: (transformedConfig as any)[field]
          }
        };
      }
    }
    
    // 检查智能体数量
    if (originalConfig.components.agents.length !== transformedConfig.components.agents.length) {
      return { 
        passed: false, 
        message: '智能体数量转换不一致' 
      };
    }
    
    // 检查步骤数量
    if (originalConfig.logic.steps.length !== transformedConfig.logic.steps.length) {
      return { 
        passed: false, 
        message: '步骤数量转换不一致' 
      };
    }
    
    return { 
      passed: true, 
      message: '前后端转换一致性验证通过',
      details: {
        originalFields: Object.keys(originalConfig).length,
        transformedFields: Object.keys(transformedConfig).length
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '数据转换测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testDataValidation(): TestResult {
  try {
    // 测试有效配置
    const validConfig = createTestWorkflowConfig();
    const validResult = validateWorkflowV2Config(validConfig);
    
    if (!validResult.valid) {
      return { 
        passed: false, 
        message: '有效配置验证失败',
        details: validResult.errors
      };
    }
    
    // 测试无效配置
    const invalidConfig = createTestWorkflowConfig();
    invalidConfig.name = ''; // 空名称
    invalidConfig.components.agents[0].instructions = 'ab'; // 指令过短
    
    const invalidResult = validateWorkflowV2Config(invalidConfig);
    
    if (invalidResult.valid) {
      return { 
        passed: false, 
        message: '无效配置未被正确识别' 
      };
    }
    
    // 测试数据完整性
    const integrityConfig = createTestWorkflowConfig();
    integrityConfig.logic.steps[1].component_ref = 'non_existent_agent'; // 引用不存在的智能体
    
    const integrityResult = checkDataIntegrity(integrityConfig);
    
    if (integrityResult.valid) {
      return { 
        passed: false, 
        message: '数据完整性检查未发现错误' 
      };
    }
    
    return { 
      passed: true, 
      message: '数据验证功能正常',
      details: {
        validationPassed: validResult.valid,
        invalidationDetected: !invalidResult.valid,
        integrityCheckWorking: !integrityResult.valid
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '数据验证测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testDataNormalization(): TestResult {
  try {
    // 测试不完整的配置
    const incompleteConfig = {
      name: '测试工作流',
      components: {
        agents: [{
          id: 'agent1',
          name: '测试智能体',
          model_name: 'Qwen/Qwen3-32B',
          instructions: '测试指令'
          // 缺少其他字段
        }]
      },
      logic: {
        steps: [{
          id: 'step1',
          name: '测试步骤',
          type: WorkflowStepType.AGENT_RUN
          // 缺少其他字段
        }]
      }
    };
    
    const normalizedConfig = normalizeWorkflowConfig(incompleteConfig);
    
    // 检查是否补全了缺失字段
    if (!normalizedConfig.components.agents[0].temperature) {
      return { passed: false, message: '智能体温度参数未被规范化' };
    }
    
    if (!normalizedConfig.logic.steps[0].dependencies) {
      return { passed: false, message: '步骤依赖关系未被规范化' };
    }
    
    if (!normalizedConfig.version) {
      return { passed: false, message: '版本信息未被规范化' };
    }
    
    return { 
      passed: true, 
      message: '数据规范化功能正常',
      details: {
        originalAgentFields: Object.keys(incompleteConfig.components.agents[0]).length,
        normalizedAgentFields: Object.keys(normalizedConfig.components.agents[0]).length
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '数据规范化测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testIdGeneration(): TestResult {
  try {
    const ids = new Set<string>();
    const count = 1000;
    
    // 生成大量ID检查唯一性
    for (let i = 0; i < count; i++) {
      const id = generateId('test');
      if (ids.has(id)) {
        return { 
          passed: false, 
          message: `ID冲突: ${id}`,
          details: { iteration: i }
        };
      }
      ids.add(id);
    }
    
    // 检查ID格式
    const testId = generateId('workflow');
    if (!testId.startsWith('workflow_')) {
      return { 
        passed: false, 
        message: 'ID前缀格式错误' 
      };
    }
    
    return { 
      passed: true, 
      message: 'ID生成唯一性验证通过',
      details: {
        generatedCount: count,
        uniqueCount: ids.size,
        sampleId: testId
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: 'ID生成测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testDataCloning(): TestResult {
  try {
    const originalConfig = createTestWorkflowConfig();
    
    // 测试深拷贝
    const clonedConfig = JSON.parse(JSON.stringify(originalConfig));
    
    // 修改克隆的配置
    clonedConfig.name = '修改后的名称';
    clonedConfig.components.agents[0].name = '修改后的智能体';
    
    // 检查原始配置是否未受影响
    if (originalConfig.name === clonedConfig.name) {
      return { passed: false, message: '配置克隆未实现深拷贝' };
    }
    
    if (originalConfig.components.agents[0].name === clonedConfig.components.agents[0].name) {
      return { passed: false, message: '智能体配置克隆未实现深拷贝' };
    }
    
    return { 
      passed: true, 
      message: '数据克隆功能正常',
      details: {
        originalName: originalConfig.name,
        clonedName: clonedConfig.name
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '数据克隆测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testComplexWorkflow(): TestResult {
  try {
    // 创建复杂的工作流配置
    const complexConfig: WorkflowV2Config = {
      ...createTestWorkflowConfig(),
      components: {
        agents: [
          createTestAgent('agent1', '输入处理智能体'),
          createTestAgent('agent2', '分析智能体'),
          createTestAgent('agent3', '决策智能体'),
          createTestAgent('agent4', '输出格式化智能体')
        ],
        models: [],
        tools: [],
        knowledge_bases: ['kb1', 'kb2']
      },
      logic: {
        steps: [
          createTestStep('step1', '输入预处理', 'agent1'),
          createTestStep('step2', '数据分析', 'agent2', ['step1']),
          createTestStep('step3', '并行分析A', 'agent3', ['step1']),
          createTestStep('step4', '并行分析B', 'agent3', ['step1']),
          createTestStep('step5', '结果整合', 'agent3', ['step2', 'step3', 'step4']),
          createTestStep('step6', '输出格式化', 'agent4', ['step5'])
        ],
        conditions: [],
        variables: {
          user_input: 'string',
          analysis_results: 'array',
          final_output: 'object'
        },
        max_concurrent_steps: 3,
        timeout: 300
      }
    };
    
    // 验证复杂配置
    const validationResult = validateWorkflowV2Config(complexConfig);
    
    if (!validationResult.valid) {
      return { 
        passed: false, 
        message: '复杂工作流验证失败',
        details: validationResult.errors
      };
    }
    
    // 检查数据完整性
    const integrityResult = checkDataIntegrity(complexConfig);
    
    if (!integrityResult.valid) {
      return { 
        passed: false, 
        message: '复杂工作流数据完整性检查失败',
        details: integrityResult.errors
      };
    }
    
    return { 
      passed: true, 
      message: '复杂工作流验证通过',
      details: {
        agentCount: complexConfig.components.agents.length,
        stepCount: complexConfig.logic.steps.length,
        maxDependencies: Math.max(...complexConfig.logic.steps.map(s => s.dependencies?.length || 0))
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '复杂工作流测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testEdgeCases(): TestResult {
  try {
    // 测试边界情况
    const edgeCases = [
      // 空工作流
      {
        name: '空工作流',
        config: {
          name: '空工作流',
          components: { agents: [], models: [], tools: [], knowledge_bases: [] },
          logic: { steps: [], conditions: [], variables: {} }
        }
      },
      // 单智能体单步骤
      {
        name: '最小工作流',
        config: {
          name: '最小工作流',
          components: {
            agents: [createTestAgent('agent1', '唯一智能体')],
            models: [],
            tools: [],
            knowledge_bases: []
          },
          logic: {
            steps: [createTestStep('step1', '唯一步骤', 'agent1')],
            conditions: [],
            variables: {}
          }
        }
      }
    ];
    
    for (const edgeCase of edgeCases) {
      const normalizedConfig = normalizeWorkflowConfig(edgeCase.config);
      const validationResult = validateWorkflowV2Config(normalizedConfig);
      
      // 空工作流应该有验证错误
      if (edgeCase.name === '空工作流' && validationResult.valid) {
        return { 
          passed: false, 
          message: '空工作流未被正确拒绝' 
        };
      }
      
      // 最小工作流应该验证通过
      if (edgeCase.name === '最小工作流' && !validationResult.valid) {
        return { 
          passed: false, 
          message: '最小工作流验证失败',
          details: validationResult.errors
        };
      }
    }
    
    return { 
      passed: true, 
      message: '边界条件测试通过',
      details: {
        testedCases: edgeCases.length
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '边界条件测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// ================ 性能测试 ================

export async function runPerformanceTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const tests: Array<{ name: string; result: TestResult; duration: number }> = [];
  
  // 大规模数据验证性能
  tests.push(await runTest('大规模数据验证性能', testLargeDataValidation));
  
  // 数据转换性能
  tests.push(await runTest('数据转换性能', testTransformationPerformance));
  
  // ID生成性能
  tests.push(await runTest('ID生成性能', testIdGenerationPerformance));
  
  const endTime = Date.now();
  const passed = tests.filter(t => t.result.passed).length;
  
  return {
    name: 'Workflow v2 性能测试',
    tests,
    summary: {
      total: tests.length,
      passed,
      failed: tests.length - passed,
      duration: endTime - startTime
    }
  };
}

function testLargeDataValidation(): TestResult {
  try {
    const startTime = Date.now();
    
    // 创建大规模工作流
    const largeConfig = createTestWorkflowConfig();
    
    // 添加大量智能体和步骤
    for (let i = 3; i <= 50; i++) {
      largeConfig.components.agents.push(createTestAgent(`agent${i}`, `智能体${i}`));
      largeConfig.logic.steps.push(createTestStep(`step${i}`, `步骤${i}`, `agent${i}`, [`step${i-1}`]));
    }
    
    // 验证大规模配置
    const validationResult = validateWorkflowV2Config(largeConfig);
    
    const duration = Date.now() - startTime;
    
    // 性能基准：50个智能体50个步骤应在1秒内完成验证
    if (duration > 1000) {
      return { 
        passed: false, 
        message: `大规模数据验证性能不达标，耗时 ${duration}ms`,
        details: { duration, agentCount: 50, stepCount: 50 }
      };
    }
    
    return { 
      passed: true, 
      message: `大规模数据验证性能良好，耗时 ${duration}ms`,
      details: { 
        duration, 
        agentCount: largeConfig.components.agents.length,
        stepCount: largeConfig.logic.steps.length,
        validationPassed: validationResult.valid
      }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '大规模数据验证性能测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testTransformationPerformance(): TestResult {
  try {
    const config = createTestWorkflowConfig();
    const iterations = 1000;
    
    const startTime = Date.now();
    
    // 执行多次转换
    for (let i = 0; i < iterations; i++) {
      const backendConfig = toBackendConfig(config);
      const frontendConfig = fromBackendConfig(backendConfig);
    }
    
    const duration = Date.now() - startTime;
    const averageTime = duration / iterations;
    
    // 性能基准：平均每次转换应在1ms内完成
    if (averageTime > 1) {
      return { 
        passed: false, 
        message: `数据转换性能不达标，平均耗时 ${averageTime.toFixed(2)}ms`,
        details: { duration, iterations, averageTime }
      };
    }
    
    return { 
      passed: true, 
      message: `数据转换性能良好，平均耗时 ${averageTime.toFixed(2)}ms`,
      details: { duration, iterations, averageTime }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: '数据转换性能测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function testIdGenerationPerformance(): TestResult {
  try {
    const iterations = 10000;
    
    const startTime = Date.now();
    
    // 生成大量ID
    const ids = [];
    for (let i = 0; i < iterations; i++) {
      ids.push(generateId('perf_test'));
    }
    
    const duration = Date.now() - startTime;
    const averageTime = duration / iterations;
    
    // 检查唯一性
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      return { 
        passed: false, 
        message: 'ID生成存在重复',
        details: { total: ids.length, unique: uniqueIds.size }
      };
    }
    
    // 性能基准：平均每次生成应在0.01ms内完成
    if (averageTime > 0.01) {
      return { 
        passed: false, 
        message: `ID生成性能不达标，平均耗时 ${averageTime.toFixed(4)}ms`,
        details: { duration, iterations, averageTime }
      };
    }
    
    return { 
      passed: true, 
      message: `ID生成性能良好，平均耗时 ${averageTime.toFixed(4)}ms`,
      details: { duration, iterations, averageTime, uniqueIds: uniqueIds.size }
    };
  } catch (error) {
    return { 
      passed: false, 
      message: 'ID生成性能测试失败',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// ================ 测试运行器 ================

export async function runAllTests(): Promise<{
  consistency: TestSuite;
  performance: TestSuite;
  overall: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalDuration: number;
    successRate: number;
  };
}> {
  console.log('🧪 开始运行Workflow v2数据结构测试...');
  
  const consistency = await runDataConsistencyTests();
  console.log(`✅ 数据一致性测试完成: ${consistency.summary.passed}/${consistency.summary.total} 通过`);
  
  const performance = await runPerformanceTests();
  console.log(`🚀 性能测试完成: ${performance.summary.passed}/${performance.summary.total} 通过`);
  
  const overall = {
    totalTests: consistency.summary.total + performance.summary.total,
    totalPassed: consistency.summary.passed + performance.summary.passed,
    totalFailed: consistency.summary.failed + performance.summary.failed,
    totalDuration: consistency.summary.duration + performance.summary.duration,
    successRate: 0
  };
  
  overall.successRate = (overall.totalPassed / overall.totalTests) * 100;
  
  console.log(`📊 总体测试结果: ${overall.totalPassed}/${overall.totalTests} 通过 (${overall.successRate.toFixed(1)}%)`);
  
  return {
    consistency,
    performance,
    overall
  };
} 