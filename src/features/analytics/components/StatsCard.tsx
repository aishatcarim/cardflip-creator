import { motion, useSpring, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index?: number;
}

export const StatsCard = ({ title, value, subtitle, icon: Icon, trend, index = 0 }: StatsCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = numericValue / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-default bg-gradient-to-br from-card to-card/50 border-2 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-300" />
        <div className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
              <motion.p
                className="text-4xl font-bold mt-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                key={displayValue}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {typeof value === 'number' ? displayValue.toLocaleString() : value}
              </motion.p>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-2 font-medium">{subtitle}</p>
              )}
              {trend && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mt-3 ${
                    trend.isPositive 
                      ? 'bg-green-500/10 text-green-600 dark:text-green-500' 
                      : 'bg-red-500/10 text-red-600 dark:text-red-500'
                  }`}
                >
                  <span>{trend.isPositive ? '↑' : '↓'}</span>
                  <span>{Math.abs(trend.value)}% vs last month</span>
                </motion.div>
              )}
            </div>
            <motion.div 
              className="p-4 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-sm group-hover:shadow-md group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="h-7 w-7 text-primary" />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
