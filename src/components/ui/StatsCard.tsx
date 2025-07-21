import { FC } from 'react';
import { StatsCardProps } from '../../utils/types';

// 扩展的 StatsCard 属性接口
interface ExtendedStatsCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | string;
    subtitle?: string;
    bgGradient?: string;
}

const getColorClasses = (color: string) => {
    switch (color) {
        case 'blue':
            return {
                bg: 'bg-blue-50',
                icon: 'bg-blue-100 text-blue-600',
                border: 'border-blue-200'
            };
        case 'green':
            return {
                bg: 'bg-green-50',
                icon: 'bg-green-100 text-green-600',
                border: 'border-green-200'
            };
        case 'yellow':
            return {
                bg: 'bg-yellow-50',
                icon: 'bg-yellow-100 text-yellow-600',
                border: 'border-yellow-200'
            };
        case 'red':
            return {
                bg: 'bg-red-50',
                icon: 'bg-red-100 text-red-600',
                border: 'border-red-200'
            };
        case 'purple':
            return {
                bg: 'bg-purple-50',
                icon: 'bg-purple-100 text-purple-600',
                border: 'border-purple-200'
            };
        case 'orange':
            return {
                bg: 'bg-orange-50',
                icon: 'bg-orange-100 text-orange-600',
                border: 'border-orange-200'
            };
        default:
            return {
                bg: 'bg-gray-50',
                icon: 'bg-gray-100 text-gray-600',
                border: 'border-gray-200'
            };
    }
};

// 原有的 StatsCard 组件（向后兼容）
const LegacyStatsCard: FC<StatsCardProps> = ({ icon, title, value, color, bgGradient }) => {
    return (
        <div className={`${bgGradient} rounded-xl p-4 border`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// 新的 StatsCard 组件
const NewStatsCard: FC<ExtendedStatsCardProps> = ({ icon: Icon, title, value, color, subtitle, bgGradient }) => {
    const colorClasses = getColorClasses(color);
    
    return (
        <div className={`${bgGradient || colorClasses.bg} rounded-lg p-6 border ${colorClasses.border}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses.icon}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

// 主要导出的 StatsCard 组件，支持两种用法
const StatsCard: FC<StatsCardProps | ExtendedStatsCardProps> = (props) => {
    // 检查是否是新的接口（有 subtitle 或者 color 是预定义的颜色）
    if ('subtitle' in props || typeof props.color === 'string' && ['blue', 'green', 'yellow', 'red', 'purple', 'orange'].includes(props.color)) {
        return <NewStatsCard {...props as ExtendedStatsCardProps} />;
    }
    
    // 使用原有的接口
    return <LegacyStatsCard {...props as StatsCardProps} />;
};

export default StatsCard;
export { StatsCard };