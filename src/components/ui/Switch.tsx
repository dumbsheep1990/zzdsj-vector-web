import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    disabled?: boolean;
    className?: string;
}

const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    size = 'md',
    color = '#10b981', // Default to green
    disabled = false,
    className = '',
}) => {
    const sizeClasses = {
        sm: 'w-8 h-4',
        md: 'w-10 h-5',
        lg: 'w-12 h-6',
    };

    const thumbSizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    const thumbPositionClasses = {
        sm: checked ? 'translate-x-4' : 'translate-x-0.5',
        md: checked ? 'translate-x-5' : 'translate-x-0.5',
        lg: checked ? 'translate-x-6' : 'translate-x-0.5',
    };

    return (
        <button
            type="button"
            className={`relative inline-flex ${sizeClasses[size]} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            style={{ backgroundColor: checked ? color : '#e5e7eb' }}
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            role="switch"
            aria-checked={checked}
        >
            <span
                className={`pointer-events-none inline-block ${thumbSizeClasses[size]} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${thumbPositionClasses[size]}`}
            />
        </button>
    );
};

export { Switch };
