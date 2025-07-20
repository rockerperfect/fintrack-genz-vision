/**
 * Index.tsx
 *
 * Main finance app page for Fintrack GenZ Vision.
 * - Mobile-first, gamified UI for Gen Z users.
 * - Integrates Dashboard, GoalsPage, and BottomNav components.
 * - Handles tab switching and renders active tab content.
 *
 * Dependencies:
 * - UI primitives: Dashboard, GoalsPage, BottomNav
 *
 * Edge Cases & Limitations:
 * - All tab content is currently static; replace with API integration.
 * - Add transaction, insights, and profile features are placeholders.
 *
 * TODO: Add backend integration, error handling, and accessibility improvements.
 */

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
import { Analytics } from '@/components/dashboard/Analytics';
import { UserProfile } from '@/components/profile/UserProfile';
import { AddTransaction } from '@/components/dashboard/AddTransaction';

/**
 * Index
 * Renders the main app UI with tab navigation and content switching.
 * @returns {JSX.Element} Main app UI
 */
const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  /**
   * renderActiveTab
   * Determines and renders the content for the active tab.
   * @returns {JSX.Element} Content of the active tab
   */
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'goals':
        return <GoalsPage />;
      case 'add':
        return <AddTransaction />;
      case 'insights':
        return <Analytics />;
      case 'profile':
        return <UserProfile />;
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
