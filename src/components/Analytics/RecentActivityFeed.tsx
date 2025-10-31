import { Card } from '@/components/ui/card';
import { NetworkContact } from '@/store/networkContactsStore';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface RecentActivityFeedProps {
  contacts: NetworkContact[];
}

export const RecentActivityFeed = ({ contacts }: RecentActivityFeedProps) => {
  if (contacts.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent activity. Start tagging contacts!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div 
            key={contact.id} 
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm truncate">{contact.contactName}</p>
                {contact.isQuickTag && (
                  <Badge variant="secondary" className="text-xs">Quick</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {contact.event} • {contact.industry}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(contact.taggedAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
