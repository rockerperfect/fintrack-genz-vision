/**
 * Dashboard.tsx
 *
 * Main dashboard component for Fintrack GenZ Vision.
 * - Displays user balance, budget, savings, streak, achievements, and recent transactions.
 * - Integrates SavingsGoal, SpendingFeedback, and AchievementBadge components.
 * - Mobile-first, gamified UI for Gen Z users.
 *
 * Dependencies:
 * - Lucide React icons for visual representation
 * - UI primitives: Card, Button, Progress, Badge
 *
 * Edge Cases & Limitations:
 * - All data is currently mock/static; replace with API integration.
 * - Transaction and achievement types should be extended for real use cases.
 *
 * TODO: Add backend integration, error handling, and accessibility improvements.
 */

/**
 * Main Dashboard Component - Mobile-First Finance App for Gen Z
 * 
 * Features:
 * - Gamified saving goals with progress tracking
 * - Real-time spending feedback with visual indicators
 * - Interactive achievement system
 * - Mobile-responsive design with swipe gestures
 * - Vibrant, engaging UI elements
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Target, 
  TrendingUp, 
  Trophy, 
  Zap, 
  Star,
  PiggyBank,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Flame
} from 'lucide-react';
import { SpendingFeedback } from './SpendingFeedback';
import { SavingsGoal } from './SavingsGoal';
import { AchievementBadge } from './AchievementBadge';
import { TransactionHistory } from './TransactionHistory';

function getLocalTransactions() {
  return JSON.parse(localStorage.getItem('transactions') || '[]');
}

function calculateDashboardData(transactions) {
  let balance = 0;
  let spent = 0;
  let savings = 0;
  const monthlyBudget = 3500;
  const savingsGoal = 5000;
  let streak = 0;
  let level = 1;
  let achievements = [];
  const recentTransactions = transactions.slice(0, 5).map(txn => ({
    ...txn,
    timestamp: new Date(txn.timestamp)
  }));
  transactions.forEach(txn => {
    if (txn.type === 'income') balance += Number(txn.amount);
    else balance -= Number(txn.amount);
    if (txn.type === 'expense') spent += Number(txn.amount);
    if (txn.type === 'income') savings += Number(txn.amount);
  });
  // Streak: count consecutive days with transactions
  let lastDate = null;
  transactions.forEach(txn => {
    const txnDate = new Date(txn.timestamp).toDateString();
    if (lastDate === null || txnDate === lastDate) {
      streak++;
      lastDate = txnDate;
    }
  });
  // Level: based on number of transactions
  level = Math.max(1, Math.floor(transactions.length / 5));
  // Achievements: simple demo
  achievements = [
    {
      id: '1',
      title: 'Savings Streak',
      description: 'Save money for 7 days in a row',
      icon: 'flame',
      unlocked: streak >= 7,
      progress: streak,
      maxProgress: 7
    },
    {
      id: '2',
      title: 'Budget Master',
      description: 'Stay under budget for 3 months',
      icon: 'trophy',
      unlocked: spent < monthlyBudget * 3,
      progress: spent,
      maxProgress: monthlyBudget * 3
    },
    {
      id: '3',
      title: 'Emergency Fund',
      description: 'Build $1000 emergency fund',
      icon: 'star',
      unlocked: savings >= 1000,
      progress: savings,
      maxProgress: 1000
    }
  ];
  return {
    balance,
    monthlyBudget,
    spent,
    savings,
    savingsGoal,
    streak,
    level,
    achievements,
    recentTransactions
  };
}

export function Dashboard() {
  const [data, setData] = useState(calculateDashboardData(getLocalTransactions()));

  useEffect(() => {
    function updateDashboard() {
      setData(calculateDashboardData(getLocalTransactions()));
    }
    window.addEventListener('transactionsUpdated', updateDashboard);
    updateDashboard();
    return () => window.removeEventListener('transactionsUpdated', updateDashboard);
  }, []);

  // Quick Actions
  function handleSaveMoney() {
    const txn = {
      id: `txn_${Date.now()}`,
      amount: 50,
      description: 'Saved Money',
      category: 'Savings',
      timestamp: new Date().toISOString(),
      type: 'income'
    };
    const txns = getLocalTransactions();
    txns.unshift(txn);
    localStorage.setItem('transactions', JSON.stringify(txns));
    window.dispatchEvent(new Event('transactionsUpdated'));
  }
  function handleSetGoal() {
    alert('Goal setting coming soon!');
  }
  function handleAddIncome() {
    const txn = {
      id: `txn_${Date.now()}`,
      amount: 100,
      description: 'Added Income',
      category: 'Income',
      timestamp: new Date().toISOString(),
      type: 'income'
    };
    const txns = getLocalTransactions();
    txns.unshift(txn);
    localStorage.setItem('transactions', JSON.stringify(txns));
    window.dispatchEvent(new Event('transactionsUpdated'));
  }

  const spendingPercentage = (data.spent / data.monthlyBudget) * 100;
  const savingsPercentage = (data.savings / data.savingsGoal) * 100;
  const remainingBudget = data.monthlyBudget - data.spent;

  return (
    <div className="min-h-screen bg-background p-4 space-y-8 pb-24">
      {/* Header with Level and Streak - More professional */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Good morning! 👋
          </h1>
          <p className="text-muted-foreground text-sm">Let's check your financial progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium border border-primary/20">
            Level {data.level}
          </div>
          <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-2 rounded-lg border border-success/20">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{data.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Balance Card - Professional styling */}
      <Card className="border shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Total Balance</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-foreground">
              ${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">+12.5% this month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending Feedback */}
      <SpendingFeedback 
        spent={data.spent}
        budget={data.monthlyBudget}
        remaining={remainingBudget}
      />

      {/* Savings Goal */}
      <SavingsGoal 
        current={data.savings}
        goal={data.savingsGoal}
        percentage={savingsPercentage}
      />

      {/* Achievements */}
      <Card className="border shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-warning" />
            </div>
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.achievements.map((achievement) => (
            <AchievementBadge 
              key={achievement.id}
              achievement={achievement}
            />
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions - Professional buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <div className="mobile-grid gap-4">
          <button 
            onClick={handleSaveMoney}
            className="touch-target bg-primary text-primary-foreground p-4 rounded-lg flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <PiggyBank className="w-6 h-6" />
            <span className="text-sm font-medium">Save Money</span>
          </button>
          <button 
            onClick={handleSetGoal}
            className="touch-target bg-secondary text-secondary-foreground p-4 rounded-lg flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <Target className="w-6 h-6" />
            <span className="text-sm font-medium">Set Goal</span>
          </button>
          <button 
            onClick={handleAddIncome}
            className="touch-target bg-success text-success-foreground p-4 rounded-lg flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <DollarSign className="w-6 h-6" />
            <span className="text-sm font-medium">Add Income</span>
          </button>
        </div>
      </div>

      {/* Transaction History (full list, replaces static recent activity) */}
      <TransactionHistory />
    </div>
  );
}