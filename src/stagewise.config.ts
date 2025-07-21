// Stagewise 自定义配置 - 智能体构建项目专用

// 定义配置类型（如果官方类型不可用）
interface StagewisePlugin {
  name: string;
  description: string;
  shortInfoForPrompt: () => string;
  mcp: any;
  actions: Array<{
    name: string;
    description: string;
    execute: () => void;
  }>;
}

interface StagewiseConfig {
  plugins: StagewisePlugin[];
}

export const stagewiseConfig: StagewiseConfig = {
  plugins: [
    // React 插件（推荐用于 React 项目）
    ...(typeof window !== 'undefined' ? [] : []), // 服务端渲染兼容
    {
      name: 'react-devtools-enhanced',
      description: 'React 开发增强插件',
      shortInfoForPrompt: () => {
        return 'React 应用，使用 Material-UI 和自定义组件';
      },
      mcp: null,
      actions: [],
    },
    {
      name: 'agent-builder-context',
      description: '智能体构建器上下文增强插件',
      shortInfoForPrompt: () => {
        // 获取当前页面上下文
        const currentPath = window.location.pathname;
        const currentStep = window.location.search;
        
        let context = '当前正在开发智能体构建系统。';
        
        if (currentPath.includes('/agent')) {
          if (currentPath.includes('/builder')) {
            context += ' 用户在智能体构建器页面';
            if (currentStep.includes('template')) {
              context += ' - 模板选择步骤';
            }
          } else if (currentPath.includes('/template')) {
            context += ' 用户在智能体模板页面';
          }
        }
        
        // 检测当前选中的元素
        const selectedElement = document.querySelector('[data-selected="true"]');
        if (selectedElement) {
          context += ` - 当前选中: ${selectedElement.className}`;
        }
        
        return context;
      },
      mcp: null,
      actions: [
        {
          name: '分析卡片性能',
          description: '检查当前页面中的卡片组件性能问题',
          execute: () => {
            const cards = document.querySelectorAll('[class*="Card"], [class*="card"]');
            console.log('🔍 找到', cards.length, '个卡片组件');
            
            cards.forEach((card, index) => {
              const computedStyle = window.getComputedStyle(card);
              const hasComplexShadow = computedStyle.boxShadow.includes('rgba');
              const hasTransform = computedStyle.transform !== 'none';
              const hasTransition = computedStyle.transition !== 'all 0s ease 0s';
              
              console.log(`卡片 ${index + 1}:`, {
                hasComplexShadow,
                hasTransform,
                hasTransition,
                element: card
              });
            });
            
            window.alert(`已分析 ${cards.length} 个卡片组件，请查看控制台详情`);
          },
        },
        {
          name: '检查动画流畅度',
          description: '监测页面动画性能和帧率',
          execute: () => {
            let frames = 0;
            let lastTime = performance.now();
            
            function countFrames() {
              frames++;
              const currentTime = performance.now();
              
              if (currentTime - lastTime >= 1000) {
                console.log(`🎯 当前帧率: ${frames} FPS`);
                if (frames < 50) {
                  console.warn('⚠️ 帧率较低，可能存在性能问题');
                }
                frames = 0;
                lastTime = currentTime;
              }
              
              requestAnimationFrame(countFrames);
            }
            
            countFrames();
            setTimeout(() => {
              console.log('帧率监测已停止');
            }, 5000);
            
            window.alert('开始监测帧率，将持续5秒，请查看控制台');
          },
        },
        {
          name: '优化建议',
          description: '提供当前组件的优化建议',
          execute: () => {
            const suggestions = [];
            
            // 检查是否有过多的重排重绘
            const elementsWithBoxShadow = document.querySelectorAll('*').length;
            const elementsWithComplexShadows = Array.from(document.querySelectorAll('*'))
              .filter(el => {
                const style = window.getComputedStyle(el);
                return style.boxShadow && style.boxShadow !== 'none' && style.boxShadow.includes('rgba');
              }).length;
              
            if (elementsWithComplexShadows > 10) {
              suggestions.push('🎨 考虑简化阴影效果，减少重绘成本');
            }
            
            // 检查动画元素
            const animatedElements = Array.from(document.querySelectorAll('*'))
              .filter(el => {
                const style = window.getComputedStyle(el);
                return style.transition !== 'all 0s ease 0s' || style.transform !== 'none';
              }).length;
              
            if (animatedElements > 20) {
              suggestions.push('⚡ 动画元素较多，考虑使用 will-change 和硬件加速');
            }
            
            // 检查滚动容器
            const scrollContainers = Array.from(document.querySelectorAll('*'))
              .filter(el => {
                const style = window.getComputedStyle(el);
                return style.overflow === 'auto' || style.overflow === 'scroll';
              }).length;
              
            if (scrollContainers > 3) {
              suggestions.push('📜 多个滚动容器可能影响性能，考虑合并');
            }
            
            if (suggestions.length === 0) {
              suggestions.push('✅ 当前页面性能良好！');
            }
            
            console.log('🚀 优化建议:', suggestions);
            window.alert(`优化建议已生成，共 ${suggestions.length} 条，请查看控制台`);
          },
        },
      ],
    },
    {
      name: 'component-inspector',
      description: '组件检查器 - 快速了解组件结构',
      shortInfoForPrompt: () => {
        const hoveredElement = document.querySelector(':hover');
        if (hoveredElement) {
          return `当前悬停在: ${hoveredElement.tagName} 元素，类名: ${hoveredElement.className}`;
        }
        return '可以检查页面组件结构和属性';
      },
      mcp: null,
      actions: [
        {
          name: '高亮组件边界',
          description: '显示所有 React 组件的边界',
          execute: () => {
            // 移除之前的高亮
            document.querySelectorAll('.stagewise-highlight').forEach(el => {
              el.classList.remove('stagewise-highlight');
            });
            
            // 创建高亮样式
            let styleElement = document.getElementById('stagewise-highlight-styles');
            if (!styleElement) {
              styleElement = document.createElement('style');
              styleElement.id = 'stagewise-highlight-styles';
              styleElement.textContent = `
                .stagewise-highlight {
                  outline: 2px solid #ff6b6b !important;
                  outline-offset: 2px !important;
                  position: relative !important;
                }
                .stagewise-highlight::before {
                  content: attr(data-component-name);
                  position: absolute;
                  top: -20px;
                  left: 0;
                  background: #ff6b6b;
                  color: white;
                  padding: 2px 6px;
                  font-size: 10px;
                  border-radius: 2px;
                  z-index: 10000;
                }
              `;
              document.head.appendChild(styleElement);
            }
            
            // 高亮主要组件容器
            const componentSelectors = [
              '[data-agent-builder-main]',
              '[class*="Card"]',
              '[class*="Box"]',
              '[class*="Typography"]',
              '[class*="Button"]'
            ];
            
            componentSelectors.forEach(selector => {
              document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('stagewise-highlight');
                el.setAttribute('data-component-name', `${selector.replace(/[\[\]"]/g, '')}-${index}`);
              });
            });
            
            setTimeout(() => {
              document.querySelectorAll('.stagewise-highlight').forEach(el => {
                el.classList.remove('stagewise-highlight');
                el.removeAttribute('data-component-name');
              });
            }, 3000);
            
            window.alert('组件边界已高亮显示，将持续3秒');
          },
        },
      ],
    },
  ],
}; 