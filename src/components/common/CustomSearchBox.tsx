import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import './CustomSearchBox.css';

interface CustomSearchBoxProps {
  value?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  allowClear?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
  className?: string;
}

const CustomSearchBox: React.FC<CustomSearchBoxProps> = ({
  value: controlledValue,
  placeholder = '搜索...',
  onSearch,
  onChange,
  allowClear = true,
  size = 'medium',
  style,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const handleSearch = () => {
    onSearch?.(value);
  };
  
  const handleClear = () => {
    const newValue = '';
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'custom-search-small';
      case 'large':
        return 'custom-search-large';
      default:
        return 'custom-search-medium';
    }
  };
  
  return (
    <div 
      className={`custom-search-box ${getSizeClass()} ${isFocused ? 'focused' : ''} ${className}`}
      style={style}
    >
      <div className="custom-search-input-wrapper">
        <Search className="custom-search-icon" size={16} />
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="custom-search-input"
        />
        {allowClear && value && (
          <button
            type="button"
            onClick={handleClear}
            className="custom-search-clear"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleSearch}
        className="custom-search-button"
      >
        搜索
      </button>
    </div>
  );
};

export default CustomSearchBox; 