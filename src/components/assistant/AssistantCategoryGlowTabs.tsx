import React from 'react';
import { MenuBar } from '../ui/glow-menu';
import { ASSISTANT_CATEGORIES } from '../../constants/assistantCategories';
import { AssistantCategory, AssistantCategoryTabsProps } from '../../types/assistant';

export function AssistantCategoryGlowTabs({ 
  activeCategory, 
  onCategoryChange, 
  className 
}: AssistantCategoryTabsProps) {
  // Convert category configs to menu items
  const menuItems = ASSISTANT_CATEGORIES.map(category => ({
    icon: category.icon,
    label: category.name,
    href: `#${category.id}`,
    gradient: getCategoryGradient(category.id),
    iconColor: getCategoryIconColor(category.id)
  }));

  // Handle menu item click
  const handleItemClick = (label: string) => {
    const category = ASSISTANT_CATEGORIES.find(cat => cat.name === label);
    if (category) {
      onCategoryChange(category.id);
    }
  };

  // Find current active category name for MenuBar
  const activeCategoryConfig = ASSISTANT_CATEGORIES.find(cat => cat.id === activeCategory);
  const activeItemName = activeCategoryConfig?.name || ASSISTANT_CATEGORIES[0].name;

  return (
    <div className={className}>
      <MenuBar 
        items={menuItems}
        activeItem={activeItemName}
        onItemClick={handleItemClick}
        className="relative"
      />
    </div>
  );
}

// Helper function to get category gradient
function getCategoryGradient(category: AssistantCategory): string {
  switch (category) {
    case AssistantCategory.BASIC_CHAT:
      return "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)";
    case AssistantCategory.KNOWLEDGE_QA:
      return "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)";
    case AssistantCategory.AUTONOMOUS_PLANNING:
      return "radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.06) 50%, rgba(180,83,9,0) 100%)";
    default:
      return "radial-gradient(circle, rgba(107,114,128,0.15) 0%, rgba(75,85,99,0.06) 50%, rgba(55,65,81,0) 100%)";
  }
}

// Helper function to get category icon color
function getCategoryIconColor(category: AssistantCategory): string {
  switch (category) {
    case AssistantCategory.BASIC_CHAT:
      return "text-blue-500";
    case AssistantCategory.KNOWLEDGE_QA:
      return "text-green-500";
    case AssistantCategory.AUTONOMOUS_PLANNING:
      return "text-amber-500";
    default:
      return "text-gray-500";
  }
}