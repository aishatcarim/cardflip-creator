import { Card } from '@shared/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndustryStat } from '@analytics/hooks/useAnalyticsData';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface IndustryBreakdownChartProps {
  data: IndustryStat[];
}

const COLORS = [
  'hsl(210 100% 50%)',
  'hsl(280 80% 60%)',
  'hsl(160 80% 45%)',
  'hsl(40 95% 55%)',
  'hsl(340 80% 60%)',
  'hsl(190 70% 50%)',
  'hsl(30 90% 55%)',
  'hsl(250 70% 60%)',
];

export const IndustryBreakdownChart = ({ data }: IndustryBreakdownChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Industry Breakdown</h3>
        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">No Industry Data Yet</p>
            <p className="text-xs">Add contact industries to see breakdown!</p>
          </motion.div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-8 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Top Industries</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
            <XAxis 
              type="number"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <YAxis 
              dataKey="name" 
              type="category"
              width={100}
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
              cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 8, 8, 0]}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
