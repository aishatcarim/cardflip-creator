import { Button } from '@shared/ui/button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-bold text-foreground mb-3 max-w-sm">
        {title}
      </h3>

      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="flex gap-3">
          {action}
        </div>
      )}
    </motion.div>
  );
};
