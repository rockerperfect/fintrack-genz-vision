/**
 * Savings Goal Component - Gamified savings progress tracking
 * 
 * Features:
 * - Visual progress tracking with milestone markers
 * - Motivational messaging and achievements
 * - Interactive goal adjustment
 * - Celebration animations for milestones
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, Target, Star, Zap, Trophy } from 'lucide-react';

interface SavingsGoalProps {
  current: number;
  goal: number;
  percentage: number;
}

export function SavingsGoal({ current, goal, percentage }: SavingsGoalProps) {
  const remaining = goal - current;
  const isGoalReached = percentage >= 100;
  
  // Calculate milestone achievements
  const milestones = [25, 50, 75, 100];
  const currentMilestone = milestones.find(milestone => percentage < milestone) || 100;
  const completedMilestones = milestones.filter(milestone => percentage >= milestone);

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (percentage >= 100) {
      return {
        title: "Goal Crushed! 🎉",
        message: "You've reached your savings goal!",
        action: "Set New Goal"
      };
    } else if (percentage >= 75) {
      return {
        title: "Almost There! 🚀",
        message: "You're so close to your goal!",
        action: "Keep Going"
      };
    } else if (percentage >= 50) {
      return {
        title: "Halfway Hero! ⭐",
        message: "You're making great progress!",
        action: "Stay Strong"
      };
    } else if (percentage >= 25) {
      return {
        title: "Getting Started! 💪",
        message: "Nice momentum, keep it up!",
        action: "Add More"
      };
    } else {
      return {
        title: "Begin Your Journey! 🌱",
        message: "Every dollar saved is progress!",
        action: "Start Saving"
      };
    }
  };

  const motivation = getMotivationalMessage();

  return (
    <Card className="card-glow border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          Savings Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-outfit font-bold text-foreground">
              ${current.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">
              of ${goal.toLocaleString()} goal
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-semibold ${
              isGoalReached ? 'text-success' : 'text-primary'
            }`}>
              {percentage.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {isGoalReached ? 'Complete!' : `$${remaining.toLocaleString()} to go`}
            </p>
          </div>
        </div>

        {/* Enhanced Progress Bar with Milestones */}
        <div className="space-y-2">
          <div className="relative">
            <Progress 
              value={Math.min(percentage, 100)} 
              className={`progress-glow h-4 ${
                isGoalReached ? 'bg-success/20' : 'bg-primary/20'
              }`}
            />
            
            {/* Milestone Markers */}
            <div className="absolute top-0 left-0 w-full h-4 flex items-center">
              {milestones.map((milestone) => (
                <div
                  key={milestone}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
                >
                  <div className={`w-2 h-2 rounded-full border-2 border-background ${
                    percentage >= milestone 
                      ? 'bg-success shadow-success' 
                      : 'bg-muted border-muted-foreground'
                  }`} />
                  {milestone < 100 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {milestone}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Badges */}
        {completedMilestones.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {completedMilestones.map((milestone) => (
              <Badge 
                key={milestone}
                className="achievement-badge text-xs px-2 py-1"
              >
                <Star className="w-3 h-3 mr-1" />
                {milestone}% Club
              </Badge>
            ))}
          </div>
        )}

        {/* Motivational Section */}
        <div className={`p-3 rounded-xl border-2 ${
          isGoalReached 
            ? 'bg-success/10 border-success/20 text-success' 
            : 'bg-primary/10 border-primary/20 text-primary'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {isGoalReached ? (
              <Trophy className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <p className="font-semibold text-sm">{motivation.title}</p>
          </div>
          <p className="text-xs opacity-80">{motivation.message}</p>
        </div>

        {/* Action Button */}
        <Button 
          variant={isGoalReached ? "success" : "game"} 
          className="w-full"
        >
          <PiggyBank className="w-4 h-4 mr-2" />
          {motivation.action}
        </Button>

        {/* Quick Add Options */}
        {!isGoalReached && (
          <div className="grid grid-cols-3 gap-2">
            {[10, 25, 50].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                className="text-xs border-primary/20 hover:bg-primary/10"
              >
                +${amount}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}