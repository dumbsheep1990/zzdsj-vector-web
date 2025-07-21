"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  onItemClick?: (item: NavItem) => void
  initialActiveTab?: string
}

export function NavBar({ items, className, onItemClick, initialActiveTab }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab || items[0]?.name || '')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleItemClick = (item: NavItem) => {
    setActiveTab(item.name)
    onItemClick?.(item)
  }

  return (
    <div
      className={cn(
        "flex justify-center w-full",
        className,
      )}
    >
      <div 
        className="flex items-center gap-0"
        role="tablist"
        aria-label="Assistant categories"
      >
        {items.map((item, index) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item)}
              className={cn(
                "relative cursor-pointer text-sm font-medium px-4 py-2 transition-all duration-200",
                "text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isActive && "text-blue-600 bg-blue-50",
                "border-b-2 border-transparent",
                isActive && "border-blue-600"
              )}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${item.name}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  const currentIndex = items.findIndex(i => i.name === activeTab);
                  let nextIndex;
                  if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                  } else {
                    nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                  }
                  handleItemClick(items[nextIndex]);
                }
              }}
            >
              <span className="hidden md:flex items-center space-x-2">
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                <span>{item.name}</span>
              </span>
              <span className="md:hidden" title={item.name}>
                <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
                <span className="sr-only">{item.name}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}