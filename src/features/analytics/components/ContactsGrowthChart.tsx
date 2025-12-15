import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GrowthDataPoint } from '../hooks/useAnalyticsData';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactsGrowthChartProps {
  data: GrowthDataPoint[];
}

export const ContactsGrowthChart = ({ data }: ContactsGrowthChartProps) => {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-muted-foreground">Network Growth</span>
        </div>
        <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
          <TrendingUp className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">No growth data yet</p>
        </div>
      </div>
    );
  }

  const firstValue = data[0]?.count || 0;
  const lastValue = data[data.length - 1]?.count || 0;
  const growthAmount = lastValue - firstValue;
  const growthPercentage = firstValue > 0 ? ((growthAmount / firstValue) * 100).toFixed(1) : '0';
  const isPositive = growthAmount >= 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold">{payload[0].value} contacts</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card"
    >
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Network Growth</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold">{lastValue}</span>
            <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{growthPercentage}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Contacts</span>
          </div>
        </div>
      </div>

      <div className="px-2">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))' }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#growthGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-border text-xs text-muted-foreground">
        <span>Started at {firstValue}</span>
        <span className={isPositive ? 'text-emerald-600' : 'text-red-500'}>
          {isPositive ? '+' : ''}{growthAmount} total growth
        </span>
      </div>
    </motion.div>
  );
};
