import { Card } from '@shared/ui/card';
import { NetworkContact } from '@contacts/store/networkContactsStore';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@shared/ui/badge';
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
      <Card className="p-8 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <motion.div 
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/5 border border-border/50 hover:border-primary/30 transition-all cursor-default group"
            >
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {contact.contactName}
                  </p>
                  {contact.isQuickTag && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">⚡ Quick</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {contact.event} • {contact.industry}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
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
