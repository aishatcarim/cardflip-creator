import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { NetworkContact } from "@contacts/store/networkContactsStore";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Progress } from "@shared/ui/progress";
import { ScrollArea } from "@shared/ui/scroll-area";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import {
  Users, TrendingUp, Clock, AlertCircle, Calendar, Briefcase,
  ChevronRight, Zap, Target, Activity, Star, ArrowUpRight,
  CheckCircle2, Mail, UserPlus, Flame, Award
} from "lucide-react";
import { format, formatDistanceToNow, subDays, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";

interface NetworkDashboardProps {
  contacts: NetworkContact[];
  onAddContact: () => void;
}

// Helper functions
const getDaysSince = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
};

const getDaysUntil = (dateString?: string) => {
  if (!dateString) return Infinity;
  const date = new Date(dateString);
  const now = new Date();
  return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500", "bg-indigo-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const NetworkDashboard = ({ contacts, onAddContact }: NetworkDashboardProps) => {
  const navigate = useNavigate();

  // Core Stats
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = subDays(now, 7);
    const monthAgo = subDays(now, 30);

    const newThisWeek = contacts.filter(c => new Date(c.taggedAt) >= weekAgo).length;
    const newLastWeek = contacts.filter(c => {
      const date = new Date(c.taggedAt);
      return date >= subDays(weekAgo, 7) && date < weekAgo;
    }).length;

    const weeklyGrowth = newLastWeek > 0 ? Math.round(((newThisWeek - newLastWeek) / newLastWeek) * 100) : newThisWeek > 0 ? 100 : 0;

    const overdue = contacts.filter(c => c.followUpDueDate && new Date(c.followUpDueDate) < now).length;
    const dueToday = contacts.filter(c => {
      if (!c.followUpDueDate) return false;
      const due = new Date(c.followUpDueDate);
      return due.toDateString() === now.toDateString();
    }).length;
    const dueSoon = contacts.filter(c => {
      const days = getDaysUntil(c.followUpDueDate);
      return days > 0 && days <= 7;
    }).length;

    const completed = contacts.filter(c => c.followUpStatus === 'done').length;
    const pending = contacts.filter(c => c.followUpStatus === 'pending').length;

    return {
      total: contacts.length,
      newThisWeek,
      weeklyGrowth,
      overdue,
      dueToday,
      dueSoon,
      completed,
      pending,
      completionRate: contacts.length > 0 ? Math.round((completed / contacts.length) * 100) : 0
    };
  }, [contacts]);

  // Priority contacts (overdue + due soon + recently added)
  const priorityContacts = useMemo(() => {
    return contacts.filter(c => {
      const daysSince = getDaysSince(c.taggedAt);
      const isOverdue = c.followUpDueDate && new Date(c.followUpDueDate) < new Date();
      const isDueSoon = c.followUpDueDate && getDaysUntil(c.followUpDueDate) <= 3;
      const isRecent = daysSince <= 2;
      return isOverdue || isDueSoon || isRecent;
    }).sort((a, b) => {
      const aOverdue = a.followUpDueDate && new Date(a.followUpDueDate) < new Date();
      const bOverdue = b.followUpDueDate && new Date(b.followUpDueDate) < new Date();
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime();
    }).slice(0, 5);
  }, [contacts]);

  // Upcoming follow-ups (next 7 days)
  const upcomingFollowUps = useMemo(() => {
    return contacts.filter(c => {
      const days = getDaysUntil(c.followUpDueDate);
      return days >= 0 && days <= 7 && c.followUpStatus !== 'done';
    }).sort((a, b) => {
      return new Date(a.followUpDueDate!).getTime() - new Date(b.followUpDueDate!).getTime();
    }).slice(0, 5);
  }, [contacts]);

  // Recent activity (last 7 days)
  const recentActivity = useMemo(() => {
    const activities: { type: string; contact: NetworkContact; date: Date; label: string }[] = [];
    
    contacts.forEach(c => {
      const taggedDate = new Date(c.taggedAt);
      if (getDaysSince(c.taggedAt) <= 7) {
        activities.push({ type: 'added', contact: c, date: taggedDate, label: 'New contact' });
      }
      if (c.followUpStatus === 'done' && c.followUpDate) {
        const followUpDate = new Date(c.followUpDate);
        if (getDaysSince(c.followUpDate) <= 7) {
          activities.push({ type: 'completed', contact: c, date: followUpDate, label: 'Followed up' });
        }
      }
    });

    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);
  }, [contacts]);

  // Event stats
  const eventStats = useMemo(() => {
    const stats: Record<string, { count: number; recent: number }> = {};
    const weekAgo = subDays(new Date(), 7);

    contacts.forEach(c => {
      const tags = c.eventTags || [c.event];
      const isRecent = new Date(c.taggedAt) >= weekAgo;
      tags.forEach(tag => {
        if (!stats[tag]) stats[tag] = { count: 0, recent: 0 };
        stats[tag].count++;
        if (isRecent) stats[tag].recent++;
      });
    });

    return Object.entries(stats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);
  }, [contacts]);

  // Industry distribution
  const industryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    contacts.forEach(c => {
      if (c.industry) {
        stats[c.industry] = (stats[c.industry] || 0) + 1;
      }
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [contacts]);

  // Networking streak (consecutive days with new contacts or follow-ups)
  const networkingStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const hasActivity = contacts.some(c => {
        const taggedDate = new Date(c.taggedAt);
        taggedDate.setHours(0, 0, 0, 0);
        if (taggedDate.getTime() === checkDate.getTime()) return true;
        
        if (c.followUpDate) {
          const followUpDate = new Date(c.followUpDate);
          followUpDate.setHours(0, 0, 0, 0);
          if (followUpDate.getTime() === checkDate.getTime()) return true;
        }
        return false;
      });

      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [contacts]);

  // Top interests across network
  const topInterests = useMemo(() => {
    const stats: Record<string, number> = {};
    contacts.forEach(c => {
      c.interests.forEach(interest => {
        stats[interest] = (stats[interest] || 0) + 1;
      });
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [contacts]);

  if (contacts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Start Your Network</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Your networking journey begins here. Add your first contact to unlock powerful insights and tracking.
        </p>
        <Button onClick={onAddContact} size="lg" className="gap-2">
          <UserPlus className="h-5 w-5" />
          Add Your First Contact
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { 
            label: "Total Network", 
            value: stats.total, 
            icon: Users, 
            color: "text-primary",
            bgColor: "bg-primary/10",
            subtitle: `${stats.newThisWeek} new this week`
          },
          { 
            label: "Follow-up Rate", 
            value: `${stats.completionRate}%`, 
            icon: Target, 
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            subtitle: `${stats.completed} completed`
          },
          { 
            label: "Needs Attention", 
            value: stats.overdue + stats.dueToday, 
            icon: AlertCircle, 
            color: stats.overdue > 0 ? "text-destructive" : "text-amber-500",
            bgColor: stats.overdue > 0 ? "bg-destructive/10" : "bg-amber-500/10",
            subtitle: stats.overdue > 0 ? `${stats.overdue} overdue` : "On track!"
          },
          { 
            label: "Streak", 
            value: `${networkingStreak}d`, 
            icon: Flame, 
            color: networkingStreak >= 7 ? "text-orange-500" : "text-muted-foreground",
            bgColor: networkingStreak >= 7 ? "bg-orange-500/10" : "bg-muted",
            subtitle: networkingStreak >= 7 ? "You're on fire!" : "Keep networking!"
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 sm:p-5 border-border/50 hover:border-border transition-all hover:shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">{stat.subtitle}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Priority & Activity */}
        <div className="lg:col-span-8 space-y-6">
          {/* Action Required Section */}
          <Card className="border-border/50 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Action Required</h3>
                    <p className="text-sm text-muted-foreground">Contacts needing your attention</p>
                  </div>
                </div>
                {priorityContacts.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {priorityContacts.length}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="divide-y divide-border/50">
              {priorityContacts.length > 0 ? (
                priorityContacts.map((contact, idx) => {
                  const isOverdue = contact.followUpDueDate && new Date(contact.followUpDueDate) < new Date();
                  const daysUntil = getDaysUntil(contact.followUpDueDate);
                  const daysSince = getDaysSince(contact.taggedAt);
                  
                  return (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    >
                      <Avatar className={`h-10 w-10 sm:h-11 sm:w-11 ${getAvatarColor(contact.contactName)}`}>
                        <AvatarFallback className="text-white text-sm font-medium">
                          {getInitials(contact.contactName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{contact.contactName}</p>
                          {daysSince <= 2 && (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.company || contact.title || contact.event}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isOverdue ? (
                          <Badge variant="destructive" className="gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="hidden sm:inline">Overdue</span>
                          </Badge>
                        ) : daysUntil <= 3 && daysUntil >= 0 ? (
                          <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                            <Clock className="h-3 w-3" />
                            <span className="hidden sm:inline">{daysUntil === 0 ? 'Today' : `${daysUntil}d`}</span>
                          </Badge>
                        ) : null}
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-green-500/10 p-3 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="font-medium text-green-600">All caught up!</p>
                  <p className="text-sm text-muted-foreground mt-1">No urgent follow-ups needed</p>
                </div>
              )}
            </div>
          </Card>

          {/* Upcoming Follow-ups */}
          <Card className="border-border/50">
            <div className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Upcoming This Week</h3>
                    <p className="text-sm text-muted-foreground">Scheduled follow-ups</p>
                  </div>
                </div>
                <Badge variant="outline">{upcomingFollowUps.length}</Badge>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {upcomingFollowUps.length > 0 ? (
                <div className="space-y-3">
                  {upcomingFollowUps.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer"
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    >
                      <div className="text-center min-w-[50px]">
                        <p className="text-lg font-bold text-primary">
                          {format(new Date(contact.followUpDueDate!), 'd')}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {format(new Date(contact.followUpDueDate!), 'MMM')}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contact.contactName}</p>
                        <p className="text-sm text-muted-foreground truncate">{contact.event}</p>
                      </div>
                      {contact.email && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${contact.email}`;
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No upcoming follow-ups scheduled</p>
                  <p className="text-xs mt-1">Set follow-up dates when adding contacts</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Activity Timeline */}
          <Card className="border-border/50">
            <div className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">Your networking timeline</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {recentActivity.length > 0 ? (
                <div className="relative space-y-4">
                  <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
                  {recentActivity.map((activity, idx) => (
                    <motion.div
                      key={`${activity.contact.id}-${activity.type}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4 relative"
                    >
                      <div className={`relative z-10 p-1.5 rounded-full ${
                        activity.type === 'added' ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {activity.type === 'added' ? (
                          <UserPlus className="h-3 w-3 text-white" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{activity.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.date, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {activity.contact.contactName} {activity.contact.company && `• ${activity.contact.company}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs mt-1">Start adding contacts to see your timeline</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Network by Event */}
          <Card className="border-border/50">
            <div className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Top Events</h3>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              {eventStats.length > 0 ? (
                eventStats.map(([event, data], idx) => (
                  <motion.div
                    key={event}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate max-w-[150px]">{event}</span>
                      <div className="flex items-center gap-2">
                        {data.recent > 0 && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                            +{data.recent}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">{data.count}</span>
                      </div>
                    </div>
                    <Progress value={(data.count / stats.total) * 100} className="h-1.5" />
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No events yet</p>
              )}
            </div>
          </Card>

          {/* Industry Distribution */}
          <Card className="border-border/50">
            <div className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Industries</h3>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {industryStats.length > 0 ? (
                industryStats.map(([industry, count], idx) => (
                  <motion.div
                    key={industry}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" style={{ opacity: 1 - (idx * 0.15) }} />
                      <span className="text-sm truncate max-w-[120px]">{industry}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No industries yet</p>
              )}
            </div>
          </Card>

          {/* Common Interests */}
          <Card className="border-border/50">
            <div className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Common Interests</h3>
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="p-4 sm:p-5">
              {topInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topInterests.map(([interest, count]) => (
                    <Badge key={interest} variant="secondary" className="gap-1">
                      {interest}
                      <span className="text-muted-foreground">({count})</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No interests tracked yet</p>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="p-4 sm:p-5">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={onAddContact}
                >
                  <UserPlus className="h-4 w-4" />
                  Add New Contact
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/events')}
                >
                  <Calendar className="h-4 w-4" />
                  View Events
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate('/analytics')}
                >
                  <Activity className="h-4 w-4" />
                  See Analytics
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};