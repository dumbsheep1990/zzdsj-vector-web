import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Space, Typography, Card } from 'antd';
import { 
  Skeleton, 
  TextSkeleton, 
  CardSkeleton, 
  StatCardSkeleton, 
  DashboardSkeleton 
} from '../components/skeleton';
import PageHeader from '../components/layout/PageHeader';

const { Title, Text } = Typography;

const SkeletonDemo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  // 模拟加载效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 重新触发加载效果
  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <PageHeader 
        title="骨架屏组件库" 
        description="提供各种加载状态的骨架屏组件，以提升用户体验"
      />
      
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={handleReload}>
          {loading ? '加载中...' : '重新加载'}
        </Button>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="基础骨架屏组件">
            <Row gutter={[24, 24]}>
              <Col span={6}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>文本骨架屏</Title>
                  {loading ? (
                    <TextSkeleton lines={3} spacing={10} brandColor />
                  ) : (
                    <>
                      <Text>这是第一行文本内容</Text>
                      <Text>这是第二行较长一些的文本内容</Text>
                      <Text>这是最后一行文本</Text>
                    </>
                  )}
                </Space>
              </Col>
              
              <Col span={6}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>圆形骨架屏</Title>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {loading ? (
                      <>
                        <Skeleton variant="circle" width={40} height={40} animation="pulse" brandColor />
                        <Skeleton variant="circle" width={60} height={60} animation="pulse" brandColor />
                        <Skeleton variant="circle" width={40} height={40} animation="pulse" brandColor />
                      </>
                    ) : (
                      <>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #222222, #666666)' }}></div>
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #222222, #666666)' }}></div>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #222222, #666666)' }}></div>
                      </>
                    )}
                  </div>
                </Space>
              </Col>
              
              <Col span={6}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>矩形骨架屏</Title>
                  {loading ? (
                    <>
                      <Skeleton width="100%" height={30} animation="pulse" brandColor style={{ marginBottom: '10px' }} />
                      <Skeleton width="80%" height={30} animation="pulse" brandColor />
                    </>
                  ) : (
                    <>
                      <div style={{ width: '100%', height: 30, background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.2), rgba(100, 100, 100, 0.2))', borderRadius: 4, marginBottom: '10px' }}></div>
                      <div style={{ width: '80%', height: 30, background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.2), rgba(100, 100, 100, 0.2))', borderRadius: 4 }}></div>
                    </>
                  )}
                </Space>
              </Col>
              
              <Col span={6}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5}>带渐变边框骨架屏</Title>
                  {loading ? (
                    <Skeleton width="100%" height={80} animation="pulse" gradientBorder withShadow />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: 80, 
                      borderRadius: 8,
                      position: 'relative',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 8,
                        padding: '2px',
                        background: 'linear-gradient(135deg, #222222, #666666)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        pointerEvents: 'none'
                      }}></div>
                    </div>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="卡片骨架屏">
            {loading ? (
              <CardSkeleton 
                hasHeader
                hasIcon
                iconPosition="left"
                hasContent
                contentLines={3}
                hasFooter
                height={200}
              />
            ) : (
              <div className="frosted-glass-card" style={{ 
                height: 200, 
                padding: '16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 8,
                  padding: '2px',
                  background: 'linear-gradient(135deg, #00c9ff, #92fe9d)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none'
                }}></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #222222, #666666)', marginRight: '12px' }}></div>
                  <h3>卡片标题示例</h3>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <p>这是卡片内容第一行文本</p>
                  <p>这是卡片内容第二行文本，稍微长一点</p>
                  <p>这是卡片内容第三行文本</p>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <Button type="primary" style={{ borderRadius: '4px' }}>操作按钮</Button>
                </div>
              </div>
            )}
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="统计卡片骨架屏">
            {loading ? (
              <StatCardSkeleton 
                subCardCount={2}
                subCardDirection="row"
                height={200}
              />
            ) : (
              <div className="frosted-glass-card" style={{ 
                height: 200, 
                padding: '16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 8,
                  padding: '2px',
                  background: 'linear-gradient(135deg, #00c9ff, #92fe9d)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none'
                }}></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #222222, #666666)', marginRight: '12px' }}></div>
                  <h3>统计数据</h3>
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  marginTop: '12px' 
                }}>
                  <div style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 8,
                      padding: '2px',
                      background: 'linear-gradient(135deg, rgba(0, 201, 255, 0.1), rgba(146, 254, 157, 0.1))',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      pointerEvents: 'none'
                    }}></div>
                    <div className="text-gray-400 text-sm">总计数量</div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #00c9ff, #92fe9d)', marginRight: '8px' }}></div>
                      <span style={{ fontSize: '24px', fontWeight: 600 }}>1,234</span>
                    </div>
                  </div>
                  <div style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 8,
                      padding: '2px',
                      background: 'linear-gradient(135deg, rgba(0, 201, 255, 0.1), rgba(146, 254, 157, 0.1))',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      pointerEvents: 'none'
                    }}></div>
                    <div className="text-gray-400 text-sm">今日新增</div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #00c9ff, #92fe9d)', marginRight: '8px' }}></div>
                      <span style={{ fontSize: '24px', fontWeight: 600 }}>123</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Col>
        
        <Col span={24}>
          <Card title="Dashboard 骨架屏预览">
            <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
              {loading ? (
                <DashboardSkeleton />
              ) : (
                <div style={{ padding: '16px' }}>
                  <h2>Dashboard 内容已加载完成</h2>
                  <p>这是一个展示 Dashboard 骨架屏效果的示例。</p>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SkeletonDemo;
