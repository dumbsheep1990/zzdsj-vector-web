import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Download, 
  Upload, 
  BarChart3, 
  Clock, 
  Target, 
  Zap,
  Database,
  Settings,
  Plus,
  Trash2,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import PageHeader from '../components/layout/PageHeader';
import SearchControlPanel from '../components/modules/knowledge-base/SearchControlPanel';
import { useAppContext } from '../context/AppContext';

interface TestQuery {
  id: string;
  query: string;
  enabled: boolean;
}

interface SearchConfig {
  name: string;
  searchType: 'hybrid' | 'semantic' | 'keyword';
  recallThreshold: number;
  similarityThreshold: number;
  topK: number;
  semanticWeight: number;
  keywordWeight: number;
  enableReranking: boolean;
  maxCandidates: number;
}

interface TestResult {
  queryId: string;
  query: string;
  configName: string;
  knowledgeBaseName: string;
  responseTime: number;
  resultCount: number;
  results: Array<{
    content: string;
    score: number;
    documentName: string;
  }>;
}

interface KnowledgeBase {
  id: string;
  name: string;
  status: string;
  description: string;
  vectorCount: number;
}

const SearchTestPage: React.FC = () => {
  const { state } = useAppContext();
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([]);
  const [availableKnowledgeBases] = useState<KnowledgeBase[]>([
    { id: '1', name: '城市规划知识库', status: 'active', description: '城市规划相关文档', vectorCount: 1250 },
    { id: '2', name: '法规标准库', status: 'active', description: '法律法规和标准', vectorCount: 890 },
    { id: '3', name: '历史会议记录', status: 'active', description: '会议记录存档', vectorCount: 650 },
    { id: '4', name: '数据分析报告', status: 'active', description: '各类数据分析', vectorCount: 420 }
  ]);
  
  const [testQueries, setTestQueries] = useState<TestQuery[]>([
    { id: '1', query: '城市规划的基本原则', enabled: true },
    { id: '2', query: '环保政策实施方案', enabled: true },
    { id: '3', query: '智慧城市建设标准', enabled: true }
  ]);
  
  const [searchConfigs, setSearchConfigs] = useState<SearchConfig[]>([
    {
      name: '默认混合检索',
      searchType: 'hybrid',
      recallThreshold: 0.8,
      similarityThreshold: 0.7,
      topK: 5,
      semanticWeight: 0.7,
      keywordWeight: 0.3,
      enableReranking: true,
      maxCandidates: 100
    },
    {
      name: '高精度语义检索',
      searchType: 'semantic',
      recallThreshold: 0.9,
      similarityThreshold: 0.8,
      topK: 3,
      semanticWeight: 1.0,
      keywordWeight: 0.0,
      enableReranking: true,
      maxCandidates: 50
    }
  ]);
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [selectedConfigForEdit, setSelectedConfigForEdit] = useState<number | null>(null);

  // 添加查询
  const addTestQuery = () => {
    const newQuery: TestQuery = {
      id: Date.now().toString(),
      query: '',
      enabled: true
    };
    setTestQueries([...testQueries, newQuery]);
  };

  // 更新查询
  const updateTestQuery = (id: string, updates: Partial<TestQuery>) => {
    setTestQueries(queries => 
      queries.map(q => q.id === id ? { ...q, ...updates } : q)
    );
  };

  // 删除查询
  const deleteTestQuery = (id: string) => {
    setTestQueries(queries => queries.filter(q => q.id !== id));
  };

  // 添加配置
  const addSearchConfig = () => {
    const newConfig: SearchConfig = {
      name: `配置 ${searchConfigs.length + 1}`,
      searchType: 'hybrid',
      recallThreshold: 0.8,
      similarityThreshold: 0.7,
      topK: 5,
      semanticWeight: 0.7,
      keywordWeight: 0.3,
      enableReranking: true,
      maxCandidates: 100
    };
    setSearchConfigs([...searchConfigs, newConfig]);
  };

  // 更新配置
  const updateSearchConfig = (index: number, config: SearchConfig) => {
    setSearchConfigs(configs => 
      configs.map((c, i) => i === index ? config : c)
    );
  };

  // 删除配置
  const deleteSearchConfig = (index: number) => {
    setSearchConfigs(configs => configs.filter((_, i) => i !== index));
    if (selectedConfigForEdit === index) {
      setSelectedConfigForEdit(null);
    }
  };

  // 运行测试
  const runTest = async () => {
    if (selectedKnowledgeBases.length === 0) {
      alert('请选择至少一个知识库');
      return;
    }
    
    const enabledQueries = testQueries.filter(q => q.enabled && q.query.trim());
    if (enabledQueries.length === 0) {
      alert('请添加至少一个有效的测试查询');
      return;
    }

    setIsRunningTest(true);
    setTestProgress(0);
    setTestResults([]);

    const totalTests = enabledQueries.length * searchConfigs.length * selectedKnowledgeBases.length;
    let completedTests = 0;

    // 模拟测试过程
    const results: TestResult[] = [];
    
    for (const kb of selectedKnowledgeBases) {
      const knowledgeBase = availableKnowledgeBases.find(k => k.id === kb);
      if (!knowledgeBase) continue;

      for (const query of enabledQueries) {
        for (const config of searchConfigs) {
          // 模拟API调用延迟
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // 生成模拟结果
          const mockResult: TestResult = {
            queryId: query.id,
            query: query.query,
            configName: config.name,
            knowledgeBaseName: knowledgeBase.name,
            responseTime: Math.random() * 800 + 200, // 200-1000ms
            resultCount: Math.floor(Math.random() * config.topK) + 1,
            results: Array.from({ length: Math.min(3, config.topK) }, (_, i) => ({
              content: `相关内容片段 ${i + 1}：关于"${query.query}"的描述...`,
              score: 0.9 - (i * 0.1) + (Math.random() * 0.1 - 0.05),
              documentName: `文档${i + 1}.pdf`
            }))
          };
          
          results.push(mockResult);
          completedTests++;
          setTestProgress((completedTests / totalTests) * 100);
        }
      }
    }

    setTestResults(results);
    setIsRunningTest(false);
    setTestProgress(100);
  };

  // 导出结果
  const exportResults = () => {
    const csv = [
      ['查询', '配置', '知识库', '响应时间(ms)', '结果数量', '平均得分'],
      ...testResults.map(result => [
        result.query,
        result.configName,
        result.knowledgeBaseName,
        result.responseTime.toFixed(0),
        result.resultCount,
        (result.results.reduce((sum, r) => sum + r.score, 0) / result.results.length).toFixed(3)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-test-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 计算统计数据
  const getStatistics = () => {
    if (testResults.length === 0) return null;

    const avgResponseTime = testResults.reduce((sum, r) => sum + r.responseTime, 0) / testResults.length;
    const avgResultCount = testResults.reduce((sum, r) => sum + r.resultCount, 0) / testResults.length;
    const avgScore = testResults.reduce((sum, r) => {
      const resultAvg = r.results.reduce((s, res) => s + res.score, 0) / r.results.length;
      return sum + resultAvg;
    }, 0) / testResults.length;

    // 按配置分组统计
    const configStats = searchConfigs.map(config => {
      const configResults = testResults.filter(r => r.configName === config.name);
      if (configResults.length === 0) return null;

      return {
        name: config.name,
        avgResponseTime: configResults.reduce((sum, r) => sum + r.responseTime, 0) / configResults.length,
        avgResultCount: configResults.reduce((sum, r) => sum + r.resultCount, 0) / configResults.length,
        avgScore: configResults.reduce((sum, r) => {
          const resultAvg = r.results.reduce((s, res) => s + res.score, 0) / r.results.length;
          return sum + resultAvg;
        }, 0) / configResults.length
      };
    }).filter(Boolean);

    return {
      overall: { avgResponseTime, avgResultCount, avgScore },
      byConfig: configStats
    };
  };

  const statistics = getStatistics();

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <PageHeader
        parentTitle="知识库管理"
        title="全局检索测试"
        description="跨知识库的检索性能测试和配置优化"
        primaryActions={[
          {
            icon: <Play size={20} />,
            label: isRunningTest ? '测试中...' : '开始测试',
            onClick: runTest,
            disabled: isRunningTest
          }
        ]}
        secondaryActions={[
          {
            icon: <Download size={20} />,
            label: '导出结果',
            onClick: exportResults,
            disabled: testResults.length === 0
          },
          {
            icon: <Upload size={20} />,
            label: '导入配置',
            onClick: () => console.log('导入配置')
          }
        ]}
        username={state.username || '管理员'}
      />

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 左侧：配置区域 */}
          <div className="xl:col-span-2 space-y-6">
            {/* 知识库选择 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Database size={18} className="mr-2 text-blue-600" />
                选择测试知识库
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableKnowledgeBases.map(kb => (
                  <div
                    key={kb.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedKnowledgeBases.includes(kb.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedKnowledgeBases(prev =>
                        prev.includes(kb.id)
                          ? prev.filter(id => id !== kb.id)
                          : [...prev, kb.id]
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{kb.name}</h4>
                        <p className="text-sm text-gray-600">{kb.description}</p>
                        <p className="text-xs text-gray-500">{kb.vectorCount} 向量</p>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedKnowledgeBases.includes(kb.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedKnowledgeBases.includes(kb.id) && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 测试查询 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Search size={18} className="mr-2 text-green-600" />
                  测试查询
                </h3>
                <Button size="sm" onClick={addTestQuery}>
                  <Plus size={14} className="mr-1" />
                  添加查询
                </Button>
              </div>
              <div className="space-y-3">
                {testQueries.map(query => (
                  <div key={query.id} className="flex items-center space-x-3">
                    <Switch
                      checked={query.enabled}
                      onChange={(checked) => updateTestQuery(query.id, { enabled: checked })}
                    />
                    <input
                      type="text"
                      value={query.query}
                      onChange={(e) => updateTestQuery(query.id, { query: e.target.value })}
                      placeholder="输入测试查询..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTestQuery(query.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 搜索配置 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Settings size={18} className="mr-2 text-purple-600" />
                  搜索配置
                </h3>
                <Button size="sm" onClick={addSearchConfig}>
                  <Plus size={14} className="mr-1" />
                  添加配置
                </Button>
              </div>
              <div className="space-y-3">
                {searchConfigs.map((config, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      selectedConfigForEdit === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={config.name}
                        onChange={(e) => updateSearchConfig(index, { ...config, name: e.target.value })}
                        className="font-medium text-gray-800 bg-transparent border-none focus:outline-none"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedConfigForEdit(
                            selectedConfigForEdit === index ? null : index
                          )}
                        >
                          <Settings size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSearchConfig(index)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>类型: {config.searchType}</span>
                      <span>Top-K: {config.topK}</span>
                      <span>召回率: {config.recallThreshold}</span>
                      {config.searchType === 'hybrid' && (
                        <span>权重: {config.semanticWeight}:{config.keywordWeight}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 配置编辑面板 */}
            {selectedConfigForEdit !== null && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <SearchControlPanel
                  knowledgeBaseId=""
                  initialConfig={searchConfigs[selectedConfigForEdit]}
                  onConfigChange={(config) => {
                    updateSearchConfig(selectedConfigForEdit, {
                      ...searchConfigs[selectedConfigForEdit],
                      ...config
                    });
                  }}
                  className="p-6"
                />
              </div>
            )}
          </div>

          {/* 右侧：测试进度和结果 */}
          <div className="space-y-6">
            {/* 测试控制 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">测试控制</h3>
              
              {isRunningTest && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>测试进度</span>
                    <span>{testProgress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${testProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">选中知识库:</span>
                  <span className="font-medium">{selectedKnowledgeBases.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">测试查询:</span>
                  <span className="font-medium">{testQueries.filter(q => q.enabled).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">搜索配置:</span>
                  <span className="font-medium">{searchConfigs.length}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">总测试数:</span>
                  <span className="font-semibold text-blue-600">
                    {selectedKnowledgeBases.length * testQueries.filter(q => q.enabled).length * searchConfigs.length}
                  </span>
                </div>
              </div>
            </div>

            {/* 测试统计 */}
            {statistics && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart3 size={18} className="mr-2 text-orange-600" />
                  测试统计
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Clock size={16} className="mx-auto mb-1 text-blue-600" />
                      <div className="text-lg font-semibold text-blue-800">
                        {statistics.overall.avgResponseTime.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-blue-600">平均响应时间</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Target size={16} className="mx-auto mb-1 text-green-600" />
                      <div className="text-lg font-semibold text-green-800">
                        {statistics.overall.avgResultCount.toFixed(1)}
                      </div>
                      <div className="text-xs text-green-600">平均结果数</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Zap size={16} className="mx-auto mb-1 text-purple-600" />
                      <div className="text-lg font-semibold text-purple-800">
                        {statistics.overall.avgScore.toFixed(3)}
                      </div>
                      <div className="text-xs text-purple-600">平均得分</div>
                    </div>
                  </div>

                  {/* 配置排名 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">配置性能排名</h4>
                    <div className="space-y-2">
                      {statistics.byConfig
                        .sort((a, b) => (b.avgScore / b.avgResponseTime) - (a.avgScore / a.avgResponseTime))
                        .map((stat, index) => (
                          <div key={stat.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded mr-2 ${
                                index === 0 ? 'bg-yellow-400' : 
                                index === 1 ? 'bg-gray-400' : 
                                index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                              }`}></div>
                              <span className="font-medium">{stat.name}</span>
                            </div>
                            <div className="text-gray-600">
                              {stat.avgResponseTime.toFixed(0)}ms | {stat.avgScore.toFixed(3)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 操作面板 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">操作</h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDetailedResults(!showDetailedResults)}
                  disabled={testResults.length === 0}
                  className="w-full"
                >
                  {showDetailedResults ? '隐藏' : '显示'}详细结果
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setTestResults([])}
                  disabled={testResults.length === 0}
                  className="w-full"
                >
                  <RefreshCw size={14} className="mr-2" />
                  清空结果
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 详细结果展示 */}
        {showDetailedResults && testResults.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">详细测试结果</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">查询</th>
                    <th className="text-left p-3 font-medium text-gray-700">配置</th>
                    <th className="text-left p-3 font-medium text-gray-700">知识库</th>
                    <th className="text-left p-3 font-medium text-gray-700">响应时间</th>
                    <th className="text-left p-3 font-medium text-gray-700">结果数</th>
                    <th className="text-left p-3 font-medium text-gray-700">平均得分</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 max-w-xs truncate">{result.query}</td>
                      <td className="p-3">{result.configName}</td>
                      <td className="p-3">{result.knowledgeBaseName}</td>
                      <td className="p-3">{result.responseTime.toFixed(0)}ms</td>
                      <td className="p-3">{result.resultCount}</td>
                      <td className="p-3">
                        {(result.results.reduce((sum, r) => sum + r.score, 0) / result.results.length).toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTestPage;