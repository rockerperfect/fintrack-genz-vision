/**
 * Achievement Badge Component - Gamified achievement system
 * 
 * Features:
 * - Visual achievement representation with icons
 * - Progress tracking for ongoing achievements
 * - Unlock animations and visual feedback
 * - Different achievement types and rarities
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Shield, 
  Zap,
  Crown,
  Medal,
  Award
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { title, description, icon, unlocked, progress, maxProgress } = achievement;
  const progressPercentage = (progress / maxProgress) * 100;
  
  // Map icon strings to components
  const iconMap: Record<string, React.ComponentType<any>> = {
    trophy: Trophy,
    star: Star,
    flame: Flame,
    target: Target,
    shield: Shield,
    zap: Zap,
    crown: Crown,
    medal: Medal,
    award: Award
  };

  const IconComponent = iconMap[icon] || Trophy;

  // Get achievement rarity and styling
  const getAchievementStyling = () => {
    if (unlocked) {
      // Determine rarity based on achievement type or other factors
      const isRare = ['Emergency Fund', 'Budget Master'].includes(title);
      const isLegendary = title.includes('Streak') && progress >= 30;
      
      if (isLegendary) {
        return {
          containerClass: 'bg-gradient-to-r from-gold/20 to-gold/10 border-gold/30',
          iconClass: 'text-gold',
          badgeClass: 'bg-gold text-black',
          glowClass: 'shadow-[0_0_20px_hsl(var(--gold)/0.5)]'
        };
      } else if (isRare) {
        return {
          containerClass: 'bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary/30',
          iconClass: 'text-secondary',
          badgeClass: 'bg-secondary text-white',
          glowClass: 'shadow-[0_0_20px_hsl(var(--secondary)/0.3)]'
        };
      } else {
        return {
          containerClass: 'bg-gradient-to-r from-success/20 to-success/10 border-success/30',
          iconClass: 'text-success',
          badgeClass: 'bg-success text-white',
          glowClass: 'shadow-[0_0_20px_hsl(var(--success)/0.3)]'
        };
      }
    } else {
      return {
        containerClass: 'bg-muted/30 border-muted',
        iconClass: 'text-muted-foreground',
        badgeClass: 'bg-muted text-muted-foreground',
        glowClass: ''
      };
    }
  };

  const styling = getAchievementStyling();

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
      styling.containerClass
    } ${unlocked ? `${styling.glowClass} hover:scale-[1.02]` : ''}`}>
      {/* Unlock Animation Overlay */}
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-xl" />
      )}
      
      <div className="relative flex items-center gap-3">
        {/* Achievement Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          unlocked 
            ? 'bg-white/20 backdrop-blur-sm' 
            : 'bg-muted/50'
        } ${unlocked ? 'animate-bounce-soft' : ''}`}>
          <IconComponent className={`w-6 h-6 ${styling.iconClass}`} />
        </div>

        {/* Achievement Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold text-sm ${
              unlocked ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {title}
            </h4>
            {unlocked && (
              <Badge className={`text-xs px-2 py-0 ${styling.badgeClass}`}>
                ✓ Unlocked
              </Badge>
            )}
          </div>
          
          <p className={`text-xs ${
            unlocked ? 'text-foreground/70' : 'text-muted-foreground'
          }`}>
            {description}
          </p>

          {/* Progress Bar for Incomplete Achievements */}
          {!unlocked && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {progress}/{maxProgress}
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-muted/30"
              />
            </div>
          )}

          {/* Achievement Completed Indicator */}
          {unlocked && progress > maxProgress && (
            <div className="mt-2 flex items-center gap-1">
              <Star className="w-3 h-3 text-gold" />
              <span className="text-xs text-gold font-medium">
                Exceeded goal! ({progress}/{maxProgress})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rare Achievement Glow Effect */}
      {unlocked && styling.glowClass && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-current to-transparent opacity-5 animate-pulse" />
      )}
    </div>
  );
}