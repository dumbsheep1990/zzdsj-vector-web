import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/skeleton.css';
// 最后导入样式覆盖，确保最高优先级
import './styles/overrideStyles.css';
import App from './App';

// Stagewise 开发工具栏（仅在开发环境中启用）
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { stagewiseConfig } from './stagewise.config';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// StagewiseToolbar 包装器，防止重复初始化
const StagewiseToolbarWrapper: React.FC = () => {
    const initialized = useRef(false);
    const [shouldRender, setShouldRender] = React.useState(false);

    useEffect(() => {
        if (!initialized.current && process.env.NODE_ENV === 'development') {
            // 延迟渲染，确保只初始化一次
            const timer = setTimeout(() => {
                initialized.current = true;
                setShouldRender(true);
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, []);

    if (!shouldRender || process.env.NODE_ENV !== 'development') {
        return null;
    }

    return <StagewiseToolbar />;
};

// 开发环境组件包装器
const AppWithDevTools = () => (
    <>
        <App />
        {/* 使用包装器防止重复初始化 */}
        <StagewiseToolbarWrapper />
    </>
);

root.render(<AppWithDevTools />);