/**
 * Spending Feedback Component - Real-time visual spending indicators
 * 
 * Provides immediate feedback on spending habits with:
 * - Color-coded spending status
 * - Dynamic progress bars with glow effects
 * - Motivational messaging
 * - Budget remaining calculations
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface SpendingFeedbackProps {
  spent: number;
  budget: number;
  remaining: number;
}

export function SpendingFeedback({ spent, budget, remaining }: SpendingFeedbackProps) {
  const spendingPercentage = (spent / budget) * 100;
  
  // Determine spending status
  const getSpendingStatus = () => {
    if (spendingPercentage <= 60) {
      return {
        status: 'good',
        icon: CheckCircle,
        message: "You're doing great! 🎉",
        description: "Staying well within budget",
        className: 'spending-good'
      };
    } else if (spendingPercentage <= 85) {
      return {
        status: 'warning',
        icon: Zap,
        message: "Getting close! ⚡",
        description: "Watch your spending this month",
        className: 'spending-warning'
      };
    } else {
      return {
        status: 'danger',
        icon: AlertTriangle,
        message: "Budget Alert! 🚨",
        description: "You've exceeded your budget",
        className: 'spending-danger'
      };
    }
  };

  const statusInfo = getSpendingStatus();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="card-glow border-0">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">Monthly Budget</span>
          </div>
          <Badge className={`${statusInfo.className} border`}>
            {statusInfo.status.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-outfit font-bold text-foreground">
                ${spent.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground">
                of ${budget.toLocaleString()} budget
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                remaining >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                ${Math.abs(remaining).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {remaining >= 0 ? 'remaining' : 'over budget'}
              </p>
            </div>
          </div>

          {/* Enhanced Progress Bar with Glow */}
          <div className="relative">
            <Progress 
              value={Math.min(spendingPercentage, 100)} 
              className={`progress-glow h-3 ${
                statusInfo.status === 'good' ? 'bg-success/10' :
                statusInfo.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
              }`}
            />
            {spendingPercentage > 100 && (
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-destructive to-destructive/80 rounded-full animate-pulse-glow" />
            )}
          </div>

          {/* Status Message */}
          <div className={`p-3 rounded-xl border ${statusInfo.className}`}>
            <p className="font-semibold text-sm">{statusInfo.message}</p>
            <p className="text-xs opacity-80">{statusInfo.description}</p>
          </div>

          {/* Daily Spending Rate */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily average:</span>
            <span className="font-medium">
              ${(spent / new Date().getDate()).toFixed(2)}/day
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}