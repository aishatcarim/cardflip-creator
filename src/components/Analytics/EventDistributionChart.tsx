import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EventStat } from '@/hooks/useAnalyticsData';

interface EventDistributionChartProps {
  data: EventStat[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const EventDistributionChart = ({ data }: EventDistributionChartProps) => {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Event Distribution</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>No events yet. Tag contacts at events to see distribution!</p>
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
    <Card className="p-6">
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
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
