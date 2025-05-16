declare module 'react-quill' {
  import React from 'react';
  
  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    onChange?: (content: string) => void;
    onChangeSelection?: (range: any, source: string, editor: any) => void;
    onFocus?: (range: any, source: string, editor: any) => void;
    onBlur?: (previousRange: any, source: string, editor: any) => void;
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
    className?: string;
    theme?: string;
    modules?: any;
    formats?: string[];
    placeholder?: string;
    readOnly?: boolean;
    preserveWhitespace?: boolean;
    style?: React.CSSProperties;
    tabIndex?: number;
  }
  
  declare class ReactQuill extends React.Component<ReactQuillProps> {
    focus(): void;
    blur(): void;
    getEditor(): any;
  }
  
  export default ReactQuill;
}
