import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import ModelServices from '../components/modules/models/ModelServices';
import ModelConfig from '../components/modules/models/ModelConfig';
import ConfigExport from '../components/modules/models/ConfigExport';

const Models: React.FC = () => {
    const { state, setActiveSection, setActiveSubSection } = useAppContext();
    const { activeSubSection } = state;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // 确保当前活动栏目是 models
        setActiveSection('models');
        
        // 从 URL 中获取当前子页面
        const pathSegments = location.pathname.split('/');
        const currentPage = pathSegments[pathSegments.length - 1];
        
        console.log('Current page:', currentPage);
        console.log('Current activeSubSection:', activeSubSection);
        
        // 如果 URL 中有子页面，更新状态
        if (currentPage && ['model-services', 'model-config', 'config-export'].includes(currentPage)) {
            setActiveSubSection(currentPage);
        } else if (!currentPage || currentPage === 'models') {
            // 如果是根路径或 models，默认跳转到 model-services
            setActiveSubSection('model-services');
            navigate('/models/model-services', { replace: true });
        }
    }, [location.pathname, setActiveSection, setActiveSubSection, navigate]);

    const handleMenuClick = (e: { key: string }) => {
        const { key } = e;
        console.log('Menu clicked:', key);
        setActiveSubSection(key);
        navigate(`/models/${key}`, { replace: true });
    };

    const renderContent = () => {
        console.log('Rendering content for:', activeSubSection);
        switch (activeSubSection) {
            case 'model-services':
                return <ModelServices />;
            case 'model-config':
                return <ModelConfig />;
            case 'config-export':
                return <ConfigExport />;
            default:
                return <ModelServices />;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Menu
                mode="horizontal"
                selectedKeys={[activeSubSection]}
                onClick={handleMenuClick}
                className="mb-4"
            >
                <Menu.Item key="model-services">模型服务</Menu.Item>
                <Menu.Item key="model-config">模型配置</Menu.Item>
                <Menu.Item key="config-export">配置导出</Menu.Item>
            </Menu>
            <div className="flex-1">
                {renderContent()}
            </div>
        </div>
    );
};

export default Models; 