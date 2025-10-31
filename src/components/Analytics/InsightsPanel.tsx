import { Card } from '@/components/ui/card';
import { Insights } from '@/hooks/useAnalyticsData';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';

interface InsightsPanelProps {
  insights: Insights;
  totalContacts: number;
}

export const InsightsPanel = ({ insights, totalContacts }: InsightsPanelProps) => {
  const getMilestone = (count: number) => {
    if (count >= 500) return { title: 'Super Connector', emoji: '🌟' };
    if (count >= 100) return { title: 'Network Champion', emoji: '🏆' };
    if (count >= 50) return { title: 'Connection Builder', emoji: '🚀' };
    if (count >= 10) return { title: 'Networking Novice', emoji: '🌱' };
    return { title: 'Getting Started', emoji: '👋' };
  };

  const milestone = getMilestone(totalContacts);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Insights & Achievements</h3>
      </div>

      <div className="space-y-4">
        {/* Milestone Badge */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{milestone.emoji}</span>
            <div>
              <p className="font-semibold text-primary">{milestone.title}</p>
              <p className="text-sm text-muted-foreground">{totalContacts} contacts and counting!</p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          {insights.topEvent && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Top Networking Event</p>
                <p className="text-sm text-muted-foreground">
                  {insights.topEvent.name} ({insights.topEvent.count} contacts)
                </p>
              </div>
            </div>
          )}

          {insights.mostActiveDay !== 'N/A' && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Most Active Day</p>
                <p className="text-sm text-muted-foreground">
                  You're most active on {insights.mostActiveDay}s
                </p>
              </div>
            </div>
          )}

          {insights.networkingStreak > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Networking Streak</p>
                <p className="text-sm text-muted-foreground">
                  {insights.networkingStreak} day{insights.networkingStreak !== 1 ? 's' : ''} streak! 🔥
                </p>
              </div>
            </div>
          )}

          {insights.avgContactsPerEvent > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Average Contacts per Event</p>
                <p className="text-sm text-muted-foreground">
                  {insights.avgContactsPerEvent.toFixed(1)} contacts on average
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Encouragement Message */}
        {totalContacts > 0 && (
          <div className="p-4 rounded-lg bg-accent/30 border border-border">
            <p className="text-sm text-muted-foreground">
              {totalContacts < 10 && "Great start! Keep building your network, one connection at a time."}
              {totalContacts >= 10 && totalContacts < 50 && "You're building momentum! Your network is growing steadily."}
              {totalContacts >= 50 && totalContacts < 100 && "Impressive network! You're becoming a true connector."}
              {totalContacts >= 100 && "Outstanding networking! You're a super connector with an amazing network."}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
