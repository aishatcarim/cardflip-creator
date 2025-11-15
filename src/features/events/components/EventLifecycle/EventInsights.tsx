import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Users, Target, MessageSquare } from 'lucide-react';

interface EventInsightsProps {
  totalEvents: number;
  upcomingEvents: number;
  recentEvents: number;
  avgAttendees: number;
  avgContactsPerEvent: number;
  followUpRate: number;
  networkingGoalProgress: number;
}

export const EventInsights = ({
  totalEvents,
  upcomingEvents,
  recentEvents,
  avgAttendees,
  avgContactsPerEvent,
  followUpRate,
  networkingGoalProgress
}: EventInsightsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-3xl font-bold mt-1">{totalEvents}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+12% this month</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
            <p className="text-3xl font-bold mt-1">{upcomingEvents}</p>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="secondary" className="text-xs">
                Next: Tomorrow
              </Badge>
            </div>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-full">
            <Calendar className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </Card>

      {/* Average Networking Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Avg Contacts/Event</p>
            <p className="text-3xl font-bold mt-1">{avgContactsPerEvent}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+8% vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-green-500/10 rounded-full">
            <Users className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </Card>

      {/* Follow-up Rate */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Follow-up Rate</p>
            <p className="text-3xl font-bold mt-1">{followUpRate}%</p>
            <div className="flex items-center gap-1 mt-2">
              {followUpRate >= 70 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${followUpRate >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                {followUpRate >= 70 ? '+5%' : '-2%'} vs last month
              </span>
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-full">
            <MessageSquare className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </Card>

      {/* Networking Goal Progress */}
      <Card className="p-6 md:col-span-2 lg:col-span-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Monthly Networking Goal</h3>
              <p className="text-sm text-muted-foreground">
                Target: 50 new connections this month
              </p>
            </div>
          </div>
          <Badge variant={networkingGoalProgress >= 80 ? 'default' : networkingGoalProgress >= 50 ? 'secondary' : 'destructive'}>
            {networkingGoalProgress}% Complete
          </Badge>
        </div>

        <div className="w-full bg-muted rounded-full h-3 mb-2">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${networkingGoalProgress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{Math.round(networkingGoalProgress * 0.5)} connections made</span>
          <span>50 target connections</span>
        </div>
      </Card>
    </div>
  );
};
