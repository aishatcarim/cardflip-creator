import { Card } from '@/components/ui/card';
import { NetworkContact } from '@/store/networkContactsStore';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentActivityFeedProps {
  contacts: NetworkContact[];
}

export const RecentActivityFeed = ({ contacts }: RecentActivityFeedProps) => {
  if (contacts.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">No Recent Activity</p>
            <p className="text-xs">Start tagging contacts to see them here!</p>
          </motion.div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-2">
          {contacts.map((contact, index) => (
            <motion.div 
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 hover:border-accent/20 border border-transparent transition-all cursor-default group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {contact.contactName}
                  </p>
                  {contact.isQuickTag && (
                    <Badge variant="secondary" className="text-xs">Quick</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {contact.event} • {contact.industry}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(contact.taggedAt), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
