import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IndustryStat } from '@analytics/hooks/useAnalyticsData';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface IndustryBreakdownChartProps {
  data: IndustryStat[];
}

export const IndustryBreakdownChart = ({ data }: IndustryBreakdownChartProps) => {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 h-full">
        <span className="text-sm font-medium text-muted-foreground">Industry Breakdown</span>
        <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
          <Briefcase className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">No industry data yet</p>
        </div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  const total = sortedData.reduce((sum, ind) => sum + ind.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(0);
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg px-3 py-2">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value} contacts ({percentage}%)
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
      transition={{ duration: 0.3, delay: 0.15 }}
      className="rounded-xl border border-border bg-card h-full"
    >
      <div className="p-5 pb-0">
        <span className="text-sm font-medium text-muted-foreground">Industry Breakdown</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-semibold">{sortedData.length}</span>
          <span className="text-xs text-muted-foreground">industries</span>
        </div>
      </div>

      <div className="px-2">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sortedData} layout="vertical" margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={80}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="px-5 py-4 border-t border-border text-xs text-muted-foreground">
        {total} contacts across {sortedData.length} industries
      </div>
    </motion.div>
  );
};
