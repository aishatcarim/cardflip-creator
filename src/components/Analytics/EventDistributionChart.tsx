import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EventStat } from '@/hooks/useAnalyticsData';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventDistributionChartProps {
  data: EventStat[];
}

const COLORS = [
  'hsl(210 100% 50%)',
  'hsl(280 80% 60%)',
  'hsl(160 80% 45%)',
  'hsl(40 95% 55%)',
  'hsl(340 80% 60%)',
  'hsl(190 70% 50%)',
];

export const EventDistributionChart = ({ data }: EventDistributionChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Event Distribution</h3>
        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">No Events Yet</p>
            <p className="text-xs">Tag contacts at events to see distribution!</p>
          </motion.div>
        </div>
      </Card>
    );
  }

  // Take top 5 events, combine rest as "Other"
  const topEvents = data.slice(0, 5);
  const otherCount = data.slice(5).reduce((sum, event) => sum + event.count, 0);
  
  const chartData = otherCount > 0 
    ? [...topEvents, { name: 'Other', count: otherCount }]
    : topEvents;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold mb-4">Event Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="count"
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
