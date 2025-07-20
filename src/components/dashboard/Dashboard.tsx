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

interface DashboardData {
  balance: number;
  monthlyBudget: number;
  spent: number;
  savings: number;
  savingsGoal: number;
  streak: number;
  level: number;
  achievements: Achievement[];
  recentTransactions: Transaction[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  timestamp: Date;
  type: 'income' | 'expense';
}

export function Dashboard() {
  // Mock data - would come from API/state management
  const [data, setData] = useState<DashboardData>({
    balance: 2847.52,
    monthlyBudget: 3500,
    spent: 1652.48,
    savings: 1250.00,
    savingsGoal: 5000,
    streak: 12,
    level: 7,
    achievements: [
      {
        id: '1',
        title: 'Savings Streak',
        description: 'Save money for 7 days in a row',
        icon: 'flame',
        unlocked: true,
        progress: 12,
        maxProgress: 7
      },
      {
        id: '2',
        title: 'Budget Master',
        description: 'Stay under budget for 3 months',
        icon: 'trophy',
        unlocked: false,
        progress: 2,
        maxProgress: 3
      },
      {
        id: '3',
        title: 'Emergency Fund',
        description: 'Build $1000 emergency fund',
        icon: 'star',
        unlocked: true,
        progress: 1250,
        maxProgress: 1000
      }
    ],
    recentTransactions: [
      {
        id: '1',
        amount: -15.49,
        description: 'Coffee shop',
        category: 'Food',
        timestamp: new Date(),
        type: 'expense'
      },
      {
        id: '2',
        amount: -45.00,
        description: 'Gas station',
        category: 'Transport',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        type: 'expense'
      }
    ]
  });

  const spendingPercentage = (data.spent / data.monthlyBudget) * 100;
  const savingsPercentage = (data.savings / data.savingsGoal) * 100;
  const remainingBudget = data.monthlyBudget - data.spent;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header with Level and Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-foreground">
            Hey there! 👋
          </h1>
          <p className="text-muted-foreground">Ready to crush your goals?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="achievement-badge px-3 py-1 rounded-full text-sm font-bold text-white">
            Level {data.level}
          </div>
          <div className="flex items-center gap-1 bg-warning/10 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">{data.streak}</span>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="card-glow border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Balance</span>
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-outfit font-bold text-foreground">
              ${data.balance.toLocaleString()}
            </h2>
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-success" />
              <span className="text-sm text-success">+12.5% this month</span>
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
      <Card className="card-glow border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-gold" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.achievements.map((achievement) => (
            <AchievementBadge 
              key={achievement.id}
              achievement={achievement}
            />
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mobile-grid gap-3">
        <Button variant="game" size="xl" className="h-16 rounded-2xl flex-col gap-1">
          <PiggyBank className="w-6 h-6" />
          <span className="text-sm font-semibold">Save Money</span>
        </Button>
        <Button variant="game" size="xl" className="h-16 rounded-2xl flex-col gap-1">
          <Target className="w-6 h-6" />
          <span className="text-sm font-semibold">Set Goal</span>
        </Button>
        <Button variant="game" size="xl" className="h-16 rounded-2xl flex-col gap-1">
          <DollarSign className="w-6 h-6" />
          <span className="text-sm font-semibold">Add Income</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card className="card-glow border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'expense' ? 'bg-destructive/10' : 'bg-success/10'
                }`}>
                  {transaction.type === 'expense' ? 
                    <ArrowDown className="w-5 h-5 text-destructive" /> : 
                    <ArrowUp className="w-5 h-5 text-success" />
                  }
                </div>
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'expense' ? 'text-destructive' : 'text-success'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}