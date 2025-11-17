import { Card } from '@shared/ui/card';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { EventStat } from '../hooks/useAnalyticsData';
import { Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventDistributionChartProps {
  data: EventStat[];
}

const COLORS = [
  '#3b82f6',   // Blue
  '#8b5cf6',   // Purple
  '#10b981',   // Green
  '#f59e0b',   // Orange
  '#ec4899',   // Pink
  '#06b6d4',   // Cyan
  '#eab308',   // Yellow
  '#a855f7',   // Violet
];

export const EventDistributionChart = ({ data }: EventDistributionChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Event Distribution</h3>
        </div>
        <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No Events Yet</p>
            <p className="text-xs">Tag contacts at events to see distribution</p>
          </motion.div>
        </div>
      </Card>
    );
  }

  // Sort by count and take top 6 events for better visualization
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  
  // Calculate total for percentages
  const total = sortedData.reduce((sum, event) => sum + event.count, 0);
  
  // Find max value for scaling
  const maxValue = Math.max(...sortedData.map(e => e.count));
  
  // Format data for radial chart
  const chartData = sortedData.map((event, index) => ({
    name: event.name.length > 18 ? event.name.substring(0, 18) + '...' : event.name,
    fullName: event.name,
    value: event.count,
    fill: COLORS[index % COLORS.length],
    percentage: ((event.count / total) * 100).toFixed(1),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-lg shadow-lg p-3"
        >
          <p className="font-semibold text-sm mb-1">{payload[0].payload.fullName}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].payload.value} contacts ({payload[0].payload.percentage}%)
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <motion.div
            key={`legend-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground truncate">
              {entry.payload.name} ({entry.payload.value})
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Event Distribution</h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Top {chartData.length} events</span>
          </div>
        </div>

        <div className="relative">
          <ResponsiveContainer width="100%" height={320}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            animationDuration={1200}
            animationBegin={0}
          />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                content={<CustomLegend />}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs  mt-1">Total Contacts</p>
            </div>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-xl font-bold">{sortedData.length}</p>
              <p className="text-xs text-muted-foreground">Events</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <p className="text-xl font-bold">{Math.round(total / sortedData.length)}</p>
              <p className="text-xs text-muted-foreground">Avg/Event</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-xl font-bold">{sortedData[0]?.name.substring(0, 10)}</p>
              <p className="text-xs text-muted-foreground">Top Event</p>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};