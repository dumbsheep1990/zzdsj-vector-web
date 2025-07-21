import { useState, useCallback, useEffect } from 'react';
import { AssistantCategory } from '../types/assistant';

interface UseAssistantCategoriesReturn {
  activeCategory: AssistantCategory;
  setActiveCategory: (category: AssistantCategory) => void;
  switchCategory: (category: AssistantCategory) => void;
}

export function useAssistantCategories(
  initialCategory: AssistantCategory = AssistantCategory.BASIC_CHAT
): UseAssistantCategoriesReturn {
  const [activeCategory, setActiveCategory] = useState<AssistantCategory>(initialCategory);

  // Initialize category from URL hash or localStorage on mount
  useEffect(() => {
    // First priority: URL hash
    const hash = window.location.hash.replace('#', '');
    if (Object.values(AssistantCategory).includes(hash as AssistantCategory)) {
      setActiveCategory(hash as AssistantCategory);
      // Also save to localStorage for consistency
      localStorage.setItem('lastActiveAssistantCategory', hash);
      return;
    }

    // Second priority: localStorage
    const savedCategory = localStorage.getItem('lastActiveAssistantCategory');
    if (savedCategory && Object.values(AssistantCategory).includes(savedCategory as AssistantCategory)) {
      setActiveCategory(savedCategory as AssistantCategory);
      // Update URL to match
      const newUrl = `${window.location.pathname}${window.location.search}#${savedCategory}`;
      window.history.replaceState(null, '', newUrl);
      return;
    }

    // Default: use initial category and update URL
    const newUrl = `${window.location.pathname}${window.location.search}#${initialCategory}`;
    window.history.replaceState(null, '', newUrl);
    localStorage.setItem('lastActiveAssistantCategory', initialCategory);
  }, [initialCategory]);

  // Update URL when category changes
  const switchCategory = useCallback((category: AssistantCategory) => {
    setActiveCategory(category);
    
    // Update URL hash without triggering page reload
    const newUrl = `${window.location.pathname}${window.location.search}#${category}`;
    window.history.replaceState(null, '', newUrl);
    
    // Store in localStorage for persistence
    localStorage.setItem('lastActiveAssistantCategory', category);
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (Object.values(AssistantCategory).includes(hash as AssistantCategory)) {
        setActiveCategory(hash as AssistantCategory);
        localStorage.setItem('lastActiveAssistantCategory', hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return {
    activeCategory,
    setActiveCategory,
    switchCategory
  };
}