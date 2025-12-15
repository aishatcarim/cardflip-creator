import { NetworkContact } from '@contacts/store/networkContactsStore';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentActivityFeedProps {
  contacts: NetworkContact[];
}

export const RecentActivityFeed = ({ contacts }: RecentActivityFeedProps) => {
  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <span className="text-sm font-medium text-muted-foreground">Recent Activity</span>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <User className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="rounded-xl border border-border bg-card"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <span className="text-sm font-medium text-muted-foreground">Recent Activity</span>
        <span className="text-xs text-muted-foreground">{contacts.length} recent</span>
      </div>

      <div className="divide-y divide-border">
        {contacts.slice(0, 8).map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.03 }}
            className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-muted-foreground">
                {contact.contactName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{contact.contactName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {contact.event}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(contact.taggedAt), { addSuffix: true })}
              </p>
              {contact.isQuickTag && (
                <span className="text-[10px] text-primary">Quick tag</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
