import React from 'react';

interface TabsContainerProps {
    children: React.ReactNode;
}

interface TabButtonProps {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ children }) => {
    return (
        <div className="inline-flex items-center justify-center h-full w-auto space-x-1">
            {children}
        </div>
    );
};

export const TabButton: React.FC<TabButtonProps> = ({ children, active, onClick }) => {
    return (
        <button
            className={`
                h-full px-4 flex items-center justify-center font-medium text-sm transition-all duration-200 ease-in-out
                ${active ? 
                    'bg-white text-blue-600 shadow-sm rounded-md border border-gray-200' : 
                    'text-gray-600 hover:bg-gray-50 rounded-md'}
            `}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
