import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { EventStat } from '../hooks/useAnalyticsData';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventDistributionChartProps {
  data: EventStat[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(250 60% 55%)',
  'hsl(160 60% 45%)',
  'hsl(35 90% 50%)',
  'hsl(340 65% 55%)',
  'hsl(190 70% 45%)',
];

export const EventDistributionChart = ({ data }: EventDistributionChartProps) => {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 h-full">
        <span className="text-sm font-medium text-muted-foreground">Event Distribution</span>
        <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
          <Calendar className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">No events yet</p>
        </div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  const total = sortedData.reduce((sum, event) => sum + event.count, 0);

  const chartData = sortedData.map((event, index) => ({
    name: event.name,
    value: event.count,
    fill: COLORS[index % COLORS.length],
    percentage: ((event.count / total) * 100).toFixed(0),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg px-3 py-2">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value} contacts ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-xl border border-border bg-card h-full"
    >
      <div className="p-5 pb-0">
        <span className="text-sm font-medium text-muted-foreground">Event Distribution</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-semibold">{sortedData.length}</span>
          <span className="text-xs text-muted-foreground">events</span>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2 pr-5 space-y-2">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-muted-foreground truncate text-xs">
                  {entry.name.length > 15 ? entry.name.substring(0, 15) + '...' : entry.name}
                </span>
              </div>
              <span className="text-xs font-medium ml-2">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-border text-xs text-muted-foreground">
        {total} total contacts across events
      </div>
    </motion.div>
  );
};
