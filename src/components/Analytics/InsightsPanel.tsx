import { Card } from '@/components/ui/card';
import { Insights } from '@/hooks/useAnalyticsData';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Insights & Achievements</h3>
        </div>

        <div className="space-y-4">
          {/* Milestone Badge */}
          <motion.div 
            className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                {milestone.emoji}
              </motion.span>
              <div>
                <p className="font-semibold text-primary">{milestone.title}</p>
                <p className="text-sm text-muted-foreground">{totalContacts} contacts and counting!</p>
              </div>
            </div>
          </motion.div>

          {/* Key Insights */}
          <div className="space-y-3">
            {insights.topEvent && (
              <motion.div 
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors cursor-default"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Top Networking Event</p>
                  <p className="text-sm text-muted-foreground">
                    {insights.topEvent.name} ({insights.topEvent.count} contacts)
                  </p>
                </div>
              </motion.div>
            )}

            {insights.mostActiveDay !== 'N/A' && (
              <motion.div 
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors cursor-default"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Most Active Day</p>
                  <p className="text-sm text-muted-foreground">
                    You're most active on {insights.mostActiveDay}s
                  </p>
                </div>
              </motion.div>
            )}

            {insights.networkingStreak > 0 && (
              <motion.div 
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors cursor-default"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Networking Streak</p>
                  <p className="text-sm text-muted-foreground">
                    {insights.networkingStreak} day{insights.networkingStreak !== 1 ? 's' : ''} streak! 🔥
                  </p>
                </div>
              </motion.div>
            )}

            {insights.avgContactsPerEvent > 0 && (
              <motion.div 
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors cursor-default"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Average Contacts per Event</p>
                  <p className="text-sm text-muted-foreground">
                    {insights.avgContactsPerEvent.toFixed(1)} contacts on average
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Encouragement Message */}
          {totalContacts > 0 && (
            <motion.div 
              className="p-4 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-foreground/80 leading-relaxed">
                {totalContacts < 10 && "🌱 Great start! Keep building your network, one connection at a time."}
                {totalContacts >= 10 && totalContacts < 50 && "🚀 You're building momentum! Your network is growing steadily."}
                {totalContacts >= 50 && totalContacts < 100 && "⭐ Impressive network! You're becoming a true connector."}
                {totalContacts >= 100 && "🏆 Outstanding networking! You're a super connector with an amazing network."}
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
