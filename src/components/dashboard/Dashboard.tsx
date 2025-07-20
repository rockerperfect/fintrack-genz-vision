/**
 * Dashboard.tsx
 *
 * Main dashboard container with improved navigation and layout.
 * - Tabbed interface for different sections (Overview, Transactions, Analytics, Goals)
 * - Real-time financial summary with quick actions
 * - Mobile-optimized responsive design with touch-friendly interfaces
 * - Comprehensive financial tracking and insights
 * - Local data persistence with event-driven updates
 *
 * Dependencies:
 * - React hooks for state management
 * - UI primitives: Card, Tabs, Button, Badge
 * - Lucide icons for navigation and visual elements
 * - Dashboard components: AddTransaction, TransactionHistory, Analytics, SavingsGoal
 *
 * Features:
 * - Quick financial overview
 * - Transaction management
 * - Analytics and insights
 * - Savings goals tracking
 * - Achievement system
 * - Real-time data synchronization
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target,
  BarChart3,
  CreditCard,
  PiggyBank,
  Calendar,
  Award,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Flame
} from 'lucide-react';

import { AddTransaction } from './AddTransaction';
import { TransactionHistory } from './TransactionHistory';
import { Analytics } from './Analytics';
import { SavingsGoal } from './SavingsGoal';
import { AchievementBadge } from './AchievementBadge';
import { SpendingFeedback } from './SpendingFeedback';

interface Transaction {
  id: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  timestamp: string;
  description: string;
}

interface SavingsGoalData {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
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

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoalData[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Get data from localStorage
  const getLocalData = () => {
    try {
      const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const storedGoals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
      setTransactions(storedTransactions);
      setSavingsGoals(storedGoals);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Update data when storage changes
  useEffect(() => {
    getLocalData();
    
    const updateData = () => getLocalData();
    window.addEventListener('transactionsUpdated', updateData);
    window.addEventListener('savingsGoalsUpdated', updateData);
    
    return () => {
      window.removeEventListener('transactionsUpdated', updateData);
      window.removeEventListener('savingsGoalsUpdated', updateData);
    };
  }, []);

  // Calculate financial summary and achievements
  const calculateSummary = () => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const monthlyTransactions = transactions.filter(t => 
      new Date(t.timestamp) >= thisMonth
    );
    
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const balance = transactions.reduce((sum, t) => 
      sum + (t.type === 'income' ? t.amount : -t.amount), 0
    );
    
    // Calculate streak (consecutive days with transactions)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasTransaction = transactions.some(t => {
        const txDate = new Date(t.timestamp);
        return txDate >= dayStart && txDate <= dayEnd;
      });
      
      if (hasTransaction) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    // Calculate level based on transactions
    const level = Math.max(1, Math.floor(transactions.length / 10));
    
    // Calculate achievements
    const totalSavings = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const achievements: Achievement[] = [
      {
        id: '1',
        title: 'Saving Streak',
        description: 'Track expenses for 7 days straight',
        icon: 'flame',
        unlocked: streak >= 7,
        progress: Math.min(streak, 7),
        maxProgress: 7
      },
      {
        id: '2',
        title: 'Transaction Master',
        description: 'Record 50 transactions',
        icon: 'trophy',
        unlocked: transactions.length >= 50,
        progress: Math.min(transactions.length, 50),
        maxProgress: 50
      },
      {
        id: '3',
        title: 'Emergency Fund',
        description: 'Save $1,000',
        icon: 'star',
        unlocked: balance >= 1000,
        progress: Math.min(balance, 1000),
        maxProgress: 1000
      }
    ];
    
    // Recent transactions (last 5)
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    // Active savings goals
    const activeGoals = savingsGoals.filter(goal => goal.currentAmount < goal.targetAmount);
    
    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      balance,
      streak,
      level,
      achievements,
      recentTransactions,
      activeGoals,
      totalTransactions: transactions.length,
      monthlyBudget: 3500 // Default budget
    };
  };

  const summary = calculateSummary();

  const getSavingsRateColor = (rate: number) => {
    if (rate >= 20) return 'text-success';
    if (rate >= 10) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Financial Dashboard</h1>
            <p className="text-muted-foreground">Track your income, expenses, and savings goals</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium border border-primary/20">
              Level {summary.level}
            </div>
            <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-2 rounded-lg border border-success/20">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">{summary.streak}</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Balance Card */}
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
                    ${summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h2>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                    <span className="text-sm text-success font-medium">
                      {summary.savingsRate.toFixed(1)}% savings rate
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border shadow-sm bg-card">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-muted-foreground">Income</span>
                  </div>
                  <div className="text-xl font-semibold text-success">
                    ${summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">This month</div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm bg-card">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-muted-foreground">Expenses</span>
                  </div>
                  <div className="text-xl font-semibold text-destructive">
                    ${summary.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">This month</div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm bg-card">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Net</span>
                  </div>
                  <div className={`text-xl font-semibold ${
                    summary.netIncome >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {summary.netIncome >= 0 ? '+' : ''}${summary.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">This month</div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm bg-card">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PiggyBank className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Savings</span>
                  </div>
                  <div className={`text-xl font-semibold ${getSavingsRateColor(summary.savingsRate)}`}>
                    {summary.savingsRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Spending Feedback Component */}
            <SpendingFeedback 
              spent={summary.totalExpenses}
              budget={summary.monthlyBudget}
              remaining={summary.monthlyBudget - summary.totalExpenses}
            />

            {/* Savings Goal Component */}
            <SavingsGoal 
              current={summary.balance}
              goal={5000}
              percentage={(summary.balance / 5000) * 100}
            />

            {/* Quick Actions */}
            <Card className="border shadow-sm bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setActiveTab('transactions')}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>Add Transaction</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('goals')}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Target className="w-6 h-6" />
                    <span>Set Goal</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            {summary.recentTransactions.length > 0 && (
              <Card className="border shadow-sm bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Recent Transactions
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('transactions')}
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {summary.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.category} • {new Date(transaction.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-success' : 'text-destructive'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            <Card className="border shadow-sm bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary.achievements.map((achievement) => (
                  <AchievementBadge 
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Empty State */}
            {summary.totalTransactions === 0 && (
              <Card className="border shadow-sm bg-card">
                <CardContent className="p-12 text-center">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <div className="text-lg font-medium text-foreground mb-2">Welcome to FinTrack!</div>
                  <div className="text-muted-foreground mb-6">
                    Start by adding your first transaction to begin tracking your finances
                  </div>
                  <Button onClick={() => setActiveTab('transactions')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <AddTransaction />
            <TransactionHistory />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <SavingsGoal 
              current={summary.balance}
              goal={5000}
              percentage={(summary.balance / 5000) * 100}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}