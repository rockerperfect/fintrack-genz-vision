/**
 * Bottom Navigation Component - Mobile-first navigation
 * 
 * Features:
 * - Tab-based navigation optimized for mobile
 * - Visual indicators for active states
 * - Smooth transitions and hover effects
 * - Accessibility support
 */

import React from 'react';
import { Home, Target, TrendingUp, User, PlusCircle } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around px-4 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAddButton = item.id === 'add';
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isAddButton
                  ? 'bg-gradient-primary text-white shadow-primary hover:shadow-glow hover:-translate-y-1 hover:scale-105 scale-110 -mt-2 w-14 h-14 rounded-full font-semibold'
                  : isActive
                  ? 'bg-primary/10 text-primary scale-110'
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
              }`}
              aria-label={item.label}
            >
              {/* Active indicator */}
              {isActive && !isAddButton && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse-glow" />
              )}
              
              <Icon className={`${
                isAddButton ? 'w-6 h-6' : 'w-5 h-5'
              } transition-transform duration-200`} />
              
              {!isAddButton && (
                <span className={`text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}