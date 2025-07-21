import React from 'react';
import { NavBar } from '../ui/tubelight-navbar';
import { ASSISTANT_CATEGORIES } from '../../constants/assistantCategories';
import { AssistantCategory, AssistantCategoryTabsProps } from '../../types/assistant';

export function AssistantCategoryTabs({ 
  activeCategory, 
  onCategoryChange, 
  className 
}: AssistantCategoryTabsProps) {
  // Convert category configs to nav items
  const navItems = ASSISTANT_CATEGORIES.map(category => ({
    name: category.name,
    url: `#${category.id}`,
    icon: category.icon
  }));

  // Handle tab click
  const handleItemClick = (item: { name: string; url: string }) => {
    const category = ASSISTANT_CATEGORIES.find(cat => cat.name === item.name);
    if (category) {
      onCategoryChange(category.id);
    }
  };

  // Find current active category name for NavBar
  const activeCategoryConfig = ASSISTANT_CATEGORIES.find(cat => cat.id === activeCategory);
  const activeTabName = activeCategoryConfig?.name || ASSISTANT_CATEGORIES[0].name;

  return (
    <div className={className}>
      <NavBar 
        items={navItems}
        onItemClick={handleItemClick}
        initialActiveTab={activeTabName}
        className="relative"
      />
    </div>
  );
}