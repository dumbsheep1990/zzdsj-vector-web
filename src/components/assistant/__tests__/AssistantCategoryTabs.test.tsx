import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssistantCategoryTabs } from '../AssistantCategoryTabs';
import { AssistantCategory } from '../../../types/assistant';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('AssistantCategoryTabs', () => {
  const mockOnCategoryChange = jest.fn();

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
  });

  it('renders all category tabs', () => {
    render(
      <AssistantCategoryTabs
        activeCategory={AssistantCategory.BASIC_CHAT}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('基础对话')).toBeInTheDocument();
    expect(screen.getByText('知识库问答')).toBeInTheDocument();
    expect(screen.getByText('自主规划智能体')).toBeInTheDocument();
  });

  it('calls onCategoryChange when a tab is clicked', () => {
    render(
      <AssistantCategoryTabs
        activeCategory={AssistantCategory.BASIC_CHAT}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('知识库问答'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith(AssistantCategory.KNOWLEDGE_QA);
  });

  it('applies custom className', () => {
    const { container } = render(
      <AssistantCategoryTabs
        activeCategory={AssistantCategory.BASIC_CHAT}
        onCategoryChange={mockOnCategoryChange}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});