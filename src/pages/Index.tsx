/**
 * Main Finance App - Gen Z Personal Finance & Investment App
 * 
 * Features:
 * - Mobile-first responsive design
 * - Gamified saving goals and achievements
 * - Real-time spending feedback
 * - Interactive bottom navigation
 * - Vibrant, engaging UI for Gen Z users
 */

import React, { useState } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { GoalsPage } from '@/components/goals/GoalsPage';
import { BottomNav } from '@/components/navigation/BottomNav';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'goals':
        return <GoalsPage />;
      case 'add':
        return <div className="min-h-screen bg-background p-4 pb-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-outfit font-bold mb-4">Add Transaction</h2>
            <p className="text-muted-foreground">Quick add feature coming soon!</p>
          </div>
        </div>;
      case 'insights':
        return <div className="min-h-screen bg-background p-4 pb-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-outfit font-bold mb-4">Insights</h2>
            <p className="text-muted-foreground">Analytics and insights coming soon!</p>
          </div>
        </div>;
      case 'profile':
        return <div className="min-h-screen bg-background p-4 pb-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-outfit font-bold mb-4">Profile</h2>
            <p className="text-muted-foreground">User profile coming soon!</p>
          </div>
        </div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveTab()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
