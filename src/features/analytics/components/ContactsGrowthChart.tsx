import { Card } from '@shared/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GrowthDataPoint } from '../hooks/useAnalyticsData';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactsGrowthChartProps {
  data: GrowthDataPoint[];
}

export const ContactsGrowthChart = ({ data }: ContactsGrowthChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Network Growth</h3>
        </div>
        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">Your Growth Journey Starts Here</p>
            <p className="text-xs">Tag your first contact to see your network grow</p>
          </motion.div>
        </div>
      </Card>
    );
  }

  // Calculate growth metrics
  const firstValue = data[0]?.count || 0;
  const lastValue = data[data.length - 1]?.count || 0;
  const growthAmount = lastValue - firstValue;
  const growthPercentage = firstValue > 0 ? ((growthAmount / firstValue) * 100).toFixed(1) : '0';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-lg shadow-lg p-3"
        >
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm font-semibold">
            {payload[0].value} contacts
          </p>
          {payload[0].payload.growth !== undefined && (
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +{payload[0].payload.growth} this period
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  // Add growth data for each point
  const enhancedData = data.map((point, index) => ({
    ...point,
    growth: index > 0 ? point.count - data[index - 1].count : 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Network Growth</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-3">
              <p className="text-sm text-muted-foreground">Total Growth</p>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-lg font-bold">{growthAmount}</span>
                <span className="text-xs text-green-500 font-medium">
                  (+{growthPercentage}%)
                </span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                Growing
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={enhancedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.2}
              vertical={false}
            />
            <XAxis 
              dataKey="label" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorGradient)"
              animationDuration={1500}
              animationBegin={0}
              dot={{
                fill: '#fff',
                stroke: '#3b82f6',
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: '#3b82f6',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Growth Indicators */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xl font-bold">{firstValue}</p>
              <p className="text-xs text-muted-foreground">Starting</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <p className="text-xl font-bold">{lastValue}</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                +{growthAmount}
              </p>
              <p className="text-xs text-muted-foreground">Growth</p>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};