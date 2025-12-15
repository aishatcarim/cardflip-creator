import { Insights } from '@analytics/hooks/useAnalyticsData';
import { TrendingUp, Calendar, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightsPanelProps {
  insights: Insights;
  totalContacts: number;
}

export const InsightsPanel = ({ insights, totalContacts }: InsightsPanelProps) => {
  const getMilestone = (count: number) => {
    if (count >= 500) return { title: 'Super Connector', level: 5 };
    if (count >= 100) return { title: 'Network Champion', level: 4 };
    if (count >= 50) return { title: 'Connection Builder', level: 3 };
    if (count >= 10) return { title: 'Networking Novice', level: 2 };
    return { title: 'Getting Started', level: 1 };
  };

  const milestone = getMilestone(totalContacts);

  const insightItems = [
    insights.topEvent && {
      icon: TrendingUp,
      label: 'Top Event',
      value: insights.topEvent.name,
      detail: `${insights.topEvent.count} contacts`,
    },
    insights.mostActiveDay !== 'N/A' && {
      icon: Calendar,
      label: 'Most Active',
      value: `${insights.mostActiveDay}s`,
      detail: 'Best networking day',
    },
    insights.networkingStreak > 0 && {
      icon: Target,
      label: 'Streak',
      value: `${insights.networkingStreak} days`,
      detail: 'Keep it up!',
    },
    insights.avgContactsPerEvent > 0 && {
      icon: Sparkles,
      label: 'Avg per Event',
      value: insights.avgContactsPerEvent.toFixed(1),
      detail: 'contacts average',
    },
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="rounded-xl border border-border bg-card"
    >
      <div className="p-5 border-b border-border">
        <span className="text-sm font-medium text-muted-foreground">Insights</span>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-6 rounded-sm ${
                  level <= milestone.level ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div>
            <p className="text-sm font-medium">{milestone.title}</p>
            <p className="text-xs text-muted-foreground">{totalContacts} contacts</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {insightItems.map((item: any, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors"
          >
            <div className="p-2 rounded-lg bg-muted/50">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium truncate">{item.value}</p>
            </div>
            <span className="text-xs text-muted-foreground">{item.detail}</span>
          </motion.div>
        ))}
      </div>

      {totalContacts > 0 && insightItems.length === 0 && (
        <div className="p-5 text-center text-sm text-muted-foreground">
          Add more contacts to unlock insights
        </div>
      )}
    </motion.div>
  );
};
