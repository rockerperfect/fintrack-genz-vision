/**
 * Goals Page Component - Gamified savings goals management
 * 
 * Features:
 * - Multiple savings goals with visual progress
 * - Goal creation with templates
 * - Achievement tracking per goal
 * - Social sharing of achievements
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Plus, 
  Car, 
  Home, 
  Plane, 
  GraduationCap,
  Heart,
  Gift,
  Trophy,
  Calendar
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  category: string;
  icon: string;
  color: string;
}

export function GoalsPage() {
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      description: '6 months of expenses saved',
      target: 12000,
      current: 4500,
      deadline: new Date('2024-12-31'),
      category: 'safety',
      icon: 'shield',
      color: 'success'
    },
    {
      id: '2',
      title: 'Dream Vacation',
      description: 'Trip to Japan in summer',
      target: 3500,
      current: 1200,
      deadline: new Date('2024-07-01'),
      category: 'travel',
      icon: 'plane',
      color: 'secondary'
    },
    {
      id: '3',
      title: 'New Car',
      description: 'Down payment for car',
      target: 8000,
      current: 2100,
      deadline: new Date('2024-10-15'),
      category: 'transport',
      icon: 'car',
      color: 'primary'
    }
  ]);

  const goalTemplates = [
    { icon: Car, title: 'Car Fund', target: 10000, color: 'primary' },
    { icon: Home, title: 'House Down Payment', target: 50000, color: 'success' },
    { icon: Plane, title: 'Travel Fund', target: 3000, color: 'secondary' },
    { icon: GraduationCap, title: 'Education', target: 15000, color: 'accent' },
    { icon: Heart, title: 'Wedding', target: 25000, color: 'warning' },
    { icon: Gift, title: 'Gift Fund', target: 500, color: 'gold' }
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-foreground">
            Your Goals 🎯
          </h1>
          <p className="text-muted-foreground">Turn dreams into reality</p>
        </div>
        <Button variant="game">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="card-glow border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-outfit font-bold text-primary">
              {goals.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Goals</div>
          </CardContent>
        </Card>
        <Card className="card-glow border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-outfit font-bold text-success">
              ${goals.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Saved</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Active Goals</h2>
        {goals.map((goal) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const isOverdue = daysRemaining < 0;
          
          return (
            <Card key={goal.id} className="card-glow border-0">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-${goal.color}/10 flex items-center justify-center`}>
                      {goal.icon === 'plane' && <Plane className={`w-6 h-6 text-${goal.color}`} />}
                      {goal.icon === 'car' && <Car className={`w-6 h-6 text-${goal.color}`} />}
                      {goal.icon === 'shield' && <Target className={`w-6 h-6 text-${goal.color}`} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <Badge variant={isOverdue ? "destructive" : "secondary"} className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`progress-glow h-3 bg-${goal.color}/10`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold text-${goal.color}`}>
                      {percentage.toFixed(1)}% complete
                    </span>
                    <span className="text-muted-foreground">
                      ${(goal.target - goal.current).toLocaleString()} remaining
                    </span>
                  </div>
                </div>

                {/* Achievement milestones */}
                {percentage >= 25 && (
                  <div className="flex flex-wrap gap-2">
                    {percentage >= 25 && (
                      <Badge className="achievement-badge text-xs px-2 py-1">
                        <Trophy className="w-3 h-3 mr-1" />
                        Quarter Way
                      </Badge>
                    )}
                    {percentage >= 50 && (
                      <Badge className="achievement-badge text-xs px-2 py-1">
                        <Trophy className="w-3 h-3 mr-1" />
                        Halfway Hero
                      </Badge>
                    )}
                    {percentage >= 75 && (
                      <Badge className="achievement-badge text-xs px-2 py-1">
                        <Trophy className="w-3 h-3 mr-1" />
                        Almost There
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Goal
                  </Button>
                  <Button variant="game" size="sm" className="flex-1">
                    Add Money
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Goal Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Popular Goals</h2>
        <div className="grid grid-cols-2 gap-3">
          {goalTemplates.map((template, index) => {
            const Icon = template.icon;
            return (
              <Card key={index} className="card-glow border-0 cursor-pointer hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center space-y-2">
                  <div className={`w-10 h-10 mx-auto rounded-full bg-${template.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${template.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{template.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      ${template.target.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}