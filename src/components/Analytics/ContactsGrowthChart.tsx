import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GrowthDataPoint } from '@/hooks/useAnalyticsData';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactsGrowthChartProps {
  data: GrowthDataPoint[];
}

export const ContactsGrowthChart = ({ data }: ContactsGrowthChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contacts Growth Over Time</h3>
        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Your Growth Journey Starts Here</p>
            <p className="text-xs">Tag your first contact to see your network grow!</p>
          </motion.div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Network Growth</h3>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-500 font-semibold">Growing</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
            <XAxis 
              dataKey="label" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--card))', stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              fill="url(#colorCount)"
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
