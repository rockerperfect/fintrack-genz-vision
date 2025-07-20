/**
 * SavingsGoal.tsx
 *
 * Gamified savings goal component for Fintrack GenZ Vision dashboard.
 * - Displays current savings, goal, progress percentage, and motivational messaging.
 * - Shows milestone markers and celebration animations for goal achievement.
 *
 * Dependencies:
 * - Lucide React icons for visual representation
 * - UI primitives: Card, Progress, Button, Badge
 *
 * Edge Cases & Limitations:
 * - Progress capped at 100%; negative values not allowed.
 * - Milestone logic assumes fixed percentages.
 *
 * TODO: Add goal adjustment, backend integration, and accessibility improvements.
 */

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

 /**
 * SavingsGoal
 * Renders savings goal progress and motivational messaging.
 * @param {SavingsGoalProps} props - Current, goal, and percentage
 * @returns {JSX.Element} Savings goal UI
 */
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
    <Card className="border shadow-sm bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          Savings Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Progress Overview */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-foreground">
              ${current.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-sm text-muted-foreground">
              of ${goal.toLocaleString('en-US', { minimumFractionDigits: 2 })} goal
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-semibold ${
              isGoalReached ? 'text-success' : 'text-primary'
            }`}>
              {percentage.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {isGoalReached ? 'Complete!' : `$${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} to go`}
            </p>
          </div>
        </div>

        {/* Professional Progress Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Progress 
              value={Math.min(percentage, 100)} 
              className={`h-2 ${
                isGoalReached ? 'bg-success/10' : 'bg-primary/10'
              }`}
            />
            
            {/* Milestone Markers */}
            <div className="absolute top-0 left-0 w-full h-2 flex items-center">
              {milestones.map((milestone) => (
                <div
                  key={milestone}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    percentage >= milestone 
                      ? 'bg-success' 
                      : 'bg-muted-foreground/30'
                  }`} />
                  {milestone < 100 && milestone % 25 === 0 && (
                    <span className="text-xs text-muted-foreground mt-2">
                      {milestone}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Achievements */}
        {completedMilestones.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {completedMilestones.map((milestone) => (
              <Badge 
                key={milestone}
                variant="secondary"
                className="text-xs px-2 py-1 bg-success/10 text-success border-success/20"
              >
                <Star className="w-3 h-3 mr-1" />
                {milestone}% Milestone
              </Badge>
            ))}
          </div>
        )}

        {/* Motivational Section */}
        <div className={`p-4 rounded-lg border ${
          isGoalReached 
            ? 'bg-success/5 border-success/20 text-success' 
            : 'bg-primary/5 border-primary/20 text-primary'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {isGoalReached ? (
              <Trophy className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <p className="font-medium text-sm">{motivation.title}</p>
          </div>
          <p className="text-xs text-muted-foreground">{motivation.message}</p>
        </div>

        {/* Action Button */}
        <Button 
          className={`w-full h-11 ${
            isGoalReached 
              ? 'bg-success hover:bg-success/90 text-success-foreground' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
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
                className="text-xs h-9 border-border hover:bg-muted/50"
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