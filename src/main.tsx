import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/skeleton.css';
// 最后导入样式覆盖，确保最高优先级
import './styles/overrideStyles.css';
import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);