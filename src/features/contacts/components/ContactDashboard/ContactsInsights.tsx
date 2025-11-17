import { useMemo } from "react";
import { Card } from "@shared/ui/card";
import { NetworkContact } from "@contacts/store/networkContactsStore";
import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";

interface ContactsInsightsProps {
  contacts: NetworkContact[];
}

export const ContactsInsights = ({ contacts }: ContactsInsightsProps) => {
  const insights = useMemo(() => {
    const thisMonth = contacts.filter(c => {
      const date = new Date(c.taggedAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() &&
             date.getFullYear() === now.getFullYear();
    }).length;

    const followedUp = contacts.filter(c =>
      c.followUpStatus === 'done'
    ).length;

    const followUpRate = contacts.length > 0
      ? Math.round((followedUp / contacts.length) * 100)
      : 0;

    const needsAttention = contacts.filter(c => {
      const isOverdue = c.followUpDueDate &&
                       new Date(c.followUpDueDate) < new Date();
      return c.followUpStatus === 'pending' && isOverdue;
    }).length;

    return {
      total: contacts.length,
      thisMonth,
      followUpRate,
      needsAttention
    };
  }, [contacts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="group p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Contacts</p>
            <p className="text-3xl font-bold mt-1">{insights.total}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full transition-all duration-200 group-hover:bg-primary/30">
            <Users className="h-6 w-6 text-primary transition-transform duration-200 group-hover:-rotate-6" />
          </div>
        </div>
      </Card>

      <Card className="group p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-3xl font-bold mt-1">+{insights.thisMonth}</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-full transition-all duration-200 group-hover:bg-blue-500/20">
            <TrendingUp className="h-6 w-6 text-blue-500 transition-transform duration-200 group-hover:rotate-6" />
          </div>
        </div>
      </Card>

      <Card className="group p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Follow-Up Rate</p>
            <p className="text-3xl font-bold mt-1">{insights.followUpRate}%</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-full transition-all duration-200 group-hover:bg-green-500/24">
            <CheckCircle className="h-6 w-6 text-green-500 transition-transform duration-200 group-hover:-rotate-6" />
          </div>
        </div>
      </Card>

      <Card className="group p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Needs Attention</p>
            <p className="text-3xl font-bold mt-1">{insights.needsAttention}</p>
          </div>
          <div className="p-3 bg-destructive/10 rounded-full transition-all duration-200 group-hover:bg-destructive/20">
            <AlertCircle className="h-6 w-6 text-destructive transition-transform duration-200 group-hover:scale-110" />
          </div>
        </div>
      </Card>
    </div>
  );
};
