import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Moon, Minus } from 'lucide-react';
import { Badge } from '@shared/ui/badge';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { NetworkContact } from '@contacts/store/networkContactsStore';

interface FollowUpStatusBadgeProps {
  status?: NetworkContact['followUpStatus'];
  dueDate?: string;
  completedDate?: string;
  snoozedUntil?: string;
}

export const FollowUpStatusBadge = ({ 
  status = 'none', 
  dueDate, 
  completedDate, 
  snoozedUntil 
}: FollowUpStatusBadgeProps) => {
  const getBadgeContent = () => {
    switch (status) {
      case 'done':
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          text: completedDate ? `Done ${format(new Date(completedDate), 'MMM d')}` : 'Completed',
          className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
        };
      
      case 'pending':
        const isOverdue = dueDate && isPast(new Date(dueDate));
        return {
          icon: <Clock className="h-3 w-3" />,
          text: dueDate 
            ? isOverdue 
              ? 'Overdue!' 
              : `Due ${formatDistanceToNow(new Date(dueDate), { addSuffix: true })}`
            : 'Follow-up pending',
          className: isOverdue 
            ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
            : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
        };
      
      case 'snoozed':
        return {
          icon: <Moon className="h-3 w-3" />,
          text: snoozedUntil 
            ? `Until ${format(new Date(snoozedUntil), 'MMM d')}`
            : 'Snoozed',
          className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
        };
      
      default:
        return {
          icon: <Minus className="h-3 w-3" />,
          text: 'No follow-up',
          className: 'bg-muted text-muted-foreground border-muted'
        };
    }
  };

  const { icon, text, className } = getBadgeContent();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
        {icon}
        <span className="text-xs">{text}</span>
      </Badge>
    </motion.div>
  );
};
